"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Package, 
  Edit2, 
  Trash2,
  Check,
  X,
  Euro,
  Settings,
  Eye,
  EyeOff,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Copy,
  Save,
  AlertCircle,
  CheckCircle,
  Layers,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  category: string;
  offerType: string;
  restrictedToSlug: string | null;
  quota: string | null;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  features: string[];
  _count?: { subscriptionItems: number };
}

interface PricingConfig {
  buildBaseFee: number;
  buildPerUserFee: number;
  vatRate: number;
  minUsers: number;
  maxUsers: number;
}

const categoryConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  SECURITY: { label: "Sécurité", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Shield },
  BACKUP: { label: "Sauvegarde", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package },
  SUPPORT: { label: "Support", color: "bg-green-100 text-green-700 border-green-200", icon: Users },
  TRAINING: { label: "Formation", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Zap },
  ADDON: { label: "Add-on", color: "bg-slate-100 text-slate-700 border-slate-200", icon: Plus },
};

const priceTypeConfig: Record<string, { label: string; suffix: string }> = {
  MONTHLY: { label: "Mensuel", suffix: "/mois" },
  YEARLY: { label: "Annuel", suffix: "/an" },
  ONE_TIME: { label: "Unique", suffix: "" },
  PER_USER: { label: "Par utilisateur", suffix: "/user/mois" },
};

