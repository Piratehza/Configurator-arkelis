/**
 * Hook de calcul des prix en temps réel
 * Basé sur le modèle économique LEGO (BUILD + RUN)
 */

import { useMemo } from 'react';
import { 
  PRICING_CONFIG, 
  type OfferType, 
  type PricingCalculation,
  isExtraRestricted 
} from '@/config/pricing';

interface UsePricingCalculatorProps {
  users: number;
  offerType: OfferType;
  hasIA: boolean;
  selectedExtras: string[];
}

interface UsePricingCalculatorReturn extends PricingCalculation {
  // Helpers additionnels
  formattedBuildTotal: string;
  formattedRunMonthly: string;
  formattedRunAnnual: string;
  isExtraAvailable: (extraId: string) => boolean;
  getExtraInfo: (extraId: string) => {
    label: string;
    price: number;
    description: string;
    isRestricted: boolean;
    restrictedMessage?: string;
  } | null;
}

export function usePricingCalculator({
  users,
  offerType,
  hasIA,
  selectedExtras,
}: UsePricingCalculatorProps): UsePricingCalculatorReturn {
  
  const calculation = useMemo(() => {
    const config = PRICING_CONFIG;
    const offer = config.RUN.OFFERS[offerType];
    const validUsers = Math.max(config.META.MIN_USERS, Math.min(users, config.META.MAX_USERS));
    
    // ═══════════════════════════════════════════════════════════════════════
    // CALCUL BUILD (One-Shot)
    // ═══════════════════════════════════════════════════════════════════════
    const baseFee = config.BUILD.BASE_FEE;
    const userFees = config.BUILD.PER_USER_FEE * validUsers;
    
    // Calcul des extras (en filtrant ceux qui sont restreints)
    const validExtras = selectedExtras.filter(
      extraId => !isExtraRestricted(extraId, offerType)
    );
    
    const extrasTotal = validExtras.reduce((sum, extraId) => {
      const extra = config.ONE_SHOT_EXTRAS.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    const buildTotal = baseFee + userFees + extrasTotal;
    
    // ═══════════════════════════════════════════════════════════════════════
    // CALCUL RUN (Mensuel)
    // ═══════════════════════════════════════════════════════════════════════
    const offerCost = offer.price_monthly * validUsers;
    
    const addonsCost = hasIA 
      ? config.RUN.ADDONS.IA_MODULE.price_monthly * validUsers 
      : 0;
    
    const runMonthly = offerCost + addonsCost;
    const runAnnual = runMonthly * 12;
    
    // ═══════════════════════════════════════════════════════════════════════
    // CALCUL TTC
    // ═══════════════════════════════════════════════════════════════════════
    const vatRate = config.META.VAT_RATE;
    const buildTotalTTC = buildTotal * (1 + vatRate);
    const runMonthlyTTC = runMonthly * (1 + vatRate);
    
    return {
      buildTotal,
      buildDetails: {
        baseFee,
        userFees,
        extras: extrasTotal,
      },
      runMonthly,
      runDetails: {
        offerCost,
        addonsCost,
      },
      runAnnual,
      buildTotalTTC,
      runMonthlyTTC,
    };
  }, [users, offerType, hasIA, selectedExtras]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const isExtraAvailable = (extraId: string): boolean => {
    return !isExtraRestricted(extraId, offerType);
  };
  
  const getExtraInfo = (extraId: string) => {
    const extra = PRICING_CONFIG.ONE_SHOT_EXTRAS.find(e => e.id === extraId);
    if (!extra) return null;
    
    const isRestricted = isExtraRestricted(extraId, offerType);
    
    return {
      label: extra.label,
      price: extra.price,
      description: extra.description,
      isRestricted,
      restrictedMessage: isRestricted 
        ? `Cette option est réservée à l'offre ${extra.restricted_to === 'partner' ? 'Partenaire' : 'Autonomie'}.`
        : undefined,
    };
  };
  
  return {
    ...calculation,
    formattedBuildTotal: formatPrice(calculation.buildTotal),
    formattedRunMonthly: formatPrice(calculation.runMonthly),
    formattedRunAnnual: formatPrice(calculation.runAnnual),
    isExtraAvailable,
    getExtraInfo,
  };
}

// Export par défaut pour faciliter l'import
export default usePricingCalculator;

