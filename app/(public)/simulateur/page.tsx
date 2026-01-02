"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Server,
  Bot,
  X,
  CloudUpload,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Send,
  Loader2,
  Lock,
  RefreshCcw,
  Headphones,
  FileSearch,
  Zap,
  Database,
  ShieldCheck,
  Monitor,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// TYPES & CONFIG
// ============================================================

interface OfferConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  unitType: "utilisateur" | "poste";
  isPopular: boolean;
  icon: React.ElementType;
  color: string;
  features: { text: string; included: boolean; detail?: string }[];
  highlights: { icon: React.ElementType; title: string; desc: string }[];
  idealFor: string[];
}

// Offres détaillées
const OFFERS: OfferConfig[] = [
  {
    id: "acces",
    name: "ACCÈS",
    tagline: "Gestion des identifiants",
    description: "Sécurisez les mots de passe de votre équipe avec Bitwarden Enterprise.",
    longDescription: "La solution idéale pour centraliser et protéger tous les accès de votre entreprise. Fini les mots de passe sur post-it ou fichiers Excel. Chaque collaborateur dispose d'un coffre-fort personnel et peut partager des accès de manière sécurisée avec l'équipe.",
    unitType: "utilisateur",
    isPopular: false,
    icon: KeyRound,
    color: "teal",
    features: [
      { text: "Bitwarden Enterprise", included: true, detail: "Licence professionnelle complète" },
      { text: "Coffre-fort personnel illimité", included: true, detail: "Mots de passe, notes, cartes bancaires" },
      { text: "Partage d'équipe sécurisé", included: true, detail: "Collections partagées avec contrôle d'accès" },
      { text: "Chiffrement AES-256 Zero-Knowledge", included: true, detail: "Même nous n'avons pas accès à vos données" },
      { text: "Authentification 2FA obligatoire", included: true, detail: "Double sécurité pour chaque compte" },
      { text: "Générateur de mots de passe", included: true, detail: "Création automatique de mots de passe forts" },
      { text: "Extensions navigateur & apps mobile", included: true, detail: "Chrome, Firefox, Safari, iOS, Android" },
      { text: "Protection des postes (Antivirus)", included: false },
      { text: "Maintenance proactive", included: false },
      { text: "Sauvegarde Cloud", included: false },
    ],
    highlights: [
      { icon: Lock, title: "Zéro connaissance", desc: "Vos données sont chiffrées avant de quitter votre appareil" },
      { icon: Users, title: "Gestion d'équipe", desc: "Ajoutez/retirez des membres en quelques clics" },
      { icon: RefreshCcw, title: "Synchronisation", desc: "Accès instantané sur tous vos appareils" },
    ],
    idealFor: ["Indépendants", "Petites équipes", "Entreprises qui veulent sécuriser leurs accès"],
  },
  {
    id: "serenite",
    name: "SÉRÉNITÉ",
    tagline: "Protection complète du poste",
    description: "Protection managée complète : antivirus IA, maintenance proactive et gestion des mots de passe.",
    longDescription: "Votre parc informatique sous haute protection. Nous installons, configurons et surveillons en permanence vos postes de travail. Antivirus de nouvelle génération avec IA, mises à jour automatiques, et intervention rapide en cas de problème. Vous vous concentrez sur votre métier, nous gérons votre sécurité.",
    unitType: "poste",
    isPopular: true,
    icon: Shield,
    color: "blue",
    features: [
      { text: "Tout le pack ACCÈS inclus", included: true, detail: "Bitwarden Enterprise pour tous vos utilisateurs" },
      { text: "SentinelOne (Antivirus IA)", included: true, detail: "Protection temps réel contre ransomwares et malwares" },
      { text: "NinjaOne (Pilotage & Maintenance)", included: true, detail: "Surveillance 24/7, mises à jour automatiques" },
      { text: "Rollback automatique", included: true, detail: "Annulation des actions malveillantes en un clic" },
      { text: "Alertes proactives", included: true, detail: "Espace disque, santé système, menaces détectées" },
      { text: "Intervention à distance", included: true, detail: "Résolution rapide sans vous déranger" },
      { text: "Rapports mensuels de santé", included: true, detail: "Visibilité complète sur l'état de votre parc" },
      { text: "Support téléphone prioritaire", included: true, detail: "Réponse sous 4h ouvrées" },
      { text: "Mise en conformité (RGPD, NIS2)", included: true, detail: "Accompagnement réglementaire" },
      { text: "Sauvegarde données Cloud", included: false },
    ],
    highlights: [
      { icon: Bot, title: "IA autonome", desc: "SentinelOne détecte et bloque les menaces sans intervention humaine" },
      { icon: Wrench, title: "Maintenance invisible", desc: "Mises à jour de nuit, vous ne voyez rien" },
      { icon: Headphones, title: "Support dédié", desc: "Un interlocuteur qui connaît votre entreprise" },
    ],
    idealFor: ["TPE/PME", "Cabinets comptables", "Professions libérales", "Artisans avec données sensibles"],
  },
  {
    id: "integrale",
    name: "INTÉGRALE",
    tagline: "Postes + Données Cloud",
    description: "Protection totale : postes sécurisés + sauvegarde de vos données Microsoft 365 et Google Workspace.",
    longDescription: "La protection la plus complète. En plus de la sécurité de vos postes, nous sauvegardons automatiquement toutes vos données Cloud : emails, documents OneDrive/Drive, calendriers, SharePoint... Une suppression accidentelle ou une attaque ? Nous restaurons tout en quelques minutes.",
    unitType: "poste",
    isPopular: false,
    icon: CloudUpload,
    color: "purple",
    features: [
      { text: "Tout le pack SÉRÉNITÉ inclus", included: true, detail: "Protection complète des postes" },
      { text: "Sauvegarde Microsoft 365", included: true, detail: "Emails, OneDrive, SharePoint, Teams" },
      { text: "Sauvegarde Google Workspace", included: true, detail: "Gmail, Drive, Agenda, Contacts" },
      { text: "Restauration granulaire", included: true, detail: "Récupérez un fichier, un email ou tout un compte" },
      { text: "Rétention longue durée (1 an)", included: true, detail: "Vos données conservées même après suppression" },
      { text: "Protection contre la suppression accidentelle", included: true, detail: "Filet de sécurité permanent" },
      { text: "Audit annuel de sécurité", included: true, detail: "Analyse complète et recommandations" },
      { text: "Rapports de conformité", included: true, detail: "Documentation pour vos clients/partenaires" },
      { text: "Accès console de restauration", included: true, detail: "Autonomie pour les restaurations simples" },
      { text: "Support prioritaire 24h", included: true, detail: "Réponse garantie sous 24h" },
    ],
    highlights: [
      { icon: Database, title: "Sauvegarde automatique", desc: "3 sauvegardes par jour, sans action de votre part" },
      { icon: FileSearch, title: "Restauration rapide", desc: "Retrouvez n'importe quel fichier en quelques clics" },
      { icon: ShieldCheck, title: "Conformité totale", desc: "RGPD, NIS2, assurances cyber - tout est couvert" },
    ],
    idealFor: ["Entreprises avec données Cloud critiques", "Utilisateurs Microsoft 365 / Google Workspace", "Structures réglementées"],
  },
];

