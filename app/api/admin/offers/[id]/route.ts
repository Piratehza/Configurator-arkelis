import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour modifier une offre
const updateOfferSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  priceType: z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "PER_USER"]).optional(),
  basePrice: z.number().min(0).optional(),
  pricePerUser: z.number().min(0).optional().nullable(),
  setupFee: z.number().min(0).optional(),
  category: z.enum(["SECURITY", "BACKUP", "SUPPORT", "TRAINING", "ADDON"]).optional(),
  // Nouveaux champs pour le modèle BUILD/RUN
  offerType: z.enum(["SUBSCRIPTION", "ADDON", "ONE_SHOT"]).optional(),
  restrictedToSlug: z.string().optional().nullable(),
  quota: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  sortOrder: z.number().optional(),
  features: z.array(z.string()).optional(),
});

// Middleware pour vérifier si admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET - Détail d'une offre
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      _count: {
        select: { subscriptionItems: true },
      },
    },
  });

  if (!offer) {
    return NextResponse.json({ error: "Offre non trouvée" }, { status: 404 });
  }

  return NextResponse.json({ offer });
}

// PATCH - Modifier une offre
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
    const validatedData = updateOfferSchema.parse(body);

    // Récupérer l'offre existante
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json({ error: "Offre non trouvée" }, { status: 404 });
    }

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (validatedData.slug && validatedData.slug !== existingOffer.slug) {
      const slugExists = await prisma.offer.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: validatedData,
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "OFFER_UPDATED",
        entity: "Offer",
        entityId: offer.id,
        oldData: JSON.parse(JSON.stringify(existingOffer)),
        newData: JSON.parse(JSON.stringify(offer)),
      },
    });

    return NextResponse.json({ offer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une offre
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
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptionItems: true },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offre non trouvée" }, { status: 404 });
    }

    // Empêcher la suppression si des abonnements utilisent cette offre
    if (offer._count.subscriptionItems > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une offre avec des abonnements actifs" },
        { status: 400 }
      );
    }

    await prisma.offer.delete({
      where: { id },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "OFFER_DELETED",
        entity: "Offer",
        entityId: id,
        oldData: JSON.parse(JSON.stringify(offer)),
      },
    });

    return NextResponse.json({ message: "Offre supprimée" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

