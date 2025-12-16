"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  KeyRound,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Cpu,
  Settings,
  FileSearch,
  Zap,
  Building2,
  Loader2,
  Sparkles,
  TrendingUp,
  HelpCircle,
  RefreshCcw,
  Wrench,
  Headphones,
  BookOpen,
  Target,
  GraduationCap,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HeroBackground,
  GridBackground,
  FloatingShapes,
} from "@/components/backgrounds/AnimatedBackground";

// ============================================================
// TYPES
// ============================================================
interface Offer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  priceType: string;
  basePrice: number;
  pricePerUser: number | null;
  setupFee: number;
  offerType: string;
  restrictedToSlug: string | null;
  quota: string | null;
  category: string;
  isPopular: boolean;
  features: string[];
}

interface PricingConfig {
  buildBaseFee: number;
  buildPerUserFee: number;
  vatRate: number;
  minUsers: number;
  maxUsers: number;
}

interface PricingData {
  subscriptions: Offer[];
  addons: Offer[];
  oneShots: Offer[];
  config: PricingConfig;
}

interface ConfigState {
  users: number;
  selectedOffer: string | null;
  iaEnabled: boolean;
  selectedExtras: string[];
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const slideIn = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatPriceDecimal = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// ============================================================
// PROGRESS TIMELINE COMPONENT
// ============================================================
const ProgressTimeline = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, label: "Offre", icon: Shield },
    { num: 2, label: "Configuration", icon: Settings },
    { num: 3, label: "Récapitulatif", icon: FileSearch },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <motion.div 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              currentStep >= step.num
                ? "bg-cyrelis-blue text-white"
                : "bg-slate-100 text-slate-400"
            }`}
            animate={currentStep === step.num ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <step.icon className="w-4 h-4" />
            <span className="font-semibold text-sm hidden md:inline">{step.label}</span>
            <span className="font-bold md:hidden">{step.num}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 mx-2 ${
              currentStep > step.num ? "bg-cyrelis-mint" : "bg-slate-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// TABLEAU COMPARATIF
// ============================================================
const ComparisonTable = ({
  pricingData,
}: {
  pricingData: PricingData;
}) => {
  const autonomyOffer = pricingData.subscriptions.find(o => 
    o.slug === "autonomy" || o.slug === "autonomie"
  );
  const partnerOffer = pricingData.subscriptions.find(o => 
    o.slug === "partner" || o.slug === "partenaire"
  );
  const iaModule = pricingData.addons.find(a => a.slug?.includes("ia") || a.name?.toLowerCase().includes("ia"));
  const config = pricingData.config;

  const autonomyPriceHT = autonomyOffer?.pricePerUser || 5;
  const autonomyPriceTTC = Math.round(autonomyPriceHT * 1.2 * 100) / 100;
  const partnerPriceHT = partnerOffer?.pricePerUser || 10;
  const partnerPriceTTC = Math.round(partnerPriceHT * 1.2 * 100) / 100;
  const iaPriceHT = iaModule?.pricePerUser || 3;
  const iaPriceTTC = Math.round(iaPriceHT * 1.2 * 100) / 100;

  const CheckIcon = () => <span className="text-cyrelis-mint text-xl font-bold">✓</span>;
  const CrossIcon = () => <span className="text-slate-300 text-xl">—</span>;
  const AddOnIcon = () => <span className="text-cyrelis-blue text-xs font-semibold px-2 py-1 bg-cyrelis-blue/10 rounded-full">+ Option</span>;
  const YouManage = () => <span className="text-amber-700 text-xs font-medium px-2 py-1 bg-amber-100 rounded-full">Vous gérez</span>;
  const WeManage = () => <span className="text-cyrelis-blue text-xs font-semibold px-2 py-1 bg-cyrelis-blue/10 rounded-full">Cyrélis gère</span>;

  const TableRow = ({ 
    label, 
    autonomieValue, 
    partenaireValue, 
    highlight = false 
  }: { 
    label: string; 
    autonomieValue: React.ReactNode; 
    partenaireValue: React.ReactNode; 
    highlight?: boolean;
  }) => (
    <tr className={highlight ? "bg-cyrelis-mint/5" : "bg-white hover:bg-slate-50"}>
      <td className="px-6 py-4 text-sm font-medium text-slate-900 border-b border-slate-100">{label}</td>
      <td className="px-6 py-4 text-sm text-center border-b border-slate-100">{autonomieValue}</td>
      <td className="px-6 py-4 text-sm text-center border-b border-slate-100 bg-cyrelis-blue/5">{partenaireValue}</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cyrelis-blue/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyrelis-blue via-cyrelis-blue to-slate-900 p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            📊 Comparatif Détaillé
          </h2>
          <p className="text-slate-300">
            Trouvez l'offre qui correspond à vos besoins
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200 w-1/2">
                Caractéristiques
              </th>
              <th className="px-6 py-5 text-center text-sm font-bold border-b-2 border-slate-200 w-1/4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyrelis-mint to-teal-500 rounded-xl flex items-center justify-center text-white text-lg mb-2">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-cyrelis-blue text-lg">Autonomie</span>
                  <span className="text-xs font-normal text-slate-500 mt-1">
                    {autonomyPriceHT}€ HT / {autonomyPriceTTC}€ TTC
                  </span>
                  <span className="text-xs text-slate-400">par user/mois</span>
                </div>
              </th>
              <th className="px-6 py-5 text-center text-sm font-bold border-b-2 border-slate-200 bg-cyrelis-blue/5 w-1/4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyrelis-blue to-slate-800 rounded-xl flex items-center justify-center text-white text-lg mb-2">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="text-cyrelis-blue text-lg">Partenaire</span>
                  <span className="text-xs font-normal text-slate-500 mt-1">
                    {partnerPriceHT}€ HT / {partnerPriceTTC}€ TTC
                  </span>
                  <span className="text-xs text-slate-400">par user/mois</span>
                  <span className="inline-block px-2 py-0.5 bg-cyrelis-blue text-white rounded text-xs mt-2 font-semibold">
                    ⭐ RECOMMANDÉ
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Infrastructure */}
            <tr className="bg-gradient-to-r from-cyrelis-mint/10 to-teal-50">
              <td colSpan={3} className="px-6 py-3 text-xs font-bold text-cyrelis-blue uppercase tracking-wider">
                🏗️ Infrastructure & Maintenance
              </td>
            </tr>
            <TableRow label="Hébergement cloud sécurisé (France)" autonomieValue={<CheckIcon />} partenaireValue={<CheckIcon />} />
            <TableRow label="Maintenance technique proactive" autonomieValue={<CheckIcon />} partenaireValue={<CheckIcon />} />
            <TableRow label="Mises à jour & Patches de sécurité" autonomieValue={<CheckIcon />} partenaireValue={<CheckIcon />} />
            <TableRow label="Sauvegardes quotidiennes chiffrées" autonomieValue={<CheckIcon />} partenaireValue={<CheckIcon />} />
            <TableRow label="Monitoring 24/7 avec alertes" autonomieValue={<CheckIcon />} partenaireValue={<CheckIcon />} />

            {/* Administration */}
            <tr className="bg-gradient-to-r from-amber-100 to-orange-50">
              <td colSpan={3} className="px-6 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider">
                ⚙️ Administration & Gestion — La vraie différence
              </td>
            </tr>
            <TableRow label="Gestion des utilisateurs (entrées/sorties)" autonomieValue={<YouManage />} partenaireValue={<WeManage />} highlight />
            <TableRow label="Gestion des accès & permissions" autonomieValue={<YouManage />} partenaireValue={<WeManage />} highlight />
            <TableRow label="Organisation des collections & groupes" autonomieValue={<YouManage />} partenaireValue={<WeManage />} highlight />
            <TableRow label="Administration système complète" autonomieValue={<CrossIcon />} partenaireValue={<CheckIcon />} highlight />

            {/* Support */}
            <tr className="bg-gradient-to-r from-cyrelis-mint/10 to-teal-50">
              <td colSpan={3} className="px-6 py-3 text-xs font-bold text-cyrelis-blue uppercase tracking-wider">
                📞 Support & Accompagnement
              </td>
            </tr>
            <TableRow label="Support email" autonomieValue={<span className="text-xs text-slate-600 font-medium">48h ouvrées</span>} partenaireValue={<span className="text-xs text-cyrelis-blue font-semibold">24h prioritaire</span>} />
            <TableRow label="Assistance téléphonique" autonomieValue={<CrossIcon />} partenaireValue={<span className="text-xs text-slate-600">Sur RDV</span>} />
            <TableRow label="Rapports mensuels d'activité" autonomieValue={<CrossIcon />} partenaireValue={<CheckIcon />} />
            <TableRow label="Interlocuteur dédié" autonomieValue={<CrossIcon />} partenaireValue={<CheckIcon />} />

            {/* Modules optionnels */}
            <tr className="bg-gradient-to-r from-purple-100 to-indigo-50">
              <td colSpan={3} className="px-6 py-3 text-xs font-bold text-purple-800 uppercase tracking-wider">
                🧩 Modules Optionnels (disponibles pour tous)
              </td>
            </tr>
            {iaModule && (
              <TableRow 
                label={`${iaModule.name} (${iaPriceHT}€ HT / ${iaPriceTTC}€ TTC par user/mois)`}
                autonomieValue={<AddOnIcon />} 
                partenaireValue={<AddOnIcon />} 
              />
            )}
            {pricingData.oneShots.map((extra) => (
              <TableRow 
                key={extra.slug}
                label={`${extra.name} (${extra.basePrice}€ HT / ${Math.round(extra.basePrice * 1.2)}€ TTC)`}
                autonomieValue={<AddOnIcon />} 
                partenaireValue={<AddOnIcon />} 
              />
            ))}

            {/* Tarification */}
            <tr className="bg-gradient-to-r from-amber-100 to-orange-50">
              <td colSpan={3} className="px-6 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider">
                💰 Tarification
              </td>
            </tr>
            <TableRow 
              label="Pack Démarrage (obligatoire, une fois)" 
              autonomieValue={<span className="text-xs font-medium">{config.buildBaseFee}€ HT + {config.buildPerUserFee}€/user</span>} 
              partenaireValue={<span className="text-xs font-medium">{config.buildBaseFee}€ HT + {config.buildPerUserFee}€/user</span>} 
            />
            <TableRow 
              label="Abonnement mensuel par utilisateur (HT)" 
              autonomieValue={<span className="font-bold text-cyrelis-mint text-xl">{autonomyPriceHT}€</span>} 
              partenaireValue={<span className="font-bold text-cyrelis-blue text-xl">{partnerPriceHT}€</span>} 
              highlight
            />
            <TableRow 
              label="Abonnement mensuel par utilisateur (TTC)" 
              autonomieValue={<span className="font-semibold text-slate-700 text-lg">{autonomyPriceTTC}€</span>} 
              partenaireValue={<span className="font-semibold text-slate-700 text-lg">{partnerPriceTTC}€</span>} 
              highlight
            />
          </tbody>
        </table>
      </div>

      {/* Footer légende */}
      <div className="bg-slate-50 p-6 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Inclus dans l'offre</span>
          </div>
          <div className="flex items-center gap-2">
            <AddOnIcon />
            <span>Disponible en option</span>
          </div>
          <div className="flex items-center gap-2">
            <CrossIcon />
            <span>Non disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyrelis-mint/20 rounded"></div>
            <span>Sécurité identique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ÉTAPE 1 : CHOIX DE L'OFFRE
// ============================================================
const Step1OfferChoice = ({
  pricingData,
  config,
  onSelect,
}: {
  pricingData: PricingData;
  config: ConfigState;
  onSelect: (offer: string) => void;
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const autonomyOffer = pricingData.subscriptions.find(o => 
    o.slug === "autonomy" || o.slug === "autonomie"
  );
  const partnerOffer = pricingData.subscriptions.find(o => 
    o.slug === "partner" || o.slug === "partenaire"
  );

  // Calcul HT/TTC
  const autonomyPriceHT = autonomyOffer?.pricePerUser || 5;
  const autonomyPriceTTC = Math.round(autonomyPriceHT * 1.2 * 100) / 100;
  const partnerPriceHT = partnerOffer?.pricePerUser || 10;
  const partnerPriceTTC = Math.round(partnerPriceHT * 1.2 * 100) / 100;

  const faqItems = [
    {
      question: "Pourquoi un investissement initial ?",
      answer: "Le Pack Démarrage couvre l'installation technique, la configuration de votre coffre-fort sécurisé et la formation de votre équipe. C'est une fondation solide qui ne se fait qu'une seule fois. Sans cette base, vous risquez des failles de configuration coûteuses à corriger."
    },
    {
      question: "Puis-je changer d'offre plus tard ?",
      answer: "Absolument ! Vous pouvez passer de l'offre Autonomie à Partenaire (ou inversement) à tout moment. Si vous commencez en autonome et réalisez que l'administration vous prend trop de temps, nous prenons le relais sans frais de migration."
    },
    {
      question: "La sécurité est-elle identique dans les deux offres ?",
      answer: "Oui ! Hébergement, maintenance, sauvegardes, monitoring : tout est au même niveau. La seule différence est dans le service humain : qui gère les utilisateurs au quotidien ? Vous (Autonomie) ou nous (Partenaire)."
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          variants={fadeInUp}
          className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          Choisissez votre{" "}
          <span className="text-cyrelis-blue">niveau d'accompagnement</span>
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          La sécurité technique est identique. Seul le service humain change.
        </motion.p>
      </div>

      {/* Explication BUILD vs RUN */}
      <motion.div 
        variants={scaleIn}
        className="bg-gradient-to-r from-cyrelis-blue via-cyrelis-blue to-slate-900 rounded-3xl p-8 text-white mb-12"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-2xl">
            <HelpCircle className="w-6 h-6 text-cyrelis-mint" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl mb-2">
              Comment ça fonctionne ?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Comme un architecte qui sépare la construction d'une maison de son entretien, 
              nous distinguons <strong className="text-white">l'installation</strong> (BUILD) 
              du <strong className="text-white">service mensuel</strong> (RUN).
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyrelis-mint/20 rounded-xl">
                <Wrench className="w-5 h-5 text-cyrelis-mint" />
              </div>
              <div>
                <h4 className="font-bold text-white">BUILD — Une seule fois</h4>
                <p className="text-xs text-slate-400">Investissement initial</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Audit de vos pratiques actuelles
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Installation du coffre-fort Bitwarden
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Formation de votre équipe
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-lg font-bold text-white">
                {pricingData.config.buildBaseFee}€ HT
                <span className="text-slate-400 text-sm font-normal ml-1">
                  ({Math.round(pricingData.config.buildBaseFee * 1.2)}€ TTC)
                </span>
              </div>
              <div className="text-slate-400 text-sm">+ {pricingData.config.buildPerUserFee}€ HT/user</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyrelis-mint/20 rounded-xl">
                <RefreshCcw className="w-5 h-5 text-cyrelis-mint" />
              </div>
              <div>
                <h4 className="font-bold text-white">RUN — Chaque mois</h4>
                <p className="text-xs text-slate-400">Abonnement récurrent</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Mises à jour de sécurité
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Support et accompagnement
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                Surveillance continue
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-lg font-bold text-white">
                À partir de {autonomyPriceHT}€ HT
                <span className="text-slate-400 text-sm font-normal ml-1">
                  ({autonomyPriceTTC}€ TTC)
                </span>
              </div>
              <div className="text-slate-400 text-sm">/user/mois</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes des offres */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Offre Autonomie */}
        <motion.div
          variants={scaleIn}
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl border-2 border-slate-200 p-8 hover:border-cyrelis-mint/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyrelis-mint/10 rounded-2xl">
                <Shield className="w-6 h-6 text-cyrelis-mint" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-slate-900">
                  {autonomyOffer?.name || "Autonomie"}
                </h3>
                <p className="text-sm text-slate-500">Vous gérez, nous maintenons</p>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-6">
            {autonomyOffer?.description || "Idéal pour les équipes autonomes avec un référent IT. Vous gardez le contrôle de la gestion quotidienne."}
          </p>

          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{autonomyPriceHT}€</span>
              <span className="text-sm text-slate-500">HT/user/mois</span>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Soit <strong>{autonomyPriceTTC}€ TTC</strong>/user/mois
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h4 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Ce que vous faites :</h4>
            <ul className="space-y-2">
              {["Gestion des utilisateurs", "Configuration des accès", "Support interne niveau 1"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-xs">!</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => onSelect(autonomyOffer?.slug || "autonomy")}
            className="w-full h-14 bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 rounded-xl text-lg"
          >
            Choisir Autonomie
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Offre Partenaire */}
        <motion.div
          variants={scaleIn}
          whileHover={{ y: -5 }}
          className="relative bg-gradient-to-b from-white to-cyrelis-blue/5 rounded-3xl border-2 border-cyrelis-blue p-8 shadow-lg shadow-cyrelis-blue/10 hover:shadow-xl transition-all duration-300"
        >
          <motion.div 
            className="absolute -top-4 right-6 px-4 py-1.5 bg-cyrelis-blue text-white text-sm font-bold rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Recommandé
          </motion.div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyrelis-blue/10 rounded-2xl">
                <Headphones className="w-6 h-6 text-cyrelis-blue" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-slate-900">
                  {partnerOffer?.name || "Partenaire"}
                </h3>
                <p className="text-sm text-slate-500">Nous gérons, vous êtes sereins</p>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-6">
            {partnerOffer?.description || "Délégation complète de l'administration. Idéal pour les entreprises sans équipe IT dédiée."}
          </p>

          <div className="mb-6 p-4 bg-cyrelis-blue/5 rounded-xl border border-cyrelis-blue/20">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-cyrelis-blue">{partnerPriceHT}€</span>
              <span className="text-sm text-slate-500">HT/user/mois</span>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Soit <strong>{partnerPriceTTC}€ TTC</strong>/user/mois
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h4 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Ce que nous faisons pour vous :</h4>
            <ul className="space-y-2">
              {["Gestion complète des utilisateurs", "Configuration et maintenance", "Support prioritaire (24h)"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-cyrelis-mint flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => onSelect(partnerOffer?.slug || "partner")}
            className="w-full h-14 bg-cyrelis-blue text-white font-semibold hover:bg-slate-800 rounded-xl text-lg shadow-lg shadow-cyrelis-blue/20"
          >
            Choisir Partenaire
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Bouton Comparatif */}
      <motion.div variants={fadeInUp} className="mb-8">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`w-full relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] ${
            showComparison ? "bg-cyrelis-blue" : "bg-gradient-to-r from-cyrelis-blue to-slate-800"
          }`}
        >
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <div className="text-white text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {showComparison ? 'Comparatif affiché' : 'Besoin de comparer ?'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {showComparison 
                      ? 'Cliquez pour masquer le tableau' 
                      : 'Voir le tableau comparatif Autonomie vs Partenaire'}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${
                showComparison ? "bg-white/20 text-white" : "bg-white text-cyrelis-blue"
              }`}>
                <span>{showComparison ? 'Masquer' : 'Voir le comparatif'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Mini aperçu */}
            {!showComparison && (
              <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
                <div>
                  <div className="text-2xl font-bold">🟢 vs 🔷</div>
                  <div className="text-xs text-white/70">2 offres</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-xs text-white/70">Critères</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{autonomyPriceHT}€ / {partnerPriceHT}€</div>
                  <div className="text-xs text-white/70">HT/user/mois</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">🔐</div>
                  <div className="text-xs text-white/70">Même sécurité</div>
                </div>
              </div>
            )}
          </div>
        </button>
      </motion.div>

      {/* Tableau Comparatif */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden mb-12"
          >
            <ComparisonTable pricingData={pricingData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Accordéon */}
      <motion.div variants={fadeInUp} className="bg-slate-50 rounded-3xl p-8">
        <button
          onClick={() => setShowFAQ(!showFAQ)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-cyrelis-blue" />
            <h3 className="font-heading font-bold text-xl text-slate-900">Questions fréquentes</h3>
          </div>
          {showFAQ ? (
            <ChevronUp className="w-6 h-6 text-slate-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-500" />
          )}
        </button>

        <AnimatePresence>
          {showFAQ && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-6">
                {faqItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">{item.question}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// ÉTAPE 2 : CONFIGURATION
// ============================================================
const Step2Configuration = ({
  pricingData,
  config,
  setConfig,
  onNext,
  onBack,
}: {
  pricingData: PricingData;
  config: ConfigState;
  setConfig: (config: ConfigState) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const selectedOffer = pricingData.subscriptions.find(s => s.slug === config.selectedOffer);
  const iaModule = pricingData.addons.find(a => a.slug?.includes("ia") || a.name?.toLowerCase().includes("ia"));
  
  const isAutonomie = config.selectedOffer === "autonomy" || config.selectedOffer === "autonomie";

  // Tous les modules sont accessibles pour toutes les offres
  const toggleExtra = (slug: string) => {
    setConfig({
      ...config,
      selectedExtras: config.selectedExtras.includes(slug)
        ? config.selectedExtras.filter(id => id !== slug)
        : [...config.selectedExtras, slug]
    });
  };

  const totalSelections = (config.iaEnabled ? 1 : 0) + config.selectedExtras.length;

  // Prix HT/TTC
  const buildBaseHT = pricingData.config.buildBaseFee;
  const buildBaseTTC = Math.round(buildBaseHT * 1.2);
  const buildPerUserHT = pricingData.config.buildPerUserFee;
  const buildPerUserTTC = Math.round(buildPerUserHT * 1.2 * 100) / 100;
  const iaPriceHT = iaModule?.pricePerUser || 3;
  const iaPriceTTC = Math.round(iaPriceHT * 1.2 * 100) / 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div 
          variants={fadeInUp}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
            isAutonomie ? "bg-cyrelis-mint/20 text-cyrelis-blue" : "bg-cyrelis-blue/10 text-cyrelis-blue"
          }`}
        >
          <Shield className="w-4 h-4" />
          Offre {selectedOffer?.name || "sélectionnée"}
        </motion.div>
        <motion.h1 
          variants={fadeInUp}
          className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          Configurez votre protection
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-slate-600"
        >
          Sélectionnez vos options, le récapitulatif complet vous attend à l'étape suivante
        </motion.p>
      </div>

      <div className="space-y-8">
        {/* Section 1 : Utilisateurs */}
        <motion.div
          variants={scaleIn}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-2xl ${isAutonomie ? "bg-cyrelis-mint/20" : "bg-cyrelis-blue/10"}`}>
              <Users className="w-6 h-6 text-cyrelis-blue" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Combien d'utilisateurs ?
              </h2>
              <p className="text-slate-500">Chaque collaborateur ayant besoin d'accéder aux mots de passe</p>
            </div>
          </div>

          {/* Contrôles utilisateurs */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfig({ ...config, users: Math.max(1, config.users - 10) })}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition"
              >
                -10
              </button>
              <button
                onClick={() => setConfig({ ...config, users: Math.max(1, config.users - 1) })}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition"
              >
                -
              </button>
            </div>

            <motion.div 
              className="text-center px-8"
              key={config.users}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              <div className={`text-7xl font-bold ${isAutonomie ? "text-cyrelis-mint" : "text-cyrelis-blue"}`}>
                {config.users}
              </div>
              <div className="text-sm text-slate-500 mt-1">utilisateurs</div>
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfig({ ...config, users: Math.min(500, config.users + 1) })}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition"
              >
                +
              </button>
              <button
                onClick={() => setConfig({ ...config, users: Math.min(500, config.users + 10) })}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition"
              >
                +10
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4 mb-6">
            <input
              type="range"
              min="1"
              max="100"
              value={Math.min(config.users, 100)}
              onChange={(e) => setConfig({ ...config, users: parseInt(e.target.value) })}
              className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${isAutonomie ? '#2dd4bf' : '#0f172a'} 0%, ${isAutonomie ? '#2dd4bf' : '#0f172a'} ${config.users}%, #e2e8f0 ${config.users}%, #e2e8f0 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100+</span>
            </div>
          </div>

          {/* Recommandation */}
          <div className={`p-4 rounded-xl border ${isAutonomie ? "bg-cyrelis-mint/5 border-cyrelis-mint/20" : "bg-cyrelis-blue/5 border-cyrelis-blue/20"}`}>
            <p className="text-sm text-slate-700">
              {config.users < 10 && (
                <>💡 <strong>Petite équipe :</strong> L'offre {selectedOffer?.name} est parfaite pour démarrer.</>
              )}
              {config.users >= 10 && config.users < 50 && (
                <>💡 <strong>PME :</strong> Pensez à inclure tous les collaborateurs, même les occasionnels.</>
              )}
              {config.users >= 50 && (
                <>💡 <strong>Organisation importante :</strong> Nous vous recommandons un échange personnalisé.</>
              )}
            </p>
          </div>
        </motion.div>

        {/* Section 2 : Pack Démarrage (inclus) */}
        <motion.div
          variants={scaleIn}
          className="bg-gradient-to-br from-cyrelis-blue to-slate-900 rounded-3xl p-8 text-white"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Building2 className="w-6 h-6 text-cyrelis-mint" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl">Pack Démarrage</h2>
                <span className="px-2 py-0.5 bg-cyrelis-mint text-cyrelis-blue text-xs font-bold rounded">INCLUS</span>
              </div>
              <p className="text-slate-400 text-sm">Installation et configuration initiale</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{buildBaseHT}€ HT <span className="text-slate-400 font-normal text-sm">({buildBaseTTC}€ TTC)</span></div>
              <div className="text-xs text-slate-400">+ {buildPerUserHT}€ HT/user ({buildPerUserTTC}€ TTC)</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {["Installation Bitwarden", "Architecture collections", "Configuration sécurité", "Onboarding équipe"].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 3 : Module IA (optionnel) */}
        {iaModule && (
          <motion.div
            variants={scaleIn}
            onClick={() => setConfig({ ...config, iaEnabled: !config.iaEnabled })}
            className={`rounded-3xl p-8 cursor-pointer transition-all border-2 ${
              config.iaEnabled
                ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-400 shadow-xl shadow-purple-500/20"
                : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${config.iaEnabled ? "bg-white/20" : "bg-purple-100"}`}>
                  <Cpu className={`w-7 h-7 ${config.iaEnabled ? "text-white" : "text-purple-600"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`font-heading font-bold text-xl ${config.iaEnabled ? "text-white" : "text-slate-900"}`}>
                      {iaModule.name}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      config.iaEnabled ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                    }`}>
                      OPTIONNEL
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      config.iaEnabled ? "bg-purple-300/30 text-purple-100" : "bg-slate-100 text-slate-600"
                    }`}>
                      {iaPriceHT}€ HT / {iaPriceTTC}€ TTC par user/mois
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${config.iaEnabled ? "text-purple-100" : "text-slate-500"}`}>
                    {iaModule.shortDesc || "Assistant IA pour la cybersécurité"}
                  </p>

                  {config.iaEnabled && iaModule.features && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {iaModule.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-purple-100">
                          <CheckCircle2 className="w-4 h-4 text-purple-300" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle */}
              <div className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 flex-shrink-0 ${
                config.iaEnabled ? "bg-white/30" : "bg-slate-200"
              }`}>
                <motion.div
                  className={`w-6 h-6 rounded-full shadow-md ${config.iaEnabled ? "bg-white" : "bg-slate-400"}`}
                  animate={{ x: config.iaEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Section 4 : Options sécurité - Accessibles pour TOUTES les offres */}
        {pricingData.oneShots.length > 0 && (
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Lock className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Options Sécurité Avancée</h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold">OPTIONNEL</span>
                </div>
                <p className="text-slate-500 text-sm">Disponibles pour toutes les offres • Payables une seule fois</p>
              </div>
              {config.selectedExtras.length > 0 && (
                <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-sm font-bold">
                  {config.selectedExtras.length} sélectionné{config.selectedExtras.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {pricingData.oneShots.map((extra) => {
                const isSelected = config.selectedExtras.includes(extra.slug);
                const extraPriceHT = extra.basePrice;
                const extraPriceTTC = Math.round(extraPriceHT * 1.2);

                return (
                  <div
                    key={extra.slug}
                    onClick={() => toggleExtra(extra.slug)}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-slate-800 bg-slate-50 shadow-lg"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-slate-800 text-white" : "bg-slate-100"
                      }`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-bold ${isSelected ? "text-slate-800" : "text-slate-900"}`}>
                            {extra.name}
                          </h4>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                            isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{extra.shortDesc}</p>
                        <div className="mt-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {extraPriceHT}€ HT
                          </span>
                          <span className="text-xs text-slate-500 ml-1">
                            ({extraPriceTTC}€ TTC)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {config.selectedExtras.length === 0 && (
              <p className="text-center text-slate-400 text-sm mt-4 py-2 bg-slate-50 rounded-lg">
                💡 Ces modules sont optionnels — vous pouvez les ajouter plus tard
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer navigation */}
      <motion.div
        variants={fadeInUp}
        className="mt-10 bg-white rounded-3xl shadow-lg p-6 border border-slate-200"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            <div className="hidden md:flex items-center gap-3 text-sm text-slate-500">
              <span className={`px-3 py-1 rounded-full font-semibold ${
                isAutonomie ? "bg-cyrelis-mint/20 text-cyrelis-blue" : "bg-cyrelis-blue/10 text-cyrelis-blue"
              }`}>
                {config.users} utilisateurs
              </span>
              {totalSelections > 0 && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  +{totalSelections} option{totalSelections > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={onNext}
            className={`px-8 py-4 h-14 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all ${
              isAutonomie 
                ? "bg-gradient-to-r from-cyrelis-mint to-teal-500 text-white"
                : "bg-gradient-to-r from-cyrelis-blue to-slate-800 text-white"
            }`}
          >
            Voir mon estimation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// ÉTAPE 3 : RÉCAPITULATIF
// ============================================================
const Step3Summary = ({
  pricingData,
  config,
  onBack,
  onReset,
}: {
  pricingData: PricingData;
  config: ConfigState;
  onBack: () => void;
  onReset: () => void;
}) => {
  const selectedOffer = pricingData.subscriptions.find(s => s.slug === config.selectedOffer);
  const iaModule = pricingData.addons.find(a => a.slug?.includes("ia") || a.name?.toLowerCase().includes("ia"));
  
  const isAutonomie = config.selectedOffer === "autonomy" || config.selectedOffer === "autonomie";
  const serviceLevel = isAutonomie ? "Autonomie" : "Partenaire";

  const TVA_RATE = 1.20;
  const toTTC = (ht: number) => Math.round(ht * TVA_RATE * 100) / 100;

  // Calculs financiers avec HT et TTC
  const pricing = useMemo(() => {
    const c = pricingData.config;
    const users = config.users;

    // CAPEX (One-Shot)
    const packBaseHT = c.buildBaseFee;
    const packBaseTTC = toTTC(packBaseHT);
    const packPerUserHT = c.buildPerUserFee;
    const packPerUserTTC = toTTC(packPerUserHT);
    const packTotalHT = packBaseHT + (users * packPerUserHT);
    const packTotalTTC = toTTC(packTotalHT);

    let extrasHT = 0;
    const selectedExtrasDetails: Offer[] = [];
    config.selectedExtras.forEach(slug => {
      const extra = pricingData.oneShots.find(e => e.slug === slug);
      if (extra) {
        extrasHT += extra.basePrice;
        selectedExtrasDetails.push(extra);
      }
    });
    const extrasTTC = toTTC(extrasHT);

    const totalOneShotHT = packTotalHT + extrasHT;
    const totalOneShotTTC = toTTC(totalOneShotHT);

    // OPEX (Récurrent)
    const licenseHT = selectedOffer?.pricePerUser || 5;
    const licenseTTC = toTTC(licenseHT);
    const licenseTotalHT = users * licenseHT;
    const licenseTotalTTC = toTTC(licenseTotalHT);

    const iaHT = iaModule?.pricePerUser || 3;
    const iaTTC = toTTC(iaHT);
    const iaTotalHT = config.iaEnabled ? users * iaHT : 0;
    const iaTotalTTC = config.iaEnabled ? toTTC(iaTotalHT) : 0;

    const monthlyTotalHT = licenseTotalHT + iaTotalHT;
    const monthlyTotalTTC = toTTC(monthlyTotalHT);

    // Projections annuelles
    const year1HT = totalOneShotHT + (monthlyTotalHT * 12);
    const year1TTC = toTTC(year1HT);
    const yearNHT = monthlyTotalHT * 12;
    const yearNTTC = toTTC(yearNHT);
    const savingsHT = year1HT - yearNHT;
    const savingsTTC = toTTC(savingsHT);
    const savingsPercent = Math.round((savingsHT / year1HT) * 100);

    return {
      users,
      serviceLevel,
      packBase: { ht: packBaseHT, ttc: packBaseTTC },
      packPerUser: { ht: packPerUserHT, ttc: packPerUserTTC },
      packTotal: { ht: packTotalHT, ttc: packTotalTTC },
      extras: selectedExtrasDetails,
      extrasTotal: { ht: extrasHT, ttc: extrasTTC },
      totalOneShot: { ht: totalOneShotHT, ttc: totalOneShotTTC },
      licensePerUser: { ht: licenseHT, ttc: licenseTTC },
      licenseTotal: { ht: licenseTotalHT, ttc: licenseTotalTTC },
      iaPerUser: { ht: iaHT, ttc: iaTTC },
      iaTotal: { ht: iaTotalHT, ttc: iaTotalTTC },
      iaEnabled: config.iaEnabled,
      monthlyTotal: { ht: monthlyTotalHT, ttc: monthlyTotalTTC },
      year1: { ht: year1HT, ttc: year1TTC },
      yearN: { ht: yearNHT, ttc: yearNTTC },
      savings: { ht: savingsHT, ttc: savingsTTC },
      savingsPercent,
    };
  }, [pricingData, config, selectedOffer, iaModule, serviceLevel]);

  // Matrice de responsabilités
  const getResponsibilities = () => {
    if (isAutonomie) {
      return {
        cyrelis: [
          { icon: "☁️", label: "Hébergement cloud sécurisé" },
          { icon: "💾", label: "Sauvegardes automatiques" },
          { icon: "🔄", label: "Mises à jour de sécurité" },
          { icon: "📊", label: "Monitoring 24/7" },
          { icon: "📚", label: "Documentation et guides" },
        ],
        client: [
          { icon: "👥", label: "Gestion des utilisateurs", critical: true },
          { icon: "🔐", label: "Configuration des accès", critical: true },
          { icon: "🔔", label: "Réponse aux alertes", critical: true },
          { icon: "🆘", label: "Support interne niveau 1", critical: false },
        ],
      };
    } else {
      return {
        cyrelis: [
          { icon: "☁️", label: "Hébergement cloud sécurisé" },
          { icon: "💾", label: "Sauvegardes automatiques" },
          { icon: "🔄", label: "Mises à jour de sécurité" },
          { icon: "📊", label: "Monitoring 24/7" },
          { icon: "👥", label: "Gestion complète des utilisateurs" },
          { icon: "🔐", label: "Configuration des accès" },
          { icon: "🔔", label: "Veille et alertes sécurité" },
          { icon: "⚡", label: "Support prioritaire (24h)" },
          { icon: "📈", label: "Rapports mensuels" },
        ],
        client: [
          { icon: "✅", label: "Validation des demandes", critical: false },
        ],
      };
    }
  };

  const responsibilities = getResponsibilities();

  const handleRequestQuote = () => {
    const subject = encodeURIComponent(`Demande de devis - Offre ${serviceLevel} - ${config.users} utilisateurs`);
    const body = encodeURIComponent(`
Bonjour,

Je souhaite obtenir un devis pour la configuration suivante :

📦 OFFRE : ${serviceLevel}
👥 UTILISATEURS : ${config.users}
🤖 MODULE IA : ${config.iaEnabled ? "Oui" : "Non"}
🛡️ OPTIONS : ${pricing.extras.length > 0 ? pricing.extras.map(e => e.name).join(", ") : "Aucune"}

💰 ESTIMATION :
- Investissement initial : ${formatPrice(pricing.totalOneShot.ht)} HT (${formatPrice(pricing.totalOneShot.ttc)} TTC)
- Coût mensuel : ${formatPrice(pricing.monthlyTotal.ht)} HT/mois (${formatPrice(pricing.monthlyTotal.ttc)} TTC/mois)
- Budget Année 1 : ${formatPrice(pricing.year1.ht)} HT (${formatPrice(pricing.year1.ttc)} TTC)
- Budget Années suivantes : ${formatPrice(pricing.yearN.ht)} HT/an (${formatPrice(pricing.yearN.ttc)} TTC/an)

Merci de me recontacter.

Cordialement
    `);
    window.open(`mailto:contact@cyrelis.fr?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-cyrelis-mint/20 text-cyrelis-blue rounded-full text-sm font-semibold mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Proposition personnalisée
        </motion.div>
        <motion.h1 
          variants={fadeInUp}
          className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          Votre offre {serviceLevel}
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-slate-600"
        >
          <span className="font-semibold">{config.users} utilisateur{config.users > 1 ? "s" : ""}</span>
          {config.iaEnabled && <span className="mx-2">•</span>}
          {config.iaEnabled && <span className="text-purple-600 font-medium">+ Module IA</span>}
        </motion.p>
      </div>

      {/* Section A : Matrice de responsabilités */}
      <motion.div variants={scaleIn} className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">A</span>
          Qui gère quoi ?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Colonne Cyrélis */}
          <div className={`rounded-2xl p-6 border ${
            isAutonomie ? "bg-cyrelis-mint/10 border-cyrelis-mint/30" : "bg-cyrelis-blue/10 border-cyrelis-blue/30"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                isAutonomie ? "bg-cyrelis-mint" : "bg-cyrelis-blue"
              }`}>
                C
              </div>
              <div>
                <h3 className={`font-bold ${isAutonomie ? "text-cyrelis-mint" : "text-cyrelis-blue"}`}>Géré par Cyrélis</h3>
                <p className="text-xs text-slate-500">On s'en occupe pour vous</p>
              </div>
            </div>

            <div className="space-y-2">
              {responsibilities.cyrelis.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/70 p-3 rounded-xl">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-slate-700 flex-1">{item.label}</span>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-xl text-center text-white ${
              isAutonomie ? "bg-cyrelis-mint" : "bg-cyrelis-blue"
            }`}>
              <span className="font-bold">{responsibilities.cyrelis.length} tâches</span>
              <span className="opacity-80 ml-1">gérées par Cyrélis</span>
            </div>
          </div>

          {/* Colonne Client */}
          <div className={`rounded-2xl p-6 border ${
            isAutonomie ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isAutonomie ? "bg-amber-500 text-white" : "bg-green-100 text-green-700"
              }`}>
                {isAutonomie ? "!" : "✓"}
              </div>
              <div>
                <h3 className={`font-bold ${isAutonomie ? "text-amber-700" : "text-green-700"}`}>
                  À votre charge
                </h3>
                <p className="text-xs text-slate-500">
                  {isAutonomie ? "Nécessite du temps interne" : "Presque rien !"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {responsibilities.client.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.critical ? "bg-amber-100/70 border border-amber-200" : "bg-white/70"
                }`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-slate-700 flex-1">{item.label}</span>
                  {item.critical && (
                    <span className="text-amber-600 text-xs font-semibold">Important</span>
                  )}
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-xl text-center text-white ${
              isAutonomie ? "bg-amber-500" : "bg-green-500"
            }`}>
              <span className="font-bold">{responsibilities.client.length} tâche{responsibilities.client.length > 1 ? "s" : ""}</span>
              <span className="opacity-80 ml-1">
                {isAutonomie ? "à gérer en interne" : "seulement"}
              </span>
            </div>
          </div>
        </div>

        {/* Conseil pour Autonomie */}
        {isAutonomie && responsibilities.client.length > 2 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>Vous manquez de temps ?</strong> Avec l'offre Partenaire, 
                Cyrélis gère tout cela pour vous.
              </p>
              <button 
                onClick={onReset}
                className="mt-2 text-sm font-semibold text-amber-700 underline hover:text-amber-900"
              >
                Comparer avec l'offre Partenaire →
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Section B : Transparence financière */}
      <motion.div variants={scaleIn} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">B</span>
          Transparence financière
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* CAPEX */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-xs">1</span>
              Investissement initial (une fois)
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900">Pack Démarrage</div>
                  <div className="text-xs text-slate-500">{pricing.packBase.ht}€ + ({config.users} × {pricing.packPerUser.ht}€)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatPrice(pricing.packTotal.ht)} <span className="text-xs font-normal text-slate-500">HT</span></div>
                  <div className="text-sm text-slate-600">{formatPrice(pricing.packTotal.ttc)} <span className="text-xs">TTC</span></div>
                </div>
              </div>

              {pricing.extras.length > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900">Options sécurité</div>
                    <div className="text-xs text-slate-500">{pricing.extras.map(e => e.name).join(", ")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatPrice(pricing.extrasTotal.ht)} <span className="text-xs font-normal text-slate-500">HT</span></div>
                    <div className="text-sm text-slate-600">{formatPrice(pricing.extrasTotal.ttc)} <span className="text-xs">TTC</span></div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Total CAPEX</span>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-800">{formatPrice(pricing.totalOneShot.ht)} <span className="text-sm font-normal text-slate-500">HT</span></div>
                  <div className="text-base font-bold text-slate-600">{formatPrice(pricing.totalOneShot.ttc)} <span className="text-xs">TTC</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* OPEX */}
          <div className={`rounded-xl p-6 border ${
            isAutonomie ? "bg-cyrelis-mint/10 border-cyrelis-mint/30" : "bg-cyrelis-blue/10 border-cyrelis-blue/30"
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isAutonomie ? "text-cyrelis-mint" : "text-cyrelis-blue"
            }`}>
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs text-white ${
                isAutonomie ? "bg-cyrelis-mint" : "bg-cyrelis-blue"
              }`}>2</span>
              Abonnement mensuel (récurrent)
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900">Licences {serviceLevel}</div>
                  <div className="text-xs text-slate-500">{config.users} × {pricing.licensePerUser.ht}€ HT ({pricing.licensePerUser.ttc}€ TTC)</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${isAutonomie ? "text-cyrelis-mint" : "text-cyrelis-blue"}`}>
                    {formatPrice(pricing.licenseTotal.ht)} <span className="text-xs font-normal text-slate-500">HT</span>
                  </div>
                  <div className="text-sm text-slate-600">{formatPrice(pricing.licenseTotal.ttc)} <span className="text-xs">TTC</span></div>
                </div>
              </div>

              {pricing.iaEnabled && (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-purple-700">Module IA</div>
                    <div className="text-xs text-slate-500">{config.users} × {pricing.iaPerUser.ht}€ HT ({pricing.iaPerUser.ttc}€ TTC)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-700">+{formatPrice(pricing.iaTotal.ht)} <span className="text-xs font-normal text-slate-500">HT</span></div>
                    <div className="text-sm text-purple-600">+{formatPrice(pricing.iaTotal.ttc)} <span className="text-xs">TTC</span></div>
                  </div>
                </div>
              )}

              <div className={`pt-3 border-t flex justify-between items-center ${
                isAutonomie ? "border-cyrelis-mint/30" : "border-cyrelis-blue/30"
              }`}>
                <span className="font-bold text-slate-700">Total OPEX/mois</span>
                <div className="text-right">
                  <div className={`text-xl font-black ${isAutonomie ? "text-cyrelis-mint" : "text-cyrelis-blue"}`}>
                    {formatPrice(pricing.monthlyTotal.ht)} <span className="text-sm font-normal text-slate-500">HT</span>
                  </div>
                  <div className="text-base font-bold text-slate-600">{formatPrice(pricing.monthlyTotal.ttc)} <span className="text-xs">TTC</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projections annuelles */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Année 1 */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Année 1 — L'investissement</h3>
              <span className="px-2 py-0.5 bg-white/10 rounded text-xs">CAPEX + OPEX</span>
            </div>

            <div className="mb-3">
              <div className="text-4xl font-black">{formatPrice(pricing.year1.ht)} <span className="text-lg font-normal text-slate-400">HT</span></div>
              <div className="text-xl font-bold text-slate-300">{formatPrice(pricing.year1.ttc)} <span className="text-sm font-normal text-slate-500">TTC</span></div>
            </div>

            <div className="text-xs text-slate-400 mb-4 font-mono bg-black/20 p-2 rounded">
              = {formatPrice(pricing.totalOneShot.ht)} + ({formatPrice(pricing.monthlyTotal.ht)} × 12)
            </div>

            <div className="space-y-2 text-sm border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Par mois (lissé)</span>
                <span className="font-semibold">{formatPrice(pricing.year1.ht / 12)} HT <span className="text-slate-400">({formatPrice(pricing.year1.ttc / 12)} TTC)</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Par utilisateur/mois</span>
                <span className="font-semibold">{formatPriceDecimal(pricing.year1.ht / 12 / config.users)} HT</span>
              </div>
            </div>
          </div>

          {/* Année 2+ */}
          <div className={`rounded-2xl p-6 text-white relative overflow-hidden ${
            isAutonomie 
              ? "bg-gradient-to-br from-cyrelis-mint to-teal-600" 
              : "bg-gradient-to-br from-cyrelis-blue to-slate-800"
          }`}>
            <div className="absolute -top-1 -right-1">
              <div className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl shadow-lg">
                -{pricing.savingsPercent}% vs A1
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Année 2+ — Croisière</h3>
              <span className="px-2 py-0.5 bg-white/20 rounded text-xs">OPEX seul</span>
            </div>

            <div className="mb-3">
              <div className="text-4xl font-black">{formatPrice(pricing.yearN.ht)} <span className="text-lg font-normal opacity-70">HT/an</span></div>
              <div className="text-xl font-bold opacity-90">{formatPrice(pricing.yearN.ttc)} <span className="text-sm font-normal opacity-70">TTC/an</span></div>
            </div>

            <div className="text-xs text-white/60 mb-4 font-mono bg-black/10 p-2 rounded">
              = {formatPrice(pricing.monthlyTotal.ht)} × 12
            </div>

            <div className="space-y-2 text-sm border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="text-white/70">Par mois</span>
                <span className="font-semibold">{formatPrice(pricing.monthlyTotal.ht)} HT <span className="text-white/50">({formatPrice(pricing.monthlyTotal.ttc)} TTC)</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Par utilisateur/mois</span>
                <span className="font-semibold">{formatPriceDecimal(pricing.monthlyTotal.ht / config.users)} HT</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/10 rounded-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <span className="text-sm">
                <strong>{formatPrice(pricing.savings.ht)} HT</strong> ({formatPrice(pricing.savings.ttc)} TTC) économisés vs A1
              </span>
            </div>
          </div>
        </div>

        {/* Explication */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Pourquoi cette différence ?</h4>
              <p className="text-sm text-slate-600">
                L'<strong>Année 1</strong> inclut l'installation et la formation (investissement unique). 
                Dès l'<strong>Année 2</strong>, vous ne payez plus que l'abonnement mensuel — votre coût devient prévisible.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Prêt à sécuriser votre entreprise ?</h3>
            <p className="text-sm text-slate-600">Recevez votre devis définitif sous 24h</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={onReset}
              className="flex-1 md:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Modifier
            </button>
            <Button
              onClick={handleRequestQuote}
              className={`flex-1 md:flex-none px-8 py-4 h-14 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all ${
                isAutonomie 
                  ? "bg-gradient-to-r from-cyrelis-mint to-teal-500 text-white"
                  : "bg-gradient-to-r from-cyrelis-blue to-slate-800 text-white"
              }`}
            >
              <Mail className="w-5 h-5 mr-2" />
              Demander un devis
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Trust badges */}
      <motion.div variants={fadeInUp} className="mt-8 text-center text-sm text-slate-500">
        <div className="flex items-center justify-center gap-6 mb-3">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyrelis-mint" />
            Données chiffrées AES-256
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyrelis-mint" />
            Hébergement France
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-cyrelis-mint" />
            Support humain
          </span>
        </div>
        <p>Tous les prix sont HT • Devis gratuit et sans engagement</p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function SimulateurPage() {
  // État des données
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État du wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    users: 10,
    selectedOffer: null,
    iaEnabled: false,
    selectedExtras: [],
  });

  // Charger les données
  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await fetch("/api/public/pricing");
        if (!response.ok) throw new Error("Erreur de chargement");
        const data = await response.json();
        setPricingData(data);
      } catch (err) {
        setError("Impossible de charger les tarifs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const handleOfferSelect = (offer: string) => {
    setConfig({ ...config, selectedOffer: offer });
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setConfig({
      users: 10,
      selectedOffer: null,
      iaEnabled: false,
      selectedExtras: [],
    });
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-28 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="w-12 h-12 text-cyrelis-blue mx-auto mb-6" />
          </motion.div>
          <p className="text-slate-600 text-lg">Chargement du configurateur...</p>
        </motion.div>
      </main>
    );
  }

  // Error
  if (error || !pricingData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">{error || "Erreur de chargement"}</p>
          <Button onClick={() => window.location.reload()} className="rounded-xl">
            Réessayer
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white pt-28 pb-20 overflow-hidden">
      <HeroBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header avec navigation */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            ) : (
              <div />
            )}
            
            {currentStep > 1 && (
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                Recommencer
              </button>
            )}
          </div>

          <ProgressTimeline currentStep={currentStep} />
        </div>

        {/* Contenu */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1OfferChoice
              key="step1"
              pricingData={pricingData}
              config={config}
              onSelect={handleOfferSelect}
            />
          )}

          {currentStep === 2 && (
            <Step2Configuration
              key="step2"
              pricingData={pricingData}
              config={config}
              setConfig={setConfig}
              onNext={() => setCurrentStep(3)}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Summary
              key="step3"
              pricingData={pricingData}
              config={config}
              onBack={handleBack}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #2dd4bf, #14b8a6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(45, 212, 191, 0.4);
          border: 4px solid white;
        }
        input[type="range"]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #2dd4bf, #14b8a6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(45, 212, 191, 0.4);
          border: 4px solid white;
        }
      `}</style>
    </main>
  );
}
