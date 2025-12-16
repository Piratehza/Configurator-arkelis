import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation
const updateUserSchema = z.object({
  role: z.enum(["ADMIN", "CLIENT", "PROSPECT"]).optional(),
  name: z.string().min(2).optional(),
});

// Middleware pour vérifier si admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET - Détail d'un utilisateur
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: true,
      invoices: true,
      tickets: true,
      _count: {
        select: {
          subscriptions: true,
          invoices: true,
          tickets: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH - Modifier un utilisateur (rôle, nom, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Empêcher de se retirer ses propres droits admin
    if (id === admin.id && validatedData.role && validatedData.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous ne pouvez pas retirer vos propres droits administrateur" },
        { status: 403 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "USER_ROLE_CHANGED",
        entity: "User",
        entityId: user.id,
        oldData: { role: existingUser.role },
        newData: { role: user.role },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Empêcher de se supprimer soi-même
    if (id === admin.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 403 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "USER_DELETED",
        entity: "User",
        entityId: id,
        oldData: JSON.parse(JSON.stringify(user)),
      },
    });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression" },
      { status: 500 }
    );
  }
}

