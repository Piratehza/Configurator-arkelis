import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * Vérifie si un token de confiance 2FA est valide
 * Appelé après la connexion pour bypasser la 2FA si l'appareil est reconnu
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ trusted: false });
    }

    // Récupérer le token depuis le body ou le cookie
    const body = await request.json().catch(() => ({}));
    const trustToken = body.trustToken;

    if (!trustToken) {
      return NextResponse.json({ trusted: false });
    }

    // Hasher le token pour comparaison
    const hashedToken = crypto.createHash('sha256').update(trustToken).digest('hex');

    // Chercher le token en base
    const configKey = `2fa_trust_${session.user.id}_${hashedToken.substring(0, 16)}`;
    const storedConfig = await prisma.systemConfig.findUnique({
      where: { key: configKey },
    });

    if (!storedConfig) {
      return NextResponse.json({ trusted: false });
    }

    try {
      const tokenData = JSON.parse(storedConfig.value);

      // Vérifier que le hash correspond
      if (tokenData.hashedToken !== hashedToken) {
        return NextResponse.json({ trusted: false });
      }

      // Vérifier l'expiration
      const expiresAt = new Date(tokenData.expiresAt);
      if (expiresAt < new Date()) {
        // Token expiré, le supprimer
        await prisma.systemConfig.delete({ where: { key: configKey } });
        return NextResponse.json({ trusted: false, reason: "expired" });
      }

      // Token valide !
      console.log('[2FA] Token de confiance valide pour', session.user.id);

      return NextResponse.json({ 
        trusted: true,
        expiresAt: tokenData.expiresAt,
      });
    } catch {
      return NextResponse.json({ trusted: false });
    }
  } catch (error) {
    console.error("Erreur vérification trust token:", error);
    return NextResponse.json({ trusted: false });
  }
}

/**
 * Supprime tous les tokens de confiance d'un utilisateur
 * Utile quand l'utilisateur veut révoquer tous les appareils de confiance
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Supprimer tous les tokens de confiance de cet utilisateur
    const deleted = await prisma.systemConfig.deleteMany({
      where: {
        key: {
          startsWith: `2fa_trust_${session.user.id}_`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${deleted.count} appareil(s) de confiance révoqué(s)`,
    });
  } catch (error) {
    console.error("Erreur suppression trust tokens:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

