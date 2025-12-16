/**
 * Configuration centrale du modèle économique Cyrélis
 * Modèle "LEGO" : BUILD (One-Shot) + RUN (Mensuel)
 * 
 * @description Ce fichier centralise toute l'intelligence tarifaire.
 * Pour modifier les prix, changez uniquement les valeurs ici.
 */

export const PRICING_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PARTIE 1 : BUILD (Investissement Initial One-Shot)
  // ═══════════════════════════════════════════════════════════════════════════
  BUILD: {
    BASE_FEE: 490,        // Frais fixes socle technique (Pack Démarrage)
    PER_USER_FEE: 15,     // Frais par utilisateur (Onboarding, configuration)
    LABEL: 'Pack Démarrage',
    DESCRIPTION: 'Fondation technique obligatoire : déploiement du socle sécurisé, configuration Bitwarden Enterprise, onboarding initial.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTIE 2 : RUN (Abonnement Mensuel Récurrent)
  // ═══════════════════════════════════════════════════════════════════════════
  RUN: {
    OFFERS: {
      AUTONOMY: {
        id: 'autonomy',
        label: 'Offre Autonomie',
        price_monthly: 6,
        description: 'Vous gérez, nous maintenons.',
        features: [
          'Licence Bitwarden Enterprise',
          'Support par ticket (J+2)',
          'Mises à jour de sécurité',
          'Documentation complète',
        ],
        excluded_extras: [], // Tous les extras disponibles
      },
      PARTNER: {
        id: 'partner',
        label: 'Offre Partenaire',
        price_monthly: 12,
        description: 'Nous gérons, vous êtes sereins.',
        features: [
          'Licence Bitwarden Enterprise',
          'Support prioritaire (J+1)',
          'Gestion complète par Cyrélis',
          'Rapports mensuels de sécurité',
          'Accès SSO & LDAP inclus',
          'Formations utilisateurs',
        ],
        excluded_extras: [], // Tous les extras disponibles
      },
    },
    ADDONS: {
      IA_MODULE: {
        id: 'ia_security',
        label: 'Module IA Sécurité',
        price_monthly: 3,
        quota: '30 requêtes/user/mois',
        description: 'Analyse IA des risques et recommandations personnalisées.',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTIE 3 : OPTIONS ONE-SHOT (Matériel & Services Complémentaires)
  // ═══════════════════════════════════════════════════════════════════════════
  ONE_SHOT_EXTRAS: [
    {
      id: 'mfa_hardened',
      label: 'MFA Durci Spécifique',
      price: 300,
      description: 'Configuration MFA renforcée avec politiques personnalisées.',
      category: 'security',
      restricted_to: null,
    },
    {
      id: 'audit_deep',
      label: 'Audit Sécurité Approfondi',
      price: 800,
      description: 'Analyse complète de votre posture de sécurité.',
      category: 'service',
      restricted_to: null,
    },
    {
      id: 'sso_config',
      label: 'Configuration SSO',
      price: 750,
      description: 'Intégration Single Sign-On (SAML/OIDC).',
      category: 'integration',
      restricted_to: 'partner', // Réservé à l'offre Partenaire
    },
    {
      id: 'ldap_sync',
      label: 'Intégration LDAP/AD',
      price: 500,
      description: 'Synchronisation avec Active Directory / LDAP.',
      category: 'integration',
      restricted_to: 'partner', // Réservé à l'offre Partenaire
    },
    {
      id: 'migration',
      label: 'Migration de Données',
      price: 400,
      description: 'Migration sécurisée depuis votre gestionnaire actuel.',
      category: 'service',
      restricted_to: null,
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // MÉTA-INFORMATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  META: {
    CURRENCY: 'EUR',
    CURRENCY_SYMBOL: '€',
    VAT_RATE: 0.20, // TVA 20%
    MIN_USERS: 1,
    MAX_USERS: 500,
    BILLING_CYCLE: 'monthly',
  },
} as const;

// Types dérivés pour TypeScript
export type OfferType = keyof typeof PRICING_CONFIG.RUN.OFFERS;
export type AddonId = keyof typeof PRICING_CONFIG.RUN.ADDONS;
export type ExtraId = typeof PRICING_CONFIG.ONE_SHOT_EXTRAS[number]['id'];

// Interface pour les résultats du calculateur
export interface PricingCalculation {
  // BUILD (One-Shot)
  buildTotal: number;
  buildDetails: {
    baseFee: number;
    userFees: number;
    extras: number;
  };
  
  // RUN (Mensuel)
  runMonthly: number;
  runDetails: {
    offerCost: number;
    addonsCost: number;
  };
  
  // Annuel
  runAnnual: number;
  
  // TTC
  buildTotalTTC: number;
  runMonthlyTTC: number;
}

// Helper pour obtenir le label d'un extra
export function getExtraLabel(extraId: string): string {
  const extra = PRICING_CONFIG.ONE_SHOT_EXTRAS.find(e => e.id === extraId);
  return extra?.label || extraId;
}

// Helper pour vérifier si un extra est restreint
export function isExtraRestricted(extraId: string, offerType: OfferType): boolean {
  const extra = PRICING_CONFIG.ONE_SHOT_EXTRAS.find(e => e.id === extraId);
  if (!extra || !extra.restricted_to) return false;
  return extra.restricted_to !== offerType.toLowerCase();
}

