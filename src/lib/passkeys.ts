/**
 * WebAuthn / Passkeys - Authentification sans mot de passe
 * 
 * Implémentation conforme FIDO2/WebAuthn
 * Compatible avec Touch ID, Face ID, Windows Hello, YubiKey, etc.
 */

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
import prisma from './prisma';
import { WEBAUTHN_RP_ID, WEBAUTHN_RP_NAME, BASE_URL } from '@/config/env';

// Configuration centralisée
const RP_NAME = WEBAUTHN_RP_NAME;
const RP_ID = WEBAUTHN_RP_ID;
const ORIGIN = BASE_URL;

// Liste des origins autorisées en développement
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [ORIGIN];
  
  // En développement, autoriser aussi les accès via IP locale
  if (process.env.NODE_ENV === 'development') {
    // Autoriser localhost avec et sans port
    origins.push('http://localhost:3000');
    origins.push('http://127.0.0.1:3000');
    
    // Récupérer les IPs de la variable d'environnement si définie
    if (process.env.ALLOWED_IPS) {
      const ips = process.env.ALLOWED_IPS.split(',');
      ips.forEach(ip => {
        origins.push(`http://${ip.trim()}:3000`);
      });
    }
    
    // Autoriser aussi les IPs réseau locales courantes
    origins.push('http://192.168.1.1:3000');
    origins.push('http://192.168.0.1:3000');
    origins.push('http://172.20.10.4:3000'); // IP spécifique de l'utilisateur
  }
  
  // Dédupliquer
  return [...new Set(origins)];
};

// Durée de validité du challenge (5 minutes)
const CHALLENGE_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Encode un Uint8Array en base64url
 */
function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
  const base64 = Buffer.from(uint8Array).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode une chaîne base64url en Uint8Array
 */
function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const buffer = Buffer.from(paddedBase64, 'base64');
  return new Uint8Array(buffer);
}

/**
 * Génère les options pour l'enregistrement d'une nouvelle Passkey
 */
export async function generatePasskeyRegistrationOptions(
  userId: string,
  userEmail: string,
  userName?: string
): Promise<{ options: PublicKeyCredentialCreationOptionsJSON; challenge: string }> {
  // Récupérer les passkeys existantes de l'utilisateur (pour éviter les doublons)
  const existingPasskeys = await prisma.passkey.findMany({
    where: { userId },
    select: { credentialId: true, transports: true },
  });

  const excludeCredentials = existingPasskeys.map((pk) => ({
    id: base64UrlToUint8Array(pk.credentialId),
    type: 'public-key' as const,
    transports: pk.transports as AuthenticatorTransportFuture[],
  }));

  const userIdBytes = new TextEncoder().encode(userId);
  const userIdBase64 = uint8ArrayToBase64Url(userIdBytes);
  
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: userIdBase64,
    userName: userEmail,
    userDisplayName: userName || userEmail,
    attestationType: 'none', // "none" pour plus de compatibilité
    excludeCredentials,
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      // Pas de restriction sur authenticatorAttachment - permet Touch ID, clés USB, etc.
    },
    timeout: 120000, // 2 minutes
  });

  // Construire explicitement l'objet pour le client
  // (éviter les problèmes de sérialisation avec Uint8Array)
  const optionsForClient: PublicKeyCredentialCreationOptionsJSON = {
    challenge: options.challenge,
    rp: {
      name: options.rp.name,
      id: options.rp.id || RP_ID,
    },
    user: {
      id: uint8ArrayToBase64Url(userIdBytes),
      name: options.user.name,
      displayName: options.user.displayName,
    },
    pubKeyCredParams: options.pubKeyCredParams.map(p => ({
      type: p.type,
      alg: p.alg,
    })),
    timeout: options.timeout,
    attestation: options.attestation,
    excludeCredentials: existingPasskeys.map(pk => ({
      type: 'public-key' as const,
      id: pk.credentialId, // En base64url depuis la DB
      transports: pk.transports as AuthenticatorTransportFuture[],
    })),
    authenticatorSelection: options.authenticatorSelection ? {
      authenticatorAttachment: options.authenticatorSelection.authenticatorAttachment,
      residentKey: options.authenticatorSelection.residentKey,
      requireResidentKey: options.authenticatorSelection.requireResidentKey,
      userVerification: options.authenticatorSelection.userVerification,
    } : undefined,
  };

  console.log('[Passkey] Options générées:', {
    rpId: RP_ID,
    origin: ORIGIN,
    userId: optionsForClient.user.id.substring(0, 20) + '...',
    challenge: options.challenge.substring(0, 20) + '...',
  });

  // Stocker le challenge en base
  await prisma.webAuthnChallenge.create({
    data: {
      challenge: options.challenge,
      userId,
      type: 'registration',
      expiresAt: new Date(Date.now() + CHALLENGE_EXPIRY_MS),
    },
  });

  return { 
    options: optionsForClient, 
    challenge: options.challenge 
  };
}