const offerTypeConfig: Record<string, { label: string; color: string; description: string }> = {
  SUBSCRIPTION: { 
    label: "Abonnement", 
    color: "bg-cyrelis-blue text-white",
    description: "Offre récurrente principale (Autonomie, Partenaire)"
  },
  ADDON: { 
    label: "Module", 
    color: "bg-cyrelis-mint text-cyrelis-blue",
    description: "Module complémentaire récurrent (ex: Module IA)"
  },
  ONE_SHOT: { 
    label: "One-Shot", 
    color: "bg-amber-100 text-amber-700",
    description: "Service ponctuel facturé une fois (Audit, Migration...)"
  },
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filterOfferType, setFilterOfferType] = useState<string>("all");

  // Pricing config state
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    buildBaseFee: 490,
    buildPerUserFee: 15,
    vatRate: 20,
    minUsers: 1,
    maxUsers: 500,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    priceType: "PER_USER",
    basePrice: 0,
    pricePerUser: 0,
    setupFee: 0,
    category: "SECURITY",
    offerType: "SUBSCRIPTION",
    restrictedToSlug: "",
    quota: "",
    isActive: true,
    isPopular: false,
    sortOrder: 0,
    features: [] as string[],
  });

  const [newFeature, setNewFeature] = useState("");

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/admin/offers");
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingConfig = async () => {
    try {
      const response = await fetch("/api/admin/pricing-config");
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setPricingConfig(data.config);
        }
      }
    } catch (error) {
      console.error("Error fetching pricing config:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchPricingConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const dataToSend = {
        ...formData,
        restrictedToSlug: formData.restrictedToSlug || null,
        quota: formData.quota || null,
        pricePerUser: formData.pricePerUser || null,
      };

      const url = editingOffer 
        ? `/api/admin/offers/${editingOffer.id}`
        : "/api/admin/offers";
      
      const response = await fetch(url, {
        method: editingOffer ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMessage({ type: "success", text: editingOffer ? "Offre modifiée !" : "Offre créée !" });
        setTimeout(() => {
          setShowForm(false);
          setEditingOffer(null);
          resetForm();
          fetchOffers();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Erreur lors de la sauvegarde" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePricingConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/pricing-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricingConfig),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Configuration sauvegardée !" });
        setTimeout(() => setShowSettings(false), 1000);
      } else {
        setMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return;

    try {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOffers();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !offer.isActive }),
      });

      if (response.ok) {
        fetchOffers();
      }
    } catch (error) {
      console.error("Error toggling offer:", error);
    }
  };

  const handleDuplicate = (offer: Offer) => {
    setFormData({
      name: `${offer.name} (copie)`,
      slug: `${offer.slug}-copy`,
      description: offer.description || "",
      shortDesc: offer.shortDesc || "",
      priceType: offer.priceType,
      basePrice: offer.basePrice,
      pricePerUser: offer.pricePerUser || 0,
      setupFee: offer.setupFee,
      category: offer.category,
      offerType: offer.offerType || "SUBSCRIPTION",
      restrictedToSlug: offer.restrictedToSlug || "",
      quota: offer.quota || "",
      isActive: false,
      isPopular: false,
      sortOrder: offers.length,
      features: [...offer.features],
    });
    setEditingOffer(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      shortDesc: "",
      priceType: "PER_USER",
      basePrice: 0,
      pricePerUser: 0,
      setupFee: 0,
      category: "SECURITY",
      offerType: "SUBSCRIPTION",
      restrictedToSlug: "",
      quota: "",
      isActive: true,
      isPopular: false,
      sortOrder: offers.length,
      features: [],
    });
    setNewFeature("");
    setMessage(null);
  };

  const openEditForm = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      slug: offer.slug,
      description: offer.description || "",
      shortDesc: offer.shortDesc || "",
      priceType: offer.priceType,
      basePrice: offer.basePrice,
      pricePerUser: offer.pricePerUser || 0,
      setupFee: offer.setupFee,
      category: offer.category,
      offerType: offer.offerType || "SUBSCRIPTION",
      restrictedToSlug: offer.restrictedToSlug || "",
      quota: offer.quota || "",
      isActive: offer.isActive,
      isPopular: offer.isPopular,
      sortOrder: offer.sortOrder,
      features: [...offer.features],
    });
    setMessage(null);
    setShowForm(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ 
      ...formData, 
      features: formData.features.filter((_, i) => i !== index) 
    });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Récupérer les offres de type SUBSCRIPTION pour la restriction
  const subscriptionOffers = offers.filter(o => o.offerType === "SUBSCRIPTION" && o.isActive);

  const filteredOffers = filterOfferType === "all" 
    ? offers 
    : offers.filter(o => o.offerType === filterOfferType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Catalogue d&apos;offres</h1>
          <p className="text-slate-600 mt-1">Gérez vos offres BUILD/RUN pour le simulateur</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
            className="rounded-xl"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuration BUILD
          </Button>
          <Button
            onClick={() => { resetForm(); setEditingOffer(null); setShowForm(true); }}
            className="bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      {/* Filters par type d'offre */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setFilterOfferType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterOfferType === "all" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Toutes ({offers.length})
          </button>
          {Object.entries(offerTypeConfig).map(([key, config]) => {
            const count = offers.filter(o => o.offerType === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterOfferType(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterOfferType === key 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyrelis-blue/10 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-cyrelis-blue" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-slate-900">
                        Configuration BUILD
                      </h2>
                      <p className="text-sm text-slate-500">Frais initiaux du Pack Démarrage</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* BUILD Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-cyrelis-blue" />
                    Phase BUILD (One-Shot)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Frais de base (€)
                      </label>
                      <input
                        type="number"
                        value={pricingConfig.buildBaseFee}
                        onChange={(e) => setPricingConfig({ ...pricingConfig, buildBaseFee: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Par utilisateur (€)
                      </label>
                      <input
                        type="number"
                        value={pricingConfig.buildPerUserFee}
                        onChange={(e) => setPricingConfig({ ...pricingConfig, buildPerUserFee: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                      />
                    </div>
                  </div>
                </div>

                {/* TVA & Limites */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Euro className="w-4 h-4 text-cyrelis-blue" />
                    TVA & Limites
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        TVA (%)
                      </label>
                      <input
                        type="number"
                        value={pricingConfig.vatRate}
                        onChange={(e) => setPricingConfig({ ...pricingConfig, vatRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Min. users
                      </label>
                      <input
                        type="number"
                        value={pricingConfig.minUsers}
                        onChange={(e) => setPricingConfig({ ...pricingConfig, minUsers: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Max. users
                      </label>
                      <input
                        type="number"
                        value={pricingConfig.maxUsers}
                        onChange={(e) => setPricingConfig({ ...pricingConfig, maxUsers: parseInt(e.target.value) || 500 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Aperçu pour 10 utilisateurs :</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">BUILD</span>
                    <span className="font-semibold">{pricingConfig.buildBaseFee + (pricingConfig.buildPerUserFee * 10)}€ HT</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">TVA ({pricingConfig.vatRate}%)</span>
                    <span className="font-semibold">{((pricingConfig.buildBaseFee + (pricingConfig.buildPerUserFee * 10)) * pricingConfig.vatRate / 100).toFixed(2)}€</span>
                  </div>
                </div>

                {message && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}

                <Button
                  onClick={handleSavePricingConfig}
                  disabled={saving}
                  className="w-full bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 rounded-xl"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    {editingOffer ? "Modifier l'offre" : "Nouvelle offre"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {editingOffer ? "Modifiez les détails de l'offre" : "Créez une nouvelle offre pour votre catalogue"}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Type d'offre (IMPORTANT - en premier) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type d&apos;offre *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(offerTypeConfig).map(([key, config]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, offerType: key })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.offerType === key
                              ? "border-cyrelis-blue bg-cyrelis-blue/5"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${config.color}`}>
                            {config.label}
                          </span>
                          <p className="text-xs text-slate-500">{config.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nom & Slug */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nom de l&apos;offre *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({ 
                            ...formData, 
                            name,
                            slug: editingOffer ? formData.slug : generateSlug(name)
                          });
                        }}
                        required
                        placeholder="Ex: Offre Partenaire"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Identifiant (slug) *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                        required
                        placeholder="offre-partenaire"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Description courte
                      </label>
                      <input
                        type="text"
                        value={formData.shortDesc}
                        onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                        placeholder="Une phrase d'accroche pour l'offre"
                        maxLength={100}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">{formData.shortDesc.length}/100 caractères</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Description détaillée
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Description complète de l'offre..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Catégorie
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(categoryConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: key })}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                              formData.category === key
                                ? "border-cyrelis-blue bg-cyrelis-blue/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${formData.category === key ? "text-cyrelis-blue" : "text-slate-400"}`} />
                            <span className={`text-xs font-medium ${formData.category === key ? "text-cyrelis-blue" : "text-slate-600"}`}>
                              {config.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prix - adapté selon le type */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {formData.offerType === "ONE_SHOT" ? "Prix unique (€) *" : "Prix de base (€)"}
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                        />
                      </div>
                    </div>
                    {formData.offerType !== "ONE_SHOT" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Prix par utilisateur (€/mois)
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.pricePerUser}
                            onChange={(e) => setFormData({ ...formData, pricePerUser: parseFloat(e.target.value) || 0 })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Frais de setup (€)
                      </label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.setupFee}
                          onChange={(e) => setFormData({ ...formData, setupFee: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options spécifiques au type */}
                  {formData.offerType === "ADDON" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Quota (optionnel)
                      </label>
                      <input
                        type="text"
                        value={formData.quota}
                        onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                        placeholder="Ex: 30 requêtes/user/mois"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                      />
                    </div>
                  )}

                  {formData.offerType === "ONE_SHOT" && subscriptionOffers.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Restreindre à une offre (optionnel)
                      </label>
                      <select
                        value={formData.restrictedToSlug}
                        onChange={(e) => setFormData({ ...formData, restrictedToSlug: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                      >
                        <option value="">Disponible pour toutes les offres</option>
                        {subscriptionOffers.map((offer) => (
                          <option key={offer.slug} value={offer.slug}>
                            Réservé à : {offer.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-400 mt-1">
                        Si défini, cette option ne sera disponible que pour les clients ayant souscrit à l&apos;offre sélectionnée.
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Fonctionnalités incluses
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                        placeholder="Ajouter une fonctionnalité..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
                      />
                      <Button type="button" onClick={addFeature} variant="outline" className="rounded-xl px-4">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.features.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg group">
                            <Layers className="w-4 h-4 text-slate-300" />
                            <Check className="w-4 h-4 text-cyrelis-mint" />
                            <span className="flex-1 text-sm text-slate-700">{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                        Aucune fonctionnalité ajoutée
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-slate-300 text-cyrelis-blue focus:ring-cyrelis-mint"
                      />
                      <span className="text-sm text-slate-700 flex items-center gap-1">
                        <Eye className="w-4 h-4" /> Offre visible
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="rounded border-slate-300 text-cyrelis-blue focus:ring-cyrelis-mint"
                      />
                      <span className="text-sm text-slate-700 flex items-center gap-1">
                        <Star className="w-4 h-4" /> Badge &quot;Recommandé&quot;
                      </span>
                    </label>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {message.text}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex gap-3 flex-shrink-0 bg-slate-50">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)} 
                    className="flex-1 rounded-xl"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 rounded-xl"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingOffer ? "Enregistrer" : "Créer l'offre"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyrelis-blue" />
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-2">
            {filterOfferType === "all" ? "Aucune offre dans le catalogue" : "Aucune offre de ce type"}
          </p>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="mt-4 bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une offre
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => {
            const categoryInfo = categoryConfig[offer.category] || categoryConfig.ADDON;
            const CategoryIcon = categoryInfo.icon;
            const offerTypeInfo = offerTypeConfig[offer.offerType] || offerTypeConfig.SUBSCRIPTION;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden relative group transition-shadow hover:shadow-lg ${
                  offer.isActive ? "border-slate-200" : "border-slate-200 opacity-60"
                }`}
              >
                {/* Badge type + populaire */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${offerTypeInfo.color}`}>
                    {offerTypeInfo.label}
                  </span>
                  {offer.isPopular && (
                    <span className="bg-gradient-to-r from-cyrelis-mint to-teal-400 text-cyrelis-blue text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Star className="w-3 h-3" /> Top
                    </span>
                  )}
                </div>

                {/* Indicateur actif/inactif */}
                <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${offer.isActive ? "bg-green-500" : "bg-slate-300"}`} />

                <div className="p-6 pt-12">
                  {/* Catégorie */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryInfo.color}`}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {categoryInfo.label}
                    </span>
                    {offer.restrictedToSlug && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Lock className="w-3 h-3 mr-1" />
                        {offer.restrictedToSlug}
                      </span>
                    )}
                  </div>

                  {/* Nom */}
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">{offer.name}</h3>
                  
                  {/* Description courte */}
                  {offer.shortDesc && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{offer.shortDesc}</p>
                  )}

                  {/* Prix */}
                  <div className="flex items-baseline gap-1.5 mb-4">
                    {offer.offerType === "ONE_SHOT" ? (
                      <>
                        <span className="text-3xl font-bold text-slate-900">{offer.basePrice}</span>
                        <span className="text-lg text-slate-400">€</span>
                        <span className="text-slate-500 text-sm">unique</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-slate-900">{offer.pricePerUser || offer.basePrice}</span>
                        <span className="text-lg text-slate-400">€</span>
                        <span className="text-slate-500 text-sm">{priceTypeConfig[offer.priceType]?.suffix}</span>
                      </>
                    )}
                  </div>

                  {/* Quota si addon */}
                  {offer.quota && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 mb-3">
                      Quota: {offer.quota}
                    </p>
                  )}

                  {/* Features */}
                  {offer.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {offer.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-cyrelis-mint flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {offer.features.length > 3 && (
                        <li className="text-xs text-slate-400 pl-6">
                          +{offer.features.length - 3} autres fonctionnalités
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {offer._count?.subscriptionItems || 0} abonnement{(offer._count?.subscriptionItems || 0) > 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                      title={offer.isActive ? "Désactiver" : "Activer"}
                    >
                      {offer.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDuplicate(offer)}
                      className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditForm(offer)}
                      className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
