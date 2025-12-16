import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const pricingConfigSchema = z.object({
  buildBaseFee: z.number().min(0),
  buildPerUserFee: z.number().min(0),
  vatRate: z.number().min(0).max(100),
  minUsers: z.number().min(1),
  maxUsers: z.number().min(1),
});

// GET - Récupérer la configuration
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Chercher la config existante
    const config = await prisma.systemConfig.findFirst({
      where: { key: "pricing_config" },
    });

    if (config) {
      return NextResponse.json({ config: JSON.parse(config.value) });
    }

    // Valeurs par défaut
    return NextResponse.json({
      config: {
        buildBaseFee: 490,
        buildPerUserFee: 15,
        vatRate: 20,
        minUsers: 1,
        maxUsers: 500,
      },
    });
  } catch (error) {
    console.error("Error fetching pricing config:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la configuration" },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validation = pricingConfigSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const configValue = JSON.stringify(validation.data);

    // Upsert la config
    const existing = await prisma.systemConfig.findFirst({
      where: { key: "pricing_config" },
    });

    if (existing) {
      await prisma.systemConfig.update({
        where: { id: existing.id },
        data: { value: configValue },
      });
    } else {
      await prisma.systemConfig.create({
        data: {
          key: "pricing_config",
          value: configValue,
        },
      });
    }

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PRICING_CONFIG_UPDATED",
        entity: "SystemConfig",
        entityId: "pricing_config",
        newData: validation.data,
      },
    });

    return NextResponse.json({ success: true, config: validation.data });
  } catch (error) {
    console.error("Error saving pricing config:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}