/**
 * Vérifie et enregistre une nouvelle Passkey
 */
export async function verifyPasskeyRegistration(
  userId: string,
  response: RegistrationResponseJSON,
  challenge: string,
  deviceName?: string
): Promise<{ success: boolean; error?: string; passkeyId?: string }> {
  try {
    // Vérifier le challenge
    const storedChallenge = await prisma.webAuthnChallenge.findUnique({
      where: { challenge },
    });

    if (!storedChallenge) {
      return { success: false, error: 'Challenge invalide' };
    }

    if (storedChallenge.expiresAt < new Date()) {
      await prisma.webAuthnChallenge.delete({ where: { id: storedChallenge.id } });
      return { success: false, error: 'Challenge expiré' };
    }

    if (storedChallenge.userId !== userId) {
      return { success: false, error: 'Challenge invalide pour cet utilisateur' };
    }

    // Vérifier la réponse WebAuthn
    let verification: VerifiedRegistrationResponse;
    const allowedOrigins = getAllowedOrigins();
    
    try {
      console.log('[Passkey] Vérification avec:', {
        expectedOrigins: allowedOrigins,
        expectedRPID: RP_ID,
        responseId: response.id?.substring(0, 20) + '...',
      });

      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: allowedOrigins,
        expectedRPID: RP_ID,
      });
    } catch (verifyError) {
      console.error('[Passkey] Erreur vérification:', verifyError);
      return { success: false, error: 'Vérification de la passkey échouée' };
    }

    if (!verification.verified || !verification.registrationInfo) {
      return { success: false, error: 'Enregistrement de la passkey échoué' };
    }

    const { credentialID, credentialPublicKey, counter, credentialDeviceType, aaguid } = verification.registrationInfo;

    // Encoder les données pour stockage
    const credentialIdBase64 = Buffer.from(credentialID).toString('base64url');
    const publicKeyBase64 = Buffer.from(credentialPublicKey).toString('base64url');

    // Créer la passkey en base
    const passkey = await prisma.passkey.create({
      data: {
        userId,
        credentialId: credentialIdBase64,
        publicKey: publicKeyBase64,
        counter: BigInt(counter),
        deviceName: deviceName || 'Appareil inconnu',
        deviceType: credentialDeviceType,
        transports: response.response.transports || [],
        aaguid: aaguid || null,
      },
    });

    // Supprimer le challenge utilisé
    await prisma.webAuthnChallenge.delete({ where: { id: storedChallenge.id } });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSKEY_REGISTERED',
        entity: 'Passkey',
        entityId: passkey.id,
        newData: { deviceName, deviceType: credentialDeviceType },
      },
    });

    return { success: true, passkeyId: passkey.id };
  } catch (error) {
    console.error('[Passkey] Erreur registration:', error);
    return { success: false, error: 'Erreur lors de l\'enregistrement' };
  }
}

/**
 * Génère les options pour l'authentification via Passkey
 */
export async function generatePasskeyAuthenticationOptions(
  userEmail?: string
): Promise<{ options: PublicKeyCredentialRequestOptionsJSON; challenge: string }> {
  // Récupérer les passkeys de l'utilisateur (si email fourni)
  let userPasskeys: { credentialId: string; transports: string[] }[] = [];
  let userId: string | null = null;

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() },
      select: { 
        id: true,
        passkeys: {
          select: { credentialId: true, transports: true },
        },
      },
    });

    if (user && user.passkeys.length > 0) {
      userId = user.id;
      userPasskeys = user.passkeys;
    }
  }

  // Convertir pour l'API (Uint8Array)
  const allowCredentialsForAPI = userPasskeys.length > 0 ? userPasskeys.map((pk) => ({
    id: base64UrlToUint8Array(pk.credentialId),
    type: 'public-key' as const,
    transports: pk.transports as AuthenticatorTransportFuture[],
  })) : undefined;

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'preferred',
    allowCredentials: allowCredentialsForAPI,
    timeout: 60000,
  });

  // Stocker le challenge
  await prisma.webAuthnChallenge.create({
    data: {
      challenge: options.challenge,
      userId,
      type: 'authentication',
      expiresAt: new Date(Date.now() + CHALLENGE_EXPIRY_MS),
    },
  });

  // Construire les options pour le client (avec strings base64url)
  const optionsForClient: PublicKeyCredentialRequestOptionsJSON = {
    challenge: options.challenge,
    timeout: options.timeout,
    rpId: options.rpId || RP_ID,
    userVerification: options.userVerification,
    allowCredentials: userPasskeys.length > 0 ? userPasskeys.map((pk) => ({
      id: pk.credentialId,
      type: 'public-key' as const,
      transports: pk.transports as AuthenticatorTransportFuture[],
    })) : undefined,
  };

  return { 
    options: optionsForClient, 
    challenge: options.challenge 
  };
}

