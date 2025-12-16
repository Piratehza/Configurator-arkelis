import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour modifier un client
const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  siret: z.string().optional(),
  address: z.string().optional(),
});

// Middleware pour vérifier si admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET - Détail d'un client
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: {
          items: {
            include: { offer: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { issueDate: "desc" },
        take: 10,
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      tickets: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      passkeys: {
        select: {
          id: true,
          deviceName: true,
          deviceType: true,
          lastUsedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
  }

  // Calculs agrégés
  const stats = {
    totalSpent: await prisma.invoice.aggregate({
      where: { userId: id, status: "PAID" },
      _sum: { total: true },
    }),
    activeSubscriptions: await prisma.subscription.count({
      where: { userId: id, status: "ACTIVE" },
    }),
    openTickets: await prisma.supportTicket.count({
      where: { userId: id, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
  };

  return NextResponse.json({ client, stats });
}

// DELETE - Supprimer un client
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
    const client = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    // Empêcher la suppression d'un admin
    if (client.role === "ADMIN") {
      return NextResponse.json(
        { error: "Impossible de supprimer un administrateur" },
        { status: 403 }
      );
    }

    // Supprimer le client (cascade supprimera les relations)
    await prisma.user.delete({
      where: { id },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "CLIENT_DELETED",
        entity: "User",
        entityId: id,
        oldData: JSON.parse(JSON.stringify(client)),
      },
    });

    return NextResponse.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression" },
      { status: 500 }
    );
  }
}

// PATCH - Modifier un client
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
    const validatedData = updateClientSchema.parse(body);

    const existingClient = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    // Vérifier unicité email si modifié
    if (validatedData.email && validatedData.email !== existingClient.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const client = await prisma.user.update({
      where: { id },
      data: validatedData,
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "CLIENT_UPDATED",
        entity: "User",
        entityId: client.id,
        oldData: JSON.parse(JSON.stringify(existingClient)),
        newData: JSON.parse(JSON.stringify(client)),
      },
    });

    return NextResponse.json({ client });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