// Écosystème technique
const TECH_STACK = [
  {
    name: "Bitwarden",
    role: "Gestion des accès",
    description: "Le gestionnaire de mots de passe open-source leader mondial. Chiffrement de bout en bout, audit de sécurité public, et confiance de millions d'utilisateurs.",
    icon: KeyRound,
    color: "text-blue-500",
  },
  {
    name: "SentinelOne",
    role: "Protection endpoint",
    description: "L'antivirus nouvelle génération. Son IA détecte les comportements suspects et neutralise les ransomwares avant qu'ils ne chiffrent vos données.",
    icon: Bot,
    color: "text-purple-500",
  },
  {
    name: "NinjaOne",
    role: "Pilotage & Maintenance",
    description: "Notre agent de supervision. Il maintient vos postes à jour, nous alerte en cas de problème et nous permet d'intervenir à distance instantanément.",
    icon: Server,
    color: "text-teal-500",
  },
];

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const slideIn = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

// ============================================================
// PROGRESS TIMELINE
// ============================================================
const ProgressTimeline = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, label: "Offre", icon: Shield },
    { num: 2, label: "Configuration", icon: Settings },
    { num: 3, label: "Contact", icon: MessageSquare },
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
// STEP 1: CHOIX DE L'OFFRE
// ============================================================
const Step1OfferChoice = ({ onSelect }: { onSelect: (offerId: string) => void }) => {
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  const faqItems = [
    {
      question: "Quelle est la différence entre les offres ?",
      answer: "ACCÈS = Bitwarden uniquement (gestion des mots de passe). SÉRÉNITÉ = ACCÈS + Antivirus IA (SentinelOne) + Maintenance proactive (NinjaOne). INTÉGRALE = SÉRÉNITÉ + Sauvegarde de vos données Cloud (Microsoft 365, Google Workspace)."
    },
    {
      question: "Comment se passe la mise en place ?",
      answer: "Nous nous occupons de tout ! Un technicien configure vos postes à distance ou sur site. La transition est transparente, vos collaborateurs n'ont rien à faire."
    },
    {
      question: "Puis-je changer d'offre plus tard ?",
      answer: "Absolument ! Vous pouvez passer de ACCÈS à SÉRÉNITÉ ou INTÉGRALE à tout moment, sans frais de migration. Vos données et configurations sont préservées."
    },
    {
      question: "Que se passe-t-il si j'ai un problème ?",
      answer: "Pour SÉRÉNITÉ et INTÉGRALE, nous intervenons à distance en moins de 4h. Pour ACCÈS, support par email sous 48h. En cas d'urgence, ligne téléphone directe."
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.span 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-slate-100 border border-slate-200 text-cyrelis-blue text-xs font-bold mb-6 uppercase tracking-wider"
        >
          <span className="w-2 h-2 rounded-full bg-cyrelis-mint animate-pulse"></span>
          Configurateur de devis
        </motion.span>
        <motion.h1 variants={fadeInUp} className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Choisissez votre niveau de protection
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-2xl mx-auto">
          Sélectionnez l'offre adaptée à vos besoins. Nous vous envoyons un devis personnalisé sous 24h.
        </motion.p>
      </div>

      {/* Cartes des offres */}
      <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 mb-12">
        {OFFERS.map((offer) => {
          const Icon = offer.icon;
          const isExpanded = expandedOffer === offer.id;
          
          return (
            <motion.div
              key={offer.id}
              variants={scaleIn}
              className={`relative bg-white rounded-2xl border transition-all duration-300 ${
                offer.isPopular 
                  ? "border-cyrelis-blue shadow-lg shadow-cyrelis-blue/10" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {offer.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyrelis-blue text-white text-xs font-bold px-4 py-1 rounded-full">
                  LE PLUS POPULAIRE
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    offer.color === "teal" ? "bg-teal-100" :
                    offer.color === "blue" ? "bg-blue-100" : "bg-purple-100"
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      offer.color === "teal" ? "text-teal-600" :
                      offer.color === "blue" ? "text-blue-600" : "text-purple-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{offer.name}</h3>
                    <p className="text-sm text-slate-500">{offer.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{offer.description}</p>

                {/* Highlights */}
                <div className="space-y-2 mb-4">
                  {offer.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <h.icon className="w-4 h-4 text-cyrelis-mint mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-slate-800">{h.title}</span>
                        <span className="text-sm text-slate-500"> – {h.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand/Collapse features */}
                <button
                  onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
                >
                  {isExpanded ? "Voir moins" : "Voir toutes les fonctionnalités"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
                        {offer.features.map((feature, i) => (
                          <div key={i} className={`flex items-start gap-2 ${feature.included ? "text-slate-700" : "text-slate-300"}`}>
                            {feature.included ? (
                              <CheckCircle2 className="w-4 h-4 text-cyrelis-mint mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <span className="text-sm">{feature.text}</span>
                              {feature.detail && feature.included && (
                                <p className="text-xs text-slate-400">{feature.detail}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-2">IDÉAL POUR :</p>
                        <div className="flex flex-wrap gap-1">
                          {offer.idealFor.map((item, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <Button
                  onClick={() => onSelect(offer.id)}
                  className={`w-full h-12 rounded-xl font-semibold text-sm mt-4 transition-all ${
                    offer.isPopular
                      ? "bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Configurer mon devis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tableau comparatif complet */}
      <motion.div variants={fadeInUp} className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Comparatif détaillé</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 bg-slate-50 font-semibold text-slate-600 w-[300px]">Fonctionnalités</th>
                {OFFERS.map((offer) => (
                  <th key={offer.id} className={`p-4 text-center ${offer.isPopular ? "bg-cyrelis-blue text-white" : "bg-slate-50"}`}>
                    <div className="font-bold text-lg">{offer.name}</div>
                    <div className={`text-xs ${offer.isPopular ? "text-blue-100" : "text-slate-400"}`}>
                      par {offer.unitType}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Gestion des mots de passe */}
              <tr className="bg-slate-50/50">
                <td colSpan={4} className="px-4 py-3 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-cyrelis-blue" />
                    Gestion des mots de passe
                  </div>
                </td>
              </tr>
              {[
                { label: "Bitwarden Enterprise", acces: true, serenite: true, integrale: true },
                { label: "Coffre-fort personnel illimité", acces: true, serenite: true, integrale: true },
                { label: "Partage sécurisé en équipe", acces: true, serenite: true, integrale: true },
                { label: "Chiffrement AES-256 Zero-Knowledge", acces: true, serenite: true, integrale: true },
                { label: "2FA obligatoire", acces: true, serenite: true, integrale: true },
                { label: "Apps mobile & extensions navigateur", acces: true, serenite: true, integrale: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-sm text-slate-700">{row.label}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.acces ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center bg-cyrelis-blue/5">
                    {row.serenite ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.integrale ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}

              {/* Protection des postes */}
              <tr className="bg-slate-50/50">
                <td colSpan={4} className="px-4 py-3 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-600" />
                    Protection des postes de travail
                  </div>
                </td>
              </tr>
              {[
                { label: "Antivirus IA (SentinelOne)", acces: false, serenite: true, integrale: true },
                { label: "Protection ransomware temps réel", acces: false, serenite: true, integrale: true },
                { label: "Rollback automatique (annulation d'attaque)", acces: false, serenite: true, integrale: true },
                { label: "Mises à jour Windows/Mac automatiques", acces: false, serenite: true, integrale: true },
                { label: "Surveillance 24/7 de la santé système", acces: false, serenite: true, integrale: true },
                { label: "Intervention à distance", acces: false, serenite: true, integrale: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-sm text-slate-700">{row.label}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.acces ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center bg-cyrelis-blue/5">
                    {row.serenite ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.integrale ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}

              {/* Sauvegarde Cloud */}
              <tr className="bg-slate-50/50">
                <td colSpan={4} className="px-4 py-3 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-indigo-600" />
                    Sauvegarde données Cloud
                  </div>
                </td>
              </tr>
              {[
                { label: "Sauvegarde Microsoft 365 (emails, OneDrive, SharePoint)", acces: false, serenite: false, integrale: true },
                { label: "Sauvegarde Google Workspace (Gmail, Drive)", acces: false, serenite: false, integrale: true },
                { label: "Restauration granulaire (fichier par fichier)", acces: false, serenite: false, integrale: true },
                { label: "Rétention 1 an", acces: false, serenite: false, integrale: true },
                { label: "3 sauvegardes automatiques par jour", acces: false, serenite: false, integrale: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-sm text-slate-700">{row.label}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.acces ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center bg-cyrelis-blue/5">
                    {row.serenite ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.integrale ? <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}

              {/* Support */}
              <tr className="bg-slate-50/50">
                <td colSpan={4} className="px-4 py-3 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-rose-600" />
                    Support & accompagnement
                  </div>
                </td>
              </tr>
              {[
                { label: "Support email", acces: "48h", serenite: "24h", integrale: "24h" },
                { label: "Support téléphone prioritaire", acces: false, serenite: true, integrale: true },
                { label: "Interlocuteur dédié", acces: false, serenite: true, integrale: true },
                { label: "Rapports mensuels", acces: false, serenite: true, integrale: true },
                { label: "Audit annuel de sécurité", acces: false, serenite: false, integrale: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-sm text-slate-700">{row.label}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.acces === true ? (
                      <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" />
                    ) : row.acces === false ? (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs font-medium text-slate-600">{row.acces}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center bg-cyrelis-blue/5">
                    {row.serenite === true ? (
                      <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" />
                    ) : row.serenite === false ? (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs font-medium text-cyrelis-blue">{row.serenite}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.integrale === true ? (
                      <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mx-auto" />
                    ) : row.integrale === false ? (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs font-medium text-purple-600">{row.integrale}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bouton Écosystème */}
      <motion.div variants={fadeInUp} className="mb-8">
        <button
          onClick={() => setShowEcosystem(!showEcosystem)}
          className="w-full bg-slate-900 rounded-2xl p-6 text-left hover:bg-slate-800 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyrelis-mint" />
              </div>
              <div className="text-white">
                <h3 className="text-lg font-bold">Nos outils partenaires</h3>
                <p className="text-slate-400 text-sm">Bitwarden, SentinelOne, NinjaOne – Les leaders du marché</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform ${showEcosystem ? "rotate-180" : ""}`} />
          </div>
        </button>
      </motion.div>

      <AnimatePresence>
        {showEcosystem && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-slate-800 rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-3 gap-6">
                {TECH_STACK.map((tech, i) => (
                  <div key={i} className="bg-white/10 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${tech.color}`}>
                        <tech.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{tech.name}</h4>
                        <p className="text-xs text-slate-400">{tech.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-6">
        <button onClick={() => setShowFAQ(!showFAQ)} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-cyrelis-blue" />
            <h3 className="font-bold text-lg text-slate-900">Questions fréquentes</h3>
          </div>
          {showFAQ ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        <AnimatePresence>
          {showFAQ && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4 mt-6">
                {faqItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
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
// STEP 2: CONFIGURATION
// ============================================================
const Step2Configuration = ({
  selectedOfferId,
  users,
  setUsers,
  onNext,
  onBack,
}: {
  selectedOfferId: string;
  users: number;
  setUsers: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const offer = OFFERS.find(o => o.id === selectedOfferId)!;
  const Icon = offer.icon;
  const unitPlural = offer.unitType === "utilisateur" ? "utilisateurs" : "postes";
  const unitSingular = offer.unitType;

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
          offer.color === "teal" ? "bg-teal-100 text-teal-700" :
          offer.color === "blue" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
        }`}>
          <Icon className="w-4 h-4" />
          Offre {offer.name}
        </motion.div>
        <motion.h1 variants={fadeInUp} className="font-heading text-4xl font-bold text-slate-900 mb-4">
          Combien de {unitPlural} à protéger ?
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-md mx-auto">
          {offer.unitType === "utilisateur" 
            ? "Comptez chaque collaborateur qui aura besoin d'un accès au gestionnaire de mots de passe."
            : "Comptez chaque ordinateur (PC ou Mac) à équiper et protéger."}
        </motion.p>
      </div>

      <motion.div variants={scaleIn} className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
        {/* Compteur */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={() => setUsers(Math.max(1, users - 1))}
            className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition text-2xl"
          >
            -
          </button>
          <div className="text-center">
            <div className="text-7xl font-bold text-slate-900">{users}</div>
            <div className="text-sm text-slate-500 mt-1">{users === 1 ? unitSingular : unitPlural}</div>
          </div>
          <button
            onClick={() => setUsers(Math.min(100, users + 1))}
            className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition text-2xl"
          >
            +
          </button>
        </div>

        {/* Slider */}
        <div className="px-2 mb-6">
          <input
            type="range"
            min="1"
            max="50"
            value={Math.min(users, 50)}
            onChange={(e) => setUsers(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${(Math.min(users, 50) / 50) * 100}%, #e2e8f0 ${(Math.min(users, 50) / 50) * 100}%, #e2e8f0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1</span>
            <span>10</span>
            <span>25</span>
            <span>50+</span>
          </div>
        </div>

        {/* Raccourcis */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[1, 3, 5, 10, 15, 25, 50].map(n => (
            <button
              key={n}
              onClick={() => setUsers(n)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                users === n ? 'bg-cyrelis-mint text-cyrelis-blue' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Récap offre */}
      <motion.div variants={scaleIn} className="bg-slate-900 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-cyrelis-mint" />
          <h3 className="font-bold text-lg">Récapitulatif : {offer.name}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{offer.longDescription}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {offer.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyrelis-mint flex-shrink-0" />
              <span className="text-sm">{h.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <Button onClick={onNext} className="px-8 py-4 h-14 bg-cyrelis-blue text-white rounded-xl font-bold hover:bg-cyrelis-blue/90">
          Obtenir mon devis
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          background: #2dd4bf;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
      `}</style>
    </motion.div>
  );
};

// ============================================================
// STEP 3: FORMULAIRE DE CONTACT
// ============================================================
const Step3Contact = ({
  selectedOfferId,
  users,
  onBack,
  onReset,
}: {
  selectedOfferId: string;
  users: number;
  onBack: () => void;
  onReset: () => void;
}) => {
  const offer = OFFERS.find(o => o.id === selectedOfferId)!;
  const unitPlural = offer.unitType === "utilisateur" ? "utilisateurs" : "postes";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Construire le message détaillé pour l'email
    const detailedMessage = `
═══════════════════════════════════════
📋 DEMANDE DE DEVIS - CONFIGURATEUR
═══════════════════════════════════════

👤 CONTACT
   • Nom : ${formData.name}
   • Email : ${formData.email}
   • Entreprise : ${formData.company || "Non renseignée"}
   • Téléphone : ${formData.phone || "Non renseigné"}

📦 CONFIGURATION DEMANDÉE
   • Offre : ${offer.name}
   • Description : ${offer.tagline}
   • Nombre : ${users} ${unitPlural}

✨ CE QUI EST INCLUS DANS ${offer.name} :
${offer.features.filter(f => f.included).map(f => `   ✓ ${f.text}`).join('\n')}

💬 MESSAGE DU CLIENT :
${formData.message || "Pas de message supplémentaire."}

═══════════════════════════════════════
⏰ Demande envoyée le ${new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
═══════════════════════════════════════
    `.trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message: detailedMessage,
          source: `configurateur-${offer.id}`,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");
      setIsSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer ou nous contacter à contact@cyrelis.fr");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
          <div className="w-20 h-20 bg-cyrelis-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-cyrelis-mint" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Demande envoyée !</h2>
          <p className="text-slate-600 mb-6">
            Merci <strong>{formData.name}</strong> !<br />
            Nous avons bien reçu votre demande de devis pour :
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-2">
              <offer.icon className="w-5 h-5 text-cyrelis-blue" />
              <span className="font-bold text-slate-900">Offre {offer.name}</span>
            </div>
            <p className="text-sm text-slate-600 ml-8">
              {users} {unitPlural} à protéger
            </p>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            Notre équipe vous recontacte sous <strong>24 heures</strong> avec un devis personnalisé.
          </p>
          <Button onClick={onReset} className="bg-slate-900 text-white hover:bg-slate-800">
            Nouvelle demande
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <motion.h1 variants={fadeInUp} className="font-heading text-3xl font-bold text-slate-900 mb-2">
          Finalisez votre demande de devis
        </motion.h1>
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-slate-100 rounded-full">
          <offer.icon className="w-4 h-4 text-cyrelis-blue" />
          <span className="text-sm font-medium text-slate-700">
            {offer.name} • {users} {unitPlural}
          </span>
        </motion.div>
      </div>

      <motion.form variants={scaleIn} onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nom complet <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyrelis-blue focus:border-transparent transition"
                placeholder="Jean Dupont"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email professionnel <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyrelis-blue focus:border-transparent transition"
                placeholder="jean@entreprise.fr"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Entreprise</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyrelis-blue focus:border-transparent transition"
                  placeholder="Mon Entreprise"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyrelis-blue focus:border-transparent transition"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Précisions sur votre projet <span className="text-slate-400">(optionnel)</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyrelis-blue focus:border-transparent resize-none transition"
              placeholder="Contexte particulier, délais, questions..."
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-cyrelis-blue text-white rounded-xl font-bold hover:bg-cyrelis-blue/90 disabled:opacity-50 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Recevoir mon devis gratuit
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Devis gratuit et sans engagement. Réponse sous 24h.
        </p>
      </motion.form>

      <motion.div variants={fadeInUp} className="mt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mx-auto">
          <ArrowLeft className="w-4 h-4" />
          Modifier ma configuration
        </button>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function SimulateurPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [users, setUsers] = useState(5);

  const handleOfferSelect = (offerId: string) => {
    setSelectedOfferId(offerId);
    const offer = OFFERS.find(o => o.id === offerId);
    setUsers(offer?.unitType === "poste" ? 5 : 5);
    setCurrentStep(2);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedOfferId(null);
    setUsers(5);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {currentStep > 1 && (
            <div className="flex items-center justify-end mb-4">
              <button onClick={handleReset} className="text-sm text-slate-500 hover:text-slate-700">
                Recommencer
              </button>
            </div>
          )}
          <ProgressTimeline currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && <Step1OfferChoice key="step1" onSelect={handleOfferSelect} />}
          {currentStep === 2 && selectedOfferId && (
            <Step2Configuration
              key="step2"
              selectedOfferId={selectedOfferId}
              users={users}
              setUsers={setUsers}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && selectedOfferId && (
            <Step3Contact
              key="step3"
              selectedOfferId={selectedOfferId}
              users={users}
              onBack={() => setCurrentStep(2)}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
