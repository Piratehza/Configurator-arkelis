import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API publique pour récupérer les données de tarification du simulateur
 * GET /api/public/pricing
 * 
 * Retourne :
 * - subscriptions : Offres d'abonnement (Autonomie, Partenaire)
 * - addons : Modules complémentaires récurrents (Module IA)
 * - oneShots : Services ponctuels (MFA Durci, Audit, etc.)
 * - config : Configuration globale (BUILD fees, TVA, etc.)
 */
export async function GET() {
  try {
    // Récupérer toutes les offres actives
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDesc: true,
        priceType: true,
        basePrice: true,
        pricePerUser: true,
        setupFee: true,
        offerType: true,
        restrictedToSlug: true,
        quota: true,
        category: true,
        isPopular: true,
        features: true,
      },
    });

    // Séparer les offres par type
    const subscriptions = offers.filter(o => o.offerType === "SUBSCRIPTION");
    const addons = offers.filter(o => o.offerType === "ADDON");
    const oneShots = offers.filter(o => o.offerType === "ONE_SHOT");

    // Récupérer la configuration globale depuis SystemConfig
    let config = {
      buildBaseFee: 490,
      buildPerUserFee: 15,
      vatRate: 20,
      minUsers: 1,
      maxUsers: 500,
    };

    try {
      const systemConfig = await prisma.systemConfig.findUnique({
        where: { key: "pricing_config" },
      });
      if (systemConfig?.value) {
        const parsedConfig = JSON.parse(systemConfig.value);
        config = { ...config, ...parsedConfig };
      }
    } catch {
      // Utiliser les valeurs par défaut si pas de config
    }

    return NextResponse.json({
      subscriptions,
      addons,
      oneShots,
      config,
    });
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tarifs" },
      { status: 500 }
    );
  }
}

