import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  generateTOTPSecret,
  generateTOTPUri,
  generateQRCode,
  encryptSecret,
  generateBackupCodes,
  hashBackupCode,
} from "@/lib/two-factor";

// GET - Génère un nouveau secret TOTP et QR code
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        email: true, 
        twoFactorEnabled: true,
        twoFactorVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Si 2FA déjà activée et vérifiée, ne pas régénérer
    if (user.twoFactorEnabled && user.twoFactorVerified) {
      return NextResponse.json(
        { error: "La 2FA est déjà activée. Désactivez-la d'abord pour la reconfigurer." },
        { status: 400 }
      );
    }

    // Générer un nouveau secret
    const secret = generateTOTPSecret();
    const uri = generateTOTPUri(secret, user.email);
    const qrCode = await generateQRCode(uri);

    // Générer des codes de secours
    const backupCodes = generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map(hashBackupCode);

    // Stocker le secret chiffré et les codes (en attente de vérification)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: encryptSecret(secret),
        twoFactorVerified: false,
        backupCodes: hashedBackupCodes,
      },
    });

    return NextResponse.json({
      qrCode,
      secret, // Afficher aussi le secret pour saisie manuelle
      backupCodes, // Codes de secours à afficher une seule fois
    });
  } catch (error) {
    console.error("Erreur setup 2FA:", error);
    return NextResponse.json(
      { error: "Erreur lors de la configuration 2FA" },
      { status: 500 }
    );
  }
}

