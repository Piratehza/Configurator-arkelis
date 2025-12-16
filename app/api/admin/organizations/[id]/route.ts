import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour la mise à jour
const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  siret: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  contactPhone: z.string().optional().nullable(),
  activeOffer: z.string().optional(),
  offerStatus: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "CANCELLED"]).optional(),
});

// GET - Récupérer une organisation avec ses utilisateurs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            userType: true,
            createdAt: true,
            twoFactorEnabled: true,
            subscriptions: {
              select: {
                status: true,
                totalMonthly: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'organisation" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une organisation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const validatedData = updateOrganizationSchema.parse(body);

    // Récupérer l'organisation actuelle pour l'audit
    const currentOrg = await prisma.organization.findUnique({
      where: { id },
    });

    if (!currentOrg) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    // Nettoyer les chaînes vides en null
    const cleanedData = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    const organization = await prisma.organization.update({
      where: { id },
      data: cleanedData,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ORGANIZATION_UPDATED",
        entity: "Organization",
        entityId: organization.id,
        oldData: {
          name: currentOrg.name,
          siret: currentOrg.siret,
          offerStatus: currentOrg.offerStatus,
        },
        newData: {
          name: organization.name,
          siret: organization.siret,
          offerStatus: organization.offerStatus,
        },
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'organisation" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une organisation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Vérifier si l'organisation existe et a des utilisateurs
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    if (organization._count.users > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une organisation avec des utilisateurs. Supprimez d'abord les utilisateurs." },
        { status: 400 }
      );
    }

    await prisma.organization.delete({
      where: { id },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ORGANIZATION_DELETED",
        entity: "Organization",
        entityId: id,
        oldData: {
          name: organization.name,
          siret: organization.siret,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'organisation" },
      { status: 500 }
    );
  }
}

