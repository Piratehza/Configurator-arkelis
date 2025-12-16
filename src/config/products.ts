/**
 * FICHIER MAÎTRE - Configuration centralisée des offres Cyrélis
 * 
 * Modifier les prix, features ou produits ici se répercute
 * automatiquement sur tout le site (accueil, simulateur, admin...)
 */

// Types
export type OfferTier = "SOLO" | "PRO" | "ENTERPRISE";
export type ModuleType = "CORE" | "ADDON" | "SERVICE";

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string; // Nom de l'icône Lucide
  included: boolean | "partial" | "addon";
}

export interface PricingTier {
  monthly: number;
  annual: number; // Prix mensuel si paiement annuel
  setupFee?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription?: string;
  icon: string;
  type: ModuleType;
  pricing: PricingTier;
  features: string[];
  highlight?: boolean;
  badge?: string;
  stripeProductId?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

export interface Offer {
  id: string;
  tier: OfferTier;
  name: string;
  tagline: string;
  description: string;
  pricing: PricingTier;
  features: Feature[];
  products: string[]; // IDs des produits inclus
  highlight?: boolean;
  badge?: string;
  color: string;
  stripeProductId?: string;
}

// ============================================
// PRODUITS INDIVIDUELS (Le Socle)
// ============================================

export const PRODUCTS: Record<string, Product> = {
  // === PRODUIT HÉROS : Bitwarden Enterprise ===
  bitwarden: {
    id: "bitwarden",
    slug: "bitwarden-enterprise",
    name: "Bitwarden Enterprise",
    shortName: "Bitwarden",
    description: "Gestionnaire de mots de passe professionnel pour toute l'équipe",
    longDescription: "Sécurisez les accès de votre entreprise avec le gestionnaire de mots de passe le plus fiable du marché. Partage sécurisé, SSO, politiques d'entreprise.",
    icon: "KeyRound",
    type: "CORE",
    pricing: {
      monthly: 6,
      annual: 5,
      setupFee: 0,
    },
    features: [
      "Coffre-fort illimité",
      "Partage sécurisé en équipe",
      "Authentification 2FA",
      "Rapports de sécurité",
      "Intégration SSO/SCIM",
      "Support prioritaire",
    ],
    highlight: true,
    badge: "Recommandé",
  },

  // === Protection Endpoint ===
  endpoint: {
    id: "endpoint",
    slug: "endpoint-protection",
    name: "Protection Endpoint",
    shortName: "EDR",
    description: "Antivirus nouvelle génération avec détection comportementale",
    icon: "Shield",
    type: "CORE",
    pricing: {
      monthly: 4,
      annual: 3.5,
    },
    features: [
      "Antivirus temps réel",
      "EDR (Endpoint Detection)",
      "Anti-ransomware",
      "Quarantaine automatique",
    ],
  },

  // === Filtrage DNS ===
  dns: {
    id: "dns",
    slug: "dns-filtering",
    name: "Filtrage DNS",
    shortName: "DNS",
    description: "Bloquez les menaces avant qu'elles n'atteignent vos postes",
    icon: "Globe",
    type: "CORE",
    pricing: {
      monthly: 2,
      annual: 1.5,
    },
    features: [
      "Blocage phishing",
      "Filtrage catégories web",
      "Rapports de navigation",
      "Politiques par groupe",
    ],
  },

  // === Sauvegarde Cloud ===
  backup: {
    id: "backup",
    slug: "cloud-backup",
    name: "Sauvegarde Cloud",
    shortName: "Backup",
    description: "Sauvegarde automatique et chiffrée de vos données critiques",
    icon: "CloudUpload",
    type: "ADDON",
    pricing: {
      monthly: 5,
      annual: 4,
    },
    features: [
      "Backup automatique quotidien",
      "Chiffrement AES-256",
      "Rétention 30 jours",
      "Restauration granulaire",
    ],
  },

  // === MFA / Authentification ===
  mfa: {
    id: "mfa",
    slug: "mfa-enterprise",
    name: "MFA Enterprise",
    shortName: "MFA",
    description: "Double authentification pour tous vos accès critiques",
    icon: "Fingerprint",
    type: "ADDON",
    pricing: {
      monthly: 3,
      annual: 2.5,
    },
    features: [
      "TOTP / Push notification",
      "Clés de sécurité FIDO2",
      "Intégration Azure AD",
      "Rapports de connexion",
    ],
  },

  // === Support Premium ===
  support: {
    id: "support",
    slug: "support-premium",
    name: "Support Premium",
    shortName: "Support",
    description: "Accompagnement dédié et temps de réponse garanti",
    icon: "HeadphonesIcon",
    type: "SERVICE",
    pricing: {
      monthly: 10,
      annual: 8,
    },
    features: [
      "Réponse sous 4h",
      "Interlocuteur dédié",
      "Revue trimestrielle",
      "Formation utilisateurs",
    ],
    badge: "Premium",
  },

  // === Supervision 24/7 ===
  monitoring: {
    id: "monitoring",
    slug: "monitoring-247",
    name: "Supervision 24/7",
    shortName: "SOC",
    description: "Centre de surveillance permanent de votre infrastructure",
    icon: "Eye",
    type: "SERVICE",
    pricing: {
      monthly: 15,
      annual: 12,
    },
    features: [
      "Monitoring temps réel",
      "Alertes incidents",
      "Analyse comportementale",
      "Rapport mensuel",
    ],
  },
};

// ============================================
// OFFRES PACKAGÉES (Formules)
// ============================================

export const OFFERS: Offer[] = [
  {
    id: "solo",
    tier: "SOLO",
    name: "Solo",
    tagline: "Pour les indépendants",
    description: "Protection essentielle pour travailler en sécurité",
    pricing: {
      monthly: 12,
      annual: 10,
    },
    color: "slate",
    products: ["bitwarden", "endpoint", "dns"],
    features: [
      { id: "bitwarden", name: "Bitwarden Enterprise", description: "1 utilisateur", icon: "KeyRound", included: true },
      { id: "endpoint", name: "Protection Endpoint", description: "1 poste", icon: "Shield", included: true },
      { id: "dns", name: "Filtrage DNS", description: "Inclus", icon: "Globe", included: true },
      { id: "support", name: "Support", description: "Email uniquement", icon: "HeadphonesIcon", included: "partial" },
      { id: "backup", name: "Sauvegarde", description: "En option", icon: "CloudUpload", included: "addon" },
    ],
  },
  {
    id: "pro",
    tier: "PRO",
    name: "Pro",
    tagline: "Pour les TPE/PME",
    description: "Suite complète de cybersécurité managée",
    pricing: {
      monthly: 25,
      annual: 20,
    },
    color: "blue",
    highlight: true,
    badge: "Populaire",
    products: ["bitwarden", "endpoint", "dns", "backup", "mfa"],
    features: [
      { id: "bitwarden", name: "Bitwarden Enterprise", description: "Illimité", icon: "KeyRound", included: true },
      { id: "endpoint", name: "Protection Endpoint", description: "Tous postes", icon: "Shield", included: true },
      { id: "dns", name: "Filtrage DNS", description: "Inclus", icon: "Globe", included: true },
      { id: "backup", name: "Sauvegarde Cloud", description: "100 Go inclus", icon: "CloudUpload", included: true },
      { id: "mfa", name: "MFA Enterprise", description: "Inclus", icon: "Fingerprint", included: true },
      { id: "support", name: "Support", description: "Prioritaire", icon: "HeadphonesIcon", included: true },
    ],
  },
  {
    id: "enterprise",
    tier: "ENTERPRISE",
    name: "Enterprise",
    tagline: "Pour les grandes structures",
    description: "Sécurité sur-mesure avec accompagnement dédié",
    pricing: {
      monthly: 45,
      annual: 38,
    },
    color: "amber",
    badge: "Sur mesure",
    products: ["bitwarden", "endpoint", "dns", "backup", "mfa", "support", "monitoring"],
    features: [
      { id: "bitwarden", name: "Bitwarden Enterprise", description: "SSO/SCIM inclus", icon: "KeyRound", included: true },
      { id: "endpoint", name: "Protection Endpoint", description: "EDR avancé", icon: "Shield", included: true },
      { id: "dns", name: "Filtrage DNS", description: "Politiques avancées", icon: "Globe", included: true },
      { id: "backup", name: "Sauvegarde Cloud", description: "Illimité", icon: "CloudUpload", included: true },
      { id: "mfa", name: "MFA Enterprise", description: "FIDO2 inclus", icon: "Fingerprint", included: true },
      { id: "support", name: "Support Premium", description: "Dédié 24/7", icon: "HeadphonesIcon", included: true },
      { id: "monitoring", name: "Supervision SOC", description: "Inclus", icon: "Eye", included: true },
    ],
  },
];

// ============================================
// HELPERS
// ============================================

export function getProductById(id: string): Product | undefined {
  return PRODUCTS[id];
}

export function getOfferByTier(tier: OfferTier): Offer | undefined {
  return OFFERS.find(o => o.tier === tier);
}

export function getOfferById(id: string): Offer | undefined {
  return OFFERS.find(o => o.id === id);
}

export function calculateMonthlyPrice(
  products: string[],
  userCount: number = 1,
  billing: "monthly" | "annual" = "monthly"
): number {
  let total = 0;
  
  for (const productId of products) {
    const product = PRODUCTS[productId];
    if (product) {
      const price = billing === "annual" ? product.pricing.annual : product.pricing.monthly;
      total += price * userCount;
    }
  }
  
  return total;
}

export function calculateOfferPrice(
  offerId: string,
  userCount: number = 1,
  billing: "monthly" | "annual" = "monthly"
): number {
  const offer = getOfferById(offerId);
  if (!offer) return 0;
  
  const basePrice = billing === "annual" ? offer.pricing.annual : offer.pricing.monthly;
  return basePrice * userCount;
}

// Format prix
export function formatPrice(price: number, showDecimals: boolean = true): string {
  if (showDecimals) {
    return price.toFixed(2).replace(".", ",");
  }
  return Math.round(price).toString();
}

// ============================================
// CONSTANTES GLOBALES
// ============================================

export const COMPANY_INFO = {
  name: "Cyrélis",
  legalName: "Vallet Matthieu",
  siret: "945 200 129 00035",
  siren: "945 200 129",
  ape: "6202A",
  address: "Rue de Lambersart, 59350 Saint-André-lez-Lille, France",
  email: "contact@cyrelis.fr",
  phone: null,
  tva: null, // Si applicable
};

export const PRICING_CONFIG = {
  currency: "EUR",
  currencySymbol: "€",
  vatRate: 0.20, // 20% TVA
  minUsers: 1,
  maxUsers: 500,
  defaultBilling: "monthly" as const,
  discountAnnual: 0.15, // 15% de réduction sur l'annuel
};

