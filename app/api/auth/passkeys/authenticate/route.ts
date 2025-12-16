import { NextRequest, NextResponse } from "next/server";
import { 
  generatePasskeyAuthenticationOptions, 
  verifyPasskeyAuthentication 
} from "@/lib/passkeys";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIP, rateLimitResponse, resetRateLimit } from "@/lib/rate-limit";

// GET - Génère les options d'authentification
export async function GET(request: NextRequest) {
  try {
    // Rate limiting par IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit('login', clientIP);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || undefined;

    const { options, challenge } = await generatePasskeyAuthenticationOptions(email);

    return NextResponse.json({ options, challenge });
  } catch (error) {
    console.error("Erreur génération options auth passkey:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des options" },
      { status: 500 }
    );
  }
}

const authenticateSchema = z.object({
  response: z.object({
    id: z.string(),
    rawId: z.string(),
    type: z.literal("public-key"),
    response: z.object({
      clientDataJSON: z.string(),
      authenticatorData: z.string(),
      signature: z.string(),
      userHandle: z.string().optional(),
    }),
    clientExtensionResults: z.record(z.string(), z.unknown()).optional(),
    authenticatorAttachment: z.string().optional(),
  }),
  challenge: z.string(),
});

// POST - Vérifie l'authentification et retourne les infos utilisateur
export async function POST(request: NextRequest) {
  try {
    // Rate limiting par IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit('login', clientIP);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const validation = authenticateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { response, challenge } = validation.data;

    const result = await verifyPasskeyAuthentication(response as any, challenge);

    if (!result.success || !result.userId) {
      return NextResponse.json(
        { error: result.error || "Authentification échouée" },
        { status: 401 }
      );
    }

    // Récupérer les infos utilisateur
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        userType: true,
        image: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Réinitialiser le rate limit après succès
    resetRateLimit('login', clientIP);

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN_PASSKEY",
        entity: "User",
        entityId: user.id,
        newData: { method: "passkey" },
        ipAddress: clientIP,
      },
    });

    // La passkey authentification bypass la 2FA (c'est déjà multi-facteur)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        userType: user.userType,
        image: user.image,
        // La passkey est déjà 2FA, donc on marque comme vérifié
        twoFactorVerified: true,
      },
    });
  } catch (error) {
    console.error("Erreur authentification passkey:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification" },
      { status: 500 }
    );
  }
}

