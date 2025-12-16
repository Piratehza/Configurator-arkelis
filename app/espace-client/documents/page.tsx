"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Lock,
  BookOpen,
  Video,
  Shield,
  CheckCircle,
  Loader2,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  description: string;
  type: "guide" | "formation" | "contrat" | "facture" | "securite";
  fileUrl: string;
  requiredOffer: "NONE" | "AUTONOMY" | "PARTNER" | null;
  isNew?: boolean;
}

interface UserSubscription {
  status: string;
  offerType: string;
}

// Documents disponibles (à terme depuis la BDD)
const AVAILABLE_DOCUMENTS: Document[] = [
  // Guides accessibles à tous
  {
    id: "1",
    name: "Guide de démarrage Bitwarden",
    description: "Premiers pas avec votre gestionnaire de mots de passe sécurisé",
    type: "guide",
    fileUrl: "/documents/guide-bitwarden.pdf",
    requiredOffer: null,
    isNew: true,
  },
  {
    id: "2",
    name: "Bonnes pratiques de sécurité",
    description: "Les 10 règles d'or pour protéger votre entreprise",
    type: "securite",
    fileUrl: "/documents/bonnes-pratiques.pdf",
    requiredOffer: null,
  },
  // Documents AUTONOMY
  {
    id: "3",
    name: "Guide administrateur Bitwarden",
    description: "Configuration avancée et gestion des utilisateurs",
    type: "guide",
    fileUrl: "/documents/guide-admin.pdf",
    requiredOffer: "AUTONOMY",
  },
  {
    id: "4",
    name: "Formation : Sécuriser ses mots de passe",
    description: "Module de formation complet (45 min) avec quiz",
    type: "formation",
    fileUrl: "/documents/formation-mdp.pdf",
    requiredOffer: "AUTONOMY",
  },
  // Documents PARTNER
  {
    id: "5",
    name: "Rapport de sécurité mensuel",
    description: "Template personnalisable de reporting sécurité",
    type: "securite",
    fileUrl: "/documents/rapport-securite.pdf",
    requiredOffer: "PARTNER",
    isNew: true,
  },
  {
    id: "6",
    name: "Formation : Sensibilisation Phishing",
    description: "Module avancé anti-phishing avec simulations",
    type: "formation",
    fileUrl: "/documents/formation-phishing.pdf",
    requiredOffer: "PARTNER",
  },
  {
    id: "7",
    name: "Guide de réponse aux incidents",
    description: "Procédures à suivre en cas de compromission",
    type: "securite",
    fileUrl: "/documents/reponse-incidents.pdf",
    requiredOffer: "PARTNER",
  },
];

const DOC_TYPE_CONFIG = {
  guide: { icon: BookOpen, color: "bg-blue-100 text-blue-600", label: "Guide" },
  formation: { icon: GraduationCap, color: "bg-purple-100 text-purple-600", label: "Formation" },
  contrat: { icon: FileCheck, color: "bg-slate-100 text-slate-600", label: "Contrat" },
  facture: { icon: FileText, color: "bg-green-100 text-green-600", label: "Facture" },
  securite: { icon: Shield, color: "bg-red-100 text-red-600", label: "Sécurité" },
};

const OFFER_LEVELS = {
  NONE: 0,
  AUTONOMY: 1,
  PARTNER: 2,
};

export default function DocumentsPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/client/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription);
        }
      } catch (err) {
        console.error("Erreur chargement abonnement:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, []);

  const userOfferLevel = OFFER_LEVELS[subscription?.offerType as keyof typeof OFFER_LEVELS] || 0;

  const canAccessDocument = (doc: Document) => {
    if (!doc.requiredOffer) return true;
    const requiredLevel = OFFER_LEVELS[doc.requiredOffer as keyof typeof OFFER_LEVELS] || 0;
    return userOfferLevel >= requiredLevel;
  };

  const filteredDocuments = AVAILABLE_DOCUMENTS.filter((doc) => {
    if (filter === "all") return true;
    return doc.type === filter;
  });

  const accessibleCount = filteredDocuments.filter(canAccessDocument).length;
  const lockedCount = filteredDocuments.length - accessibleCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyrelis-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Documents & Ressources
        </h1>
        <p className="text-slate-600 mt-1">
          Guides, formations et documents liés à votre abonnement
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <FolderOpen className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{AVAILABLE_DOCUMENTS.length}</p>
          <p className="text-sm text-slate-500">Documents totaux</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-green-600">{accessibleCount}</p>
          <p className="text-sm text-slate-500">Accessibles</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <Lock className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-2xl font-bold text-slate-400">{lockedCount}</p>
          <p className="text-sm text-slate-500">Verrouillés</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <Shield className="w-5 h-5 text-cyrelis-mint mb-2" />
          <p className="text-2xl font-bold text-cyrelis-blue">
            {subscription?.offerType || "Aucun"}
          </p>
          <p className="text-sm text-slate-500">Votre offre</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { key: "all", label: "Tous" },
          { key: "guide", label: "Guides" },
          { key: "formation", label: "Formations" },
          { key: "securite", label: "Sécurité" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === item.key
                ? "bg-cyrelis-blue text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-cyrelis-mint"
            }`}
          >
            {item.label}
          </button>
        ))}
      </motion.div>

      {/* Documents list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredDocuments.map((doc, index) => {
          const canAccess = canAccessDocument(doc);
          const config = DOC_TYPE_CONFIG[doc.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white rounded-xl border p-4 transition-all ${
                canAccess
                  ? "border-slate-200 hover:border-cyrelis-mint hover:shadow-md"
                  : "border-slate-100 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 truncate">
                      {doc.name}
                    </h3>
                    {doc.isNew && (
                      <span className="px-2 py-0.5 bg-cyrelis-mint text-cyrelis-blue text-xs font-medium rounded-full">
                        Nouveau
                      </span>
                    )}
                    {!canAccess && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {doc.requiredOffer}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{doc.description}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                {/* Action */}
                <div>
                  {canAccess ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyrelis-mint text-cyrelis-blue hover:bg-cyrelis-mint/10"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="opacity-50"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Verrouillé
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Upgrade CTA */}
      {lockedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-cyrelis-blue to-slate-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Shield className="w-6 h-6 text-cyrelis-mint" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-lg mb-1">
                Débloquez tous les documents
              </h3>
              <p className="text-white/70 text-sm">
                Passez à l'offre Partner pour accéder à {lockedCount} document{lockedCount > 1 ? "s" : ""} supplémentaire{lockedCount > 1 ? "s" : ""}, 
                incluant les formations avancées et les templates de reporting.
              </p>
            </div>
            <Button className="bg-cyrelis-mint text-cyrelis-blue hover:bg-white shrink-0">
              Voir les offres
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucun document dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}

