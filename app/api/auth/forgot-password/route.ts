import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

// POST - Demande de réinitialisation de mot de passe
export async function POST(request: NextRequest) {
  try {
    // Rate limiting par IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit('forgotPassword', clientIP);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Toujours répondre avec succès pour ne pas révéler si l'email existe
    const successResponse = NextResponse.json({
      success: true,
      message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Ne pas révéler que l'utilisateur n'existe pas
      return successResponse;
    }

    // Supprimer les anciens tokens de réinitialisation pour cet utilisateur
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Sauvegarder le token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Construire le lien de réinitialisation
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Envoyer l'email via SMTP
    const emailSent = await sendPasswordResetEmail(
      email,
      resetLink,
      user.name || undefined
    );

    if (emailSent) {
      console.log("✅ Email de réinitialisation envoyé à:", email);
    } else {
      // En dev, afficher le lien dans la console
      console.log("=== LIEN DE RÉINITIALISATION ===");
      console.log(`Email: ${email}`);
      console.log(`Lien: ${resetLink}`);
      console.log("================================");
    }

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        entity: "User",
        entityId: user.id,
        newData: {
          email: user.email,
          expiresAt: expiresAt.toISOString(),
          emailSent,
        },
      },
    });

    return successResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    console.error("Erreur forgot-password:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
