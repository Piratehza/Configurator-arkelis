import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addLicensesSchema = z.object({
  subscriptionItemId: z.string(),
  quantity: z.number().min(1),
});

// POST - Ajouter des licences à mon abonnement
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = addLicensesSchema.parse(body);

    // Vérifier que l'item appartient bien au client
    const subscriptionItem = await prisma.subscriptionItem.findFirst({
      where: {
        id: validatedData.subscriptionItemId,
        subscription: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      },
      include: {
        subscription: true,
        offer: true,
      },
    });

    if (!subscriptionItem) {
      return NextResponse.json(
        { error: "Élément d'abonnement non trouvé" },
        { status: 404 }
      );
    }

    // Calculer le nouveau montant
    const newQuantity = subscriptionItem.quantity + validatedData.quantity;
    const additionalCost = subscriptionItem.unitPrice * validatedData.quantity;
    const newTotal = subscriptionItem.subscription.totalMonthly + additionalCost;

    // Mettre à jour l'item et l'abonnement
    await prisma.$transaction([
      prisma.subscriptionItem.update({
        where: { id: validatedData.subscriptionItemId },
        data: { quantity: newQuantity },
      }),
      prisma.subscription.update({
        where: { id: subscriptionItem.subscriptionId },
        data: { totalMonthly: newTotal },
      }),
    ]);

    // Créer une notification pour l'admin
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        type: "LICENSE_ADDED" as const,
        title: "Nouvelles licences ajoutées",
        message: `${session.user!.name || session.user!.email} a ajouté ${validatedData.quantity} licence(s) ${subscriptionItem.offer.name}. Nouveau total mensuel : ${newTotal.toFixed(2)}€`,
        actionUrl: `/admin/clients/${session.user!.id}`,
      })),
    });

    // Notification de confirmation au client
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "LICENSE_ADDED",
        title: "Licences ajoutées",
        message: `Vous avez ajouté ${validatedData.quantity} licence(s) ${subscriptionItem.offer.name}. Nouveau total : ${newQuantity} licences.`,
        actionUrl: "/espace-client/abonnement",
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "LICENSE_ADDED",
        entity: "SubscriptionItem",
        entityId: validatedData.subscriptionItemId,
        oldData: { quantity: subscriptionItem.quantity },
        newData: { quantity: newQuantity, addedQuantity: validatedData.quantity },
      },
    });

    return NextResponse.json({
      message: "Licences ajoutées avec succès",
      newQuantity,
      newTotal,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error adding licenses:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

