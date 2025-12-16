/**
 * Utilitaires pour l'authentification à deux facteurs (2FA) TOTP
 * Compatible avec Google Authenticator, Authy, etc.
 */

import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import crypto from 'crypto';

const ISSUER = 'Cyrélis';
const ALGORITHM = 'SHA1';
const DIGITS = 6;
const PERIOD = 30;

// Clé de chiffrement pour les secrets TOTP
// IMPORTANT: Doit être définie en variable d'environnement pour la production
const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY;

// Vérifie si le chiffrement est activé
const isEncryptionEnabled = !!ENCRYPTION_KEY && ENCRYPTION_KEY.length >= 32;

/**
 * Chiffre le secret TOTP pour le stockage en base
 * Si pas de clé de chiffrement, retourne le secret avec un préfixe "plain:"
 */
export function encryptSecret(secret: string): string {
  if (!isEncryptionEnabled) {
    // Pas de chiffrement - préfixer pour identifier
    console.warn('[2FA] TOTP_ENCRYPTION_KEY non définie - secrets stockés en clair');
    return `plain:${secret}`;
  }

  try {
    const key = Buffer.from(ENCRYPTION_KEY!.slice(0, 32), 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `enc:${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[2FA] Erreur chiffrement:', error);
    // Fallback: stocker en clair
    return `plain:${secret}`;
  }
}

/**
 * Déchiffre le secret TOTP depuis la base
 */
export function decryptSecret(storedSecret: string): string {
  // Secret en clair (préfixé "plain:")
  if (storedSecret.startsWith('plain:')) {
    return storedSecret.slice(6);
  }

  // Ancien format sans préfixe (migration)
  if (!storedSecret.startsWith('enc:')) {
    // Essayer l'ancien format iv:encrypted
    if (storedSecret.includes(':') && !isEncryptionEnabled) {
      // Ancien format mais pas de clé - impossible de déchiffrer
      console.error('[2FA] Secret chiffré mais pas de clé disponible');
      throw new Error('Impossible de déchiffrer le secret 2FA');
    }
    // Supposer que c'est un secret en clair (ancien format)
    return storedSecret;
  }

  // Format chiffré "enc:iv:encrypted"
  if (!isEncryptionEnabled) {
    console.error('[2FA] Secret chiffré mais TOTP_ENCRYPTION_KEY non définie');
    throw new Error('Clé de chiffrement manquante');
  }

  try {
    const parts = storedSecret.split(':');
    const ivHex = parts[1];
    const encrypted = parts[2];
    
    const key = Buffer.from(ENCRYPTION_KEY!.slice(0, 32), 'utf8');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('[2FA] Erreur déchiffrement:', error);
    throw new Error('Impossible de déchiffrer le secret 2FA');
  }
}

/**
 * Génère un nouveau secret TOTP
 */
export function generateTOTPSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

/**
 * Crée l'URL otpauth:// pour le QR code
 */
export function generateTOTPUri(secret: string, email: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: secret,
  });
  return totp.toString();
}

/**
 * Génère le QR code en base64
 */
export async function generateQRCode(uri: string): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(uri, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0F172A', // Cyrelis Blue
        light: '#FFFFFF',
      },
    });
    return qrCode;
  } catch (error) {
    console.error('Erreur génération QR code:', error);
    throw new Error('Impossible de générer le QR code');
  }
}

/**
 * Vérifie un code TOTP
 */
export function verifyTOTP(secret: string, token: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: ISSUER,
      algorithm: ALGORITHM,
      digits: DIGITS,
      period: PERIOD,
      secret: secret,
    });

    // Accepte une fenêtre de +/- 2 périodes (60 secondes avant/après)
    // pour compenser les décalages d'horloge
    const delta = totp.validate({ token, window: 2 });
    
    console.log('[2FA] Vérification TOTP:', { 
      tokenLength: token.length, 
      secretLength: secret.length,
      delta,
      isValid: delta !== null 
    });
    
    return delta !== null;
  } catch (error) {
    console.error('[2FA] Erreur vérification TOTP:', error);
    return false;
  }
}

/**
 * Génère des codes de secours (backup codes)
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Format: XXXX-XXXX
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

/**
 * Hash un code de secours pour le stockage
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code.replace('-', '')).digest('hex');
}

/**
 * Vérifie un code de secours
 */
export function verifyBackupCode(code: string, hashedCodes: string[]): { valid: boolean; index: number } {
  const normalizedCode = code.replace('-', '').toUpperCase();
  const hash = crypto.createHash('sha256').update(normalizedCode).digest('hex');
  
  const index = hashedCodes.findIndex(h => h === hash);
  return { valid: index !== -1, index };
}

/**
 * Vérifie si la 2FA est requise pour un type d'utilisateur
 */
export function is2FARequired(userType: 'INTERNAL' | 'CLIENT'): boolean {
  // Obligatoire pour l'équipe interne Cyrélis
  return userType === 'INTERNAL';
}
