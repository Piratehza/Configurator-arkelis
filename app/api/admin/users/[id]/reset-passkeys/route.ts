import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Reset toutes les passkeys d'un utilisateur
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = await auth();
  if (!adminSession?.user || adminSession.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        email: true, 
        name: true,
        passkeys: { select: { id: true, deviceName: true } } 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (user.passkeys.length === 0) {
      return NextResponse.json(
        { error: "Cet utilisateur n'a pas de passkey enregistrée" },
        { status: 400 }
      );
    }

    // Supprimer toutes les passkeys de l'utilisateur
    const deletedCount = await prisma.passkey.deleteMany({
      where: { userId: id },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: adminSession.user.id,
        action: "PASSKEYS_RESET_BY_ADMIN",
        entity: "Passkey",
        entityId: user.id,
        oldData: { 
          passkeysDeleted: user.passkeys.map(p => ({ id: p.id, deviceName: p.deviceName })) 
        },
        newData: { 
          deletedCount: deletedCount.count, 
          targetUser: user.email 
        },
      },
    });

    // Notification au client
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM_ALERT",
        title: "Passkeys réinitialisées",
        message: `Vos passkeys ont été réinitialisées par un administrateur. Vous devrez utiliser votre mot de passe pour vous connecter et reconfigurer vos passkeys.`,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: `${deletedCount.count} passkey(s) supprimée(s) pour ${user.email}` 
    });
  } catch (error) {
    console.error("Erreur reset passkeys:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation des passkeys" },
      { status: 500 }
    );
  }
}

