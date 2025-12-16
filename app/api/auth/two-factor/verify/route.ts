import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verifyTOTP, decryptSecret, verifyBackupCode } from "@/lib/two-factor";
import { z } from "zod";

const verifySchema = z.object({
  code: z.string().min(6).max(10),
  isBackupCode: z.boolean().optional().default(false),
});

// POST - Vérifie un code TOTP et active la 2FA
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, isBackupCode } = verifySchema.parse(body);

    // Récupérer l'utilisateur avec son secret
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
        twoFactorVerified: true,
        backupCodes: true,
      },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "Configuration 2FA non trouvée. Veuillez recommencer le setup." },
        { status: 400 }
      );
    }

    let isValid = false;
    let usedBackupCodeIndex = -1;

    if (isBackupCode) {
      // Vérifier avec un code de secours
      const result = verifyBackupCode(code, user.backupCodes);
      isValid = result.valid;
      usedBackupCodeIndex = result.index;
    } else {
      // Vérifier avec le code TOTP
      try {
        const decryptedSecret = decryptSecret(user.twoFactorSecret);
        console.log('[2FA Verify] Secret déchiffré, longueur:', decryptedSecret.length);
        isValid = verifyTOTP(decryptedSecret, code);
      } catch (decryptError) {
        console.error('[2FA Verify] Erreur déchiffrement:', decryptError);
        return NextResponse.json(
          { error: "Erreur de configuration 2FA. Veuillez désactiver et réactiver la 2FA." },
          { status: 400 }
        );
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Code invalide. Veuillez réessayer." },
        { status: 400 }
      );
    }

    // Si c'était un code de secours, le retirer de la liste
    let updatedBackupCodes = user.backupCodes;
    if (isBackupCode && usedBackupCodeIndex !== -1) {
      updatedBackupCodes = [...user.backupCodes];
      updatedBackupCodes.splice(usedBackupCodeIndex, 1);
    }

    // Activer la 2FA si c'est la première vérification
    if (!user.twoFactorVerified) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorVerified: true,
          backupCodes: updatedBackupCodes,
        },
      });

      // Log d'audit
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "TWO_FACTOR_ENABLED",
          entity: "User",
          entityId: session.user.id,
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "TWO_FACTOR_ENABLED",
          title: "2FA activée",
          message: "L'authentification à deux facteurs a été activée sur votre compte.",
        },
      });

      return NextResponse.json({
        success: true,
        message: "2FA activée avec succès",
        isFirstSetup: true,
      });
    }

    // Si c'est juste une vérification (login)
    if (isBackupCode && usedBackupCodeIndex !== -1) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { backupCodes: updatedBackupCodes },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Code vérifié",
      remainingBackupCodes: isBackupCode ? updatedBackupCodes.length : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Code invalide" },
        { status: 400 }
      );
    }

    console.error("Erreur vérification 2FA:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}