/**
 * Vérifie une authentification via Passkey
 */
export async function verifyPasskeyAuthentication(
  response: AuthenticationResponseJSON,
  challenge: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Vérifier le challenge
    const storedChallenge = await prisma.webAuthnChallenge.findUnique({
      where: { challenge },
    });

    if (!storedChallenge) {
      return { success: false, error: 'Challenge invalide' };
    }

    if (storedChallenge.expiresAt < new Date()) {
      await prisma.webAuthnChallenge.delete({ where: { id: storedChallenge.id } });
      return { success: false, error: 'Challenge expiré' };
    }

    // Trouver la passkey par credential ID
    const credentialIdBase64 = response.id;
    const passkey = await prisma.passkey.findUnique({
      where: { credentialId: credentialIdBase64 },
      include: { user: { select: { id: true, email: true, role: true, userType: true } } },
    });

    if (!passkey) {
      return { success: false, error: 'Passkey non reconnue' };
    }

    // Décoder la clé publique
    const publicKey = Buffer.from(passkey.publicKey, 'base64url');

    // Vérifier la réponse WebAuthn
    let verification: VerifiedAuthenticationResponse;
    const allowedOrigins = getAllowedOrigins();
    
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: allowedOrigins,
        expectedRPID: RP_ID,
        authenticator: {
          credentialID: base64UrlToUint8Array(passkey.credentialId),
          credentialPublicKey: publicKey,
          counter: Number(passkey.counter),
          transports: passkey.transports as AuthenticatorTransportFuture[],
        },
      });
    } catch (verifyError) {
      console.error('[Passkey] Erreur vérification auth:', verifyError);
      return { success: false, error: 'Vérification échouée' };
    }

    if (!verification.verified) {
      return { success: false, error: 'Authentification échouée' };
    }

    // Mettre à jour le counter et lastUsedAt
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Supprimer le challenge utilisé
    await prisma.webAuthnChallenge.delete({ where: { id: storedChallenge.id } });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: passkey.userId,
        action: 'PASSKEY_AUTHENTICATION',
        entity: 'User',
        entityId: passkey.userId,
        newData: { passkeyId: passkey.id, deviceName: passkey.deviceName },
      },
    });

    return { success: true, userId: passkey.userId };
  } catch (error) {
    console.error('[Passkey] Erreur authentication:', error);
    return { success: false, error: 'Erreur lors de l\'authentification' };
  }
}

/**
 * Liste les passkeys d'un utilisateur
 */
export async function getUserPasskeys(userId: string) {
  return prisma.passkey.findMany({
    where: { userId },
    select: {
      id: true,
      deviceName: true,
      deviceType: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Supprime une passkey
 */
export async function deletePasskey(userId: string, passkeyId: string): Promise<boolean> {
  const passkey = await prisma.passkey.findFirst({
    where: { id: passkeyId, userId },
  });

  if (!passkey) {
    return false;
  }

  await prisma.passkey.delete({ where: { id: passkeyId } });

  // Log d'audit
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'PASSKEY_DELETED',
      entity: 'Passkey',
      entityId: passkeyId,
      oldData: { deviceName: passkey.deviceName },
    },
  });

  return true;
}

/**
 * Nettoie les challenges expirés (à appeler périodiquement)
 */
export async function cleanupExpiredChallenges(): Promise<number> {
  const result = await prisma.webAuthnChallenge.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}

// Types pour les options (compatibles avec le client)
export interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: { type: string; alg: number }[];
  timeout?: number;
  excludeCredentials?: { type: string; id: string; transports?: string[] }[];
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    residentKey?: string;
    requireResidentKey?: boolean;
    userVerification?: string;
  };
  attestation?: string;
}

export interface PublicKeyCredentialRequestOptionsJSON {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: { type: string; id: string; transports?: string[] }[];
  userVerification?: string;
}

