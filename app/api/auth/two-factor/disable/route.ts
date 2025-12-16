import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verifyTOTP, decryptSecret, is2FARequired } from "@/lib/two-factor";
import { z } from "zod";

const disableSchema = z.object({
  code: z.string().min(6).max(6),
});

// POST - Désactive la 2FA (nécessite un code valide)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code } = disableSchema.parse(body);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
        userType: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier si la 2FA peut être désactivée (obligatoire pour INTERNAL)
    if (is2FARequired(user.userType)) {
      return NextResponse.json(
        { error: "La 2FA est obligatoire pour les comptes internes Cyrélis." },
        { status: 403 }
      );
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "La 2FA n'est pas activée sur ce compte." },
        { status: 400 }
      );
    }

    // Vérifier le code TOTP
    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValid = verifyTOTP(decryptedSecret, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Code invalide" },
        { status: 400 }
      );
    }

    // Désactiver la 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorVerified: false,
        twoFactorSecret: null,
        backupCodes: [],
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TWO_FACTOR_DISABLED",
        entity: "User",
        entityId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "2FA désactivée",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    console.error("Erreur désactivation 2FA:", error);
    return NextResponse.json(
      { error: "Erreur lors de la désactivation" },
      { status: 500 }
    );
  }
}

