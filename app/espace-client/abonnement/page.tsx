"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Plus, 
  Minus,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Calendar,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionItem {
  id: string;
  quantity: number;
  unitPrice: number;
  offer: {
    id: string;
    name: string;
    shortDesc: string | null;
    pricePerUser: number | null;
  };
}

interface Subscription {
  id: string;
  status: string;
  totalMonthly: number;
  startDate: string;
  nextBillingDate: string | null;
  billingCycle: string;
  items: SubscriptionItem[];
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingLicenses, setAddingLicenses] = useState<string | null>(null);
  const [licenseCount, setLicenseCount] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/client/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleAddLicenses = async (itemId: string) => {
    setProcessing(true);
    try {
      const response = await fetch("/api/client/subscription/add-licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionItemId: itemId,
          quantity: licenseCount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`${licenseCount} licence(s) ajoutée(s) avec succès !`);
        setAddingLicenses(null);
        setLicenseCount(1);
        fetchSubscription(); // Refresh data
        
        // Clear success message after 3s
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding licenses:", error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { label: string; color: string; bgColor: string }> = {
      ACTIVE: { label: "Actif", color: "text-green-700", bgColor: "bg-green-100" },
      TRIAL: { label: "Période d'essai", color: "text-blue-700", bgColor: "bg-blue-100" },
      PAST_DUE: { label: "Paiement en retard", color: "text-orange-700", bgColor: "bg-orange-100" },
      PENDING: { label: "En attente", color: "text-slate-700", bgColor: "bg-slate-100" },
    };
    return statuses[status] || statuses.PENDING;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrelis-blue" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
          Aucun abonnement actif
        </h1>
        <p className="text-slate-600 mb-6">
          Vous n'avez pas encore d'abonnement Cyrélis.
        </p>
        <Button className="bg-cyrelis-blue text-white hover:bg-slate-800 rounded-xl">
          Configurer mon offre
        </Button>
      </div>
    );
  }

  const status = getStatusInfo(subscription.status);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Mon abonnement</h1>
        <p className="text-slate-600 mt-1">Gérez vos licences et services</p>
      </div>

      {/* Subscription Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyrelis-blue flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyrelis-mint" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Abonnement Cyrélis
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">
                {subscription.totalMonthly.toFixed(2)}€<span className="text-lg text-slate-500">/mois</span>
              </p>
            </div>
          </div>
        </div>

        {/* Billing info */}
        <div className="p-6 bg-slate-50 grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-slate-500">Début</p>
              <p className="font-medium text-slate-900">
                {new Date(subscription.startDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-slate-500">Cycle de facturation</p>
              <p className="font-medium text-slate-900">
                {subscription.billingCycle === "MONTHLY" ? "Mensuel" : 
                 subscription.billingCycle === "QUARTERLY" ? "Trimestriel" : "Annuel"}
              </p>
            </div>
          </div>
          {subscription.nextBillingDate && (
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-slate-500">Prochain prélèvement</p>
                <p className="font-medium text-slate-900">
                  {new Date(subscription.nextBillingDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Services et licences
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {subscription.items.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyrelis-mint/20 to-blue-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-cyrelis-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900">{item.offer.name}</h3>
                    {item.offer.shortDesc && (
                      <p className="text-sm text-slate-500">{item.offer.shortDesc}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{item.quantity}</p>
                    <p className="text-xs text-slate-500">licence{item.quantity > 1 ? "s" : ""}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-slate-900">
                      {(item.unitPrice * item.quantity).toFixed(2)}€
                    </p>
                    <p className="text-xs text-slate-500">/mois</p>
                  </div>

                  {/* Add licenses button */}
                  {item.offer.pricePerUser && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddingLicenses(item.id);
                        setLicenseCount(1);
                      }}
                      className="rounded-xl border-cyrelis-mint text-cyrelis-blue hover:bg-cyrelis-mint/10"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </div>
              </div>

              {/* Add licenses form */}
              <AnimatePresence>
                {addingLicenses === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-slate-100"
                  >
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">Ajouter des licences</h4>
                        <button
                          onClick={() => setAddingLicenses(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setLicenseCount(Math.max(1, licenseCount - 1))}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-2xl font-bold text-slate-900 w-12 text-center">
                            {licenseCount}
                          </span>
                          <button
                            onClick={() => setLicenseCount(licenseCount + 1)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Cost preview */}
                        <div className="flex-1">
                          <p className="text-sm text-slate-500">Coût supplémentaire</p>
                          <p className="text-xl font-bold text-cyrelis-blue">
                            +{(item.unitPrice * licenseCount).toFixed(2)}€<span className="text-sm text-slate-500">/mois</span>
                          </p>
                        </div>

                        {/* Confirm button */}
                        <Button
                          onClick={() => handleAddLicenses(item.id)}
                          disabled={processing}
                          className="bg-cyrelis-mint text-cyrelis-blue hover:bg-teal-400 rounded-xl font-bold"
                        >
                          {processing ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Traitement...
                            </span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Confirmer
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-slate-500 mt-4">
                        * Le montant sera proraté sur votre prochaine facture
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Need help */}
      <div className="bg-slate-100 rounded-2xl p-6 text-center">
        <p className="text-slate-600">
          Besoin de modifier votre abonnement ou d'ajouter un nouveau service ?
        </p>
        <p className="text-cyrelis-blue font-medium mt-1">
          Contactez-nous à <a href="mailto:contact@cyrelis.fr" className="underline">contact@cyrelis.fr</a>
        </p>
      </div>
    </div>
  );
}


