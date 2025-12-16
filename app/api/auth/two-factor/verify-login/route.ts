import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verifyTOTP, decryptSecret, verifyBackupCode } from "@/lib/two-factor";
import { z } from "zod";
import { checkRateLimit, getClientIP, rateLimitResponse, resetRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

const verifySchema = z.object({
  token: z.string().min(6).max(10, "Le code doit faire entre 6 et 10 caractères"),
  isBackupCode: z.boolean().optional().default(false),
  rememberDevice: z.boolean().optional().default(false),
});

// Durée de validité du token de confiance (3 jours)
const TRUST_TOKEN_EXPIRY_DAYS = 3;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Rate limiting par utilisateur
    const rateLimitResult = checkRateLimit('twoFactor', session.user.id);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { token, isBackupCode, rememberDevice } = validation.data;

    // Récupérer le secret 2FA de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
        backupCodes: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA non activé pour cet utilisateur" },
        { status: 400 }
      );
    }

    let isValid = false;
    let usedBackupCodeIndex = -1;

    if (isBackupCode) {
      // Vérifier avec un code de secours
      const result = verifyBackupCode(token, user.backupCodes);
      isValid = result.valid;
      usedBackupCodeIndex = result.index;
    } else {
      // Vérifier avec le code TOTP (déchiffrer d'abord le secret)
      try {
        const decryptedSecret = decryptSecret(user.twoFactorSecret);
        console.log('[2FA Login] Secret déchiffré, longueur:', decryptedSecret.length);
        isValid = verifyTOTP(decryptedSecret, token);
      } catch (decryptError) {
        console.error('[2FA Login] Erreur déchiffrement:', decryptError);
        return NextResponse.json(
          { error: "Erreur de configuration 2FA. Contactez le support." },
          { status: 400 }
        );
      }
    }

    if (!isValid) {
      // Log de tentative échouée pour audit
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "2FA_VERIFICATION_FAILED",
          entity: "User",
          entityId: user.id,
          newData: { reason: isBackupCode ? "Invalid backup code" : "Invalid TOTP" },
        },
      });

      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Si c'était un code de secours, le retirer de la liste
    if (isBackupCode && usedBackupCodeIndex !== -1) {
      const updatedBackupCodes = [...user.backupCodes];
      updatedBackupCodes.splice(usedBackupCodeIndex, 1);
      await prisma.user.update({
        where: { id: user.id },
        data: { backupCodes: updatedBackupCodes },
      });
    }

    // Réinitialiser le rate limit après succès
    resetRateLimit('twoFactor', session.user.id);

    // Générer un token de confiance si demandé
    let rememberToken: string | undefined;
    
    if (rememberDevice) {
      rememberToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rememberToken).digest('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + TRUST_TOKEN_EXPIRY_DAYS);

      // Stocker le token hashé en base (via SystemConfig pour simplicité)
      // On préfixe avec l'userId pour pouvoir le retrouver
      await prisma.systemConfig.upsert({
        where: { key: `2fa_trust_${user.id}_${hashedToken.substring(0, 16)}` },
        create: {
          key: `2fa_trust_${user.id}_${hashedToken.substring(0, 16)}`,
          value: JSON.stringify({
            hashedToken,
            userId: user.id,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
          }),
        },
        update: {
          value: JSON.stringify({
            hashedToken,
            userId: user.id,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
          }),
        },
      });

      console.log('[2FA] Token de confiance généré pour', user.id);
    }

    // Log de vérification réussie
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "2FA_VERIFICATION_SUCCESS",
        entity: "User",
        entityId: user.id,
        newData: rememberDevice ? { rememberDevice: true } : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vérification 2FA réussie",
      rememberToken, // Sera undefined si rememberDevice est false
    });
  } catch (error) {
    console.error("Erreur verification 2FA:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

