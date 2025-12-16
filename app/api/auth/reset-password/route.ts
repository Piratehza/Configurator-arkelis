import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, getClientIP, rateLimitResponse, resetRateLimit } from "@/lib/rate-limit";

// Regex pour mot de passe fort
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(PASSWORD_REGEX, "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"),
});

// POST - Réinitialise le mot de passe avec un token valide
export async function POST(request: NextRequest) {
  try {
    // Rate limiting par IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit('resetPassword', clientIP);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Chercher le token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Vérifier que le token existe et n'a pas expiré
    if (!resetToken) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré" },
        { status: 400 }
      );
    }

    if (resetToken.expiresAt < new Date()) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: "Ce lien a expiré. Veuillez faire une nouvelle demande." },
        { status: 400 }
      );
    }

    if (resetToken.usedAt) {
      return NextResponse.json(
        { error: "Ce lien a déjà été utilisé." },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe et marquer le token comme utilisé
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: resetToken.userId,
        action: "PASSWORD_RESET_COMPLETED",
        entity: "User",
        entityId: resetToken.userId,
      },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: resetToken.userId,
        type: "PASSWORD_RESET",
        title: "Mot de passe modifié",
        message: "Votre mot de passe a été réinitialisé avec succès.",
      },
    });

    // Supprimer tous les tokens de cet utilisateur
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    // Réinitialiser le rate limit après succès
    resetRateLimit('resetPassword', clientIP);

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Erreur reset-password:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// GET - Vérifie si un token est valide
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { valid: false, error: "Token manquant" },
      { status: 400 }
    );
  }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: "Token invalide" });
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Token expiré" });
    }

    if (resetToken.usedAt) {
      return NextResponse.json({ valid: false, error: "Token déjà utilisé" });
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.user.email,
      name: resetToken.user.name,
    });
  } catch (error) {
    console.error("Erreur vérification token:", error);
    return NextResponse.json(
      { valid: false, error: "Erreur de vérification" },
      { status: 500 }
    );
  }
}

