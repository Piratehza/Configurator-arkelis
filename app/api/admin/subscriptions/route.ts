import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma pour créer un abonnement
const createSubscriptionSchema = z.object({
  userId: z.string(),
  items: z.array(z.object({
    offerId: z.string(),
    quantity: z.number().min(1).default(1),
  })),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY"),
  startDate: z.string().optional(), // ISO date
  internalNotes: z.string().optional(),
});

// Middleware pour vérifier si admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET - Liste des abonnements
export async function GET(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    ...(status && { status: status as "PENDING" | "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED" }),
    ...(userId && { userId }),
  };

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        items: {
          include: { offer: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.subscription.count({ where }),
  ]);

  return NextResponse.json({
    subscriptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST - Créer un abonnement
export async function POST(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createSubscriptionSchema.parse(body);

    // Vérifier que le client existe
    const client = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    // Récupérer les offres et calculer le total
    const offerIds = validatedData.items.map(item => item.offerId);
    const offers = await prisma.offer.findMany({
      where: { id: { in: offerIds } },
    });

    if (offers.length !== offerIds.length) {
      return NextResponse.json({ error: "Certaines offres n'existent pas" }, { status: 400 });
    }

    // Calculer le total mensuel
    let totalMonthly = 0;
    const itemsWithPrice = validatedData.items.map(item => {
      const offer = offers.find(o => o.id === item.offerId)!;
      const unitPrice = offer.pricePerUser || offer.basePrice;
      totalMonthly += unitPrice * item.quantity;
      return {
        offerId: item.offerId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    // Créer l'abonnement
    const subscription = await prisma.subscription.create({
      data: {
        userId: validatedData.userId,
        status: "ACTIVE",
        billingCycle: validatedData.billingCycle,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        totalMonthly,
        internalNotes: validatedData.internalNotes,
        items: {
          create: itemsWithPrice,
        },
      },
      include: {
        user: true,
        items: {
          include: { offer: true },
        },
      },
    });

    // Notification au client
    await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        type: "SUBSCRIPTION_CREATED",
        title: "Nouvel abonnement activé",
        message: `Votre abonnement Cyrélis a été activé. Montant mensuel : ${totalMonthly.toFixed(2)}€`,
        actionUrl: "/espace-client/abonnement",
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "SUBSCRIPTION_CREATED",
        entity: "Subscription",
        entityId: subscription.id,
        newData: JSON.parse(JSON.stringify(subscription)),
      },
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

