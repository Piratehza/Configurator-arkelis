import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  generatePasskeyRegistrationOptions, 
  verifyPasskeyRegistration 
} from "@/lib/passkeys";
import { z } from "zod";

// GET - Génère les options d'enregistrement
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { options, challenge } = await generatePasskeyRegistrationOptions(
      session.user.id,
      session.user.email,
      session.user.name || undefined
    );

    return NextResponse.json({ options, challenge });
  } catch (error) {
    console.error("Erreur génération options passkey:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des options" },
      { status: 500 }
    );
  }
}

const registerSchema = z.object({
  response: z.object({
    id: z.string(),
    rawId: z.string(),
    type: z.literal("public-key"),
    response: z.object({
      clientDataJSON: z.string(),
      attestationObject: z.string(),
      transports: z.array(z.string()).optional(),
    }),
    clientExtensionResults: z.record(z.string(), z.unknown()).optional(),
    authenticatorAttachment: z.string().optional(),
  }),
  challenge: z.string(),
  deviceName: z.string().optional(),
});

// POST - Vérifie et enregistre la passkey
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { response, challenge, deviceName } = validation.data;

    const result = await verifyPasskeyRegistration(
      session.user.id,
      response as any,
      challenge,
      deviceName
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Enregistrement échoué" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      passkeyId: result.passkeyId,
      message: "Passkey enregistrée avec succès",
    });
  } catch (error) {
    console.error("Erreur enregistrement passkey:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}

