import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Réinitialise la 2FA d'un utilisateur (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Vérifier que c'est un admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id: userId } = await params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Réinitialiser la 2FA
    await prisma.user.update({
      where: { id: userId },
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
        action: "ADMIN_RESET_2FA",
        entity: "User",
        entityId: userId,
        newData: {
          targetUserEmail: user.email,
          targetUserName: user.name,
          resetBy: session.user.email,
        },
      },
    });

    // Notification à l'utilisateur
    await prisma.notification.create({
      data: {
        userId: userId,
        type: "SYSTEM_ALERT",
        title: "2FA réinitialisée",
        message: "L'authentification à deux facteurs de votre compte a été réinitialisée par un administrateur. Vous pouvez la reconfigurer depuis votre espace client.",
      },
    });

    return NextResponse.json({
      success: true,
      message: `2FA réinitialisée pour ${user.email}`,
    });
  } catch (error) {
    console.error("Erreur reset 2FA:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation" },
      { status: 500 }
    );
  }
}

