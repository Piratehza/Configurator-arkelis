import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour créer/modifier une offre
const offerSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Le slug doit être en minuscules avec tirets"),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  priceType: z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "PER_USER"]),
  basePrice: z.number().min(0),
  pricePerUser: z.number().min(0).optional().nullable(),
  setupFee: z.number().min(0).optional(),
  category: z.enum(["SECURITY", "BACKUP", "SUPPORT", "TRAINING", "ADDON"]),
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

// GET - Liste des offres
export async function GET(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const active = searchParams.get("active");

  const offers = await prisma.offer.findMany({
    where: {
      ...(category && { category: category as "SECURITY" | "BACKUP" | "SUPPORT" | "TRAINING" | "ADDON" }),
      ...(active !== null && { isActive: active === "true" }),
    },
    include: {
      _count: {
        select: { subscriptionItems: true },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json({ offers });
}

// POST - Créer une offre
export async function POST(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = offerSchema.parse(body);

    // Vérifier si le slug existe déjà
    const existingOffer = await prisma.offer.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé" },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        ...validatedData,
        features: validatedData.features || [],
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "OFFER_CREATED",
        entity: "Offer",
        entityId: offer.id,
        newData: JSON.parse(JSON.stringify(offer)),
      },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

