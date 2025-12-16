"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionItem {
  id: string;
  quantity: number;
  unitPrice: number;
  offer: {
    name: string;
    shortDesc: string | null;
  };
}

interface Subscription {
  id: string;
  status: string;
  totalMonthly: number;
  startDate: string;
  nextBillingDate: string | null;
  items: SubscriptionItem[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchSubscription();
  }, []);

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
      ACTIVE: { label: "Actif", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
      TRIAL: { label: "Essai", color: "bg-blue-100 text-blue-700", icon: Clock },
      PAST_DUE: { label: "Paiement en retard", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
      PENDING: { label: "En attente", color: "bg-slate-100 text-slate-700", icon: Clock },
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

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Bonjour, {session?.user?.name?.split(" ")[0] || ""}
        </h1>
        <p className="text-slate-600 mt-1">
          Bienvenue dans votre espace client Cyrélis
        </p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-cyrelis-blue to-slate-800 rounded-3xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-cyrelis-mint" />
            </div>
            <div>
              <p className="text-slate-300 text-sm">Statut de protection</p>
              {subscription ? (
                <>
                  <p className="text-2xl font-bold flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-cyrelis-mint animate-pulse" />
                    Protection Active
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Depuis le {new Date(subscription.startDate).toLocaleDateString("fr-FR")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Aucun abonnement
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Configurez votre protection
                  </p>
                </>
              )}
            </div>
          </div>

          {subscription && (
            <div className="text-right">
              <p className="text-slate-300 text-sm">Montant mensuel</p>
              <p className="text-3xl font-bold">{subscription.totalMonthly.toFixed(2)}€</p>
              {subscription.nextBillingDate && (
                <p className="text-slate-400 text-sm mt-1">
                  Prochain prélèvement : {new Date(subscription.nextBillingDate).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { 
            title: "Mon abonnement", 
            desc: "Gérer mes licences", 
            href: "/espace-client/abonnement", 
            icon: CreditCard,
            color: "bg-blue-50 text-blue-600 border-blue-200"
          },
          { 
            title: "Documents", 
            desc: "Factures et contrats", 
            href: "/espace-client/documents", 
            icon: FileText,
            color: "bg-purple-50 text-purple-600 border-purple-200"
          },
          { 
            title: "Support", 
            desc: "Créer un ticket", 
            href: "/espace-client/support", 
            icon: HelpCircle,
            color: "bg-green-50 text-green-600 border-green-200"
          },
        ].map((action, index) => (
          <motion.div
            key={action.title}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link
              href={action.href}
              className={`block p-6 rounded-2xl border ${action.color} hover:shadow-md transition-all group`}
            >
              <action.icon className="w-8 h-8 mb-4" />
              <h3 className="font-heading font-bold text-slate-900">{action.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{action.desc}</p>
              <ArrowRight className="w-4 h-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Current Subscription Details */}
      {subscription && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Vos services actifs
            </h2>
            {(() => {
              const status = getStatusBadge(subscription.status);
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  <status.icon className="w-3 h-3" />
                  {status.label}
                </span>
              );
            })()}
          </div>

          <div className="divide-y divide-slate-100">
            {subscription.items.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyrelis-mint/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-cyrelis-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{item.offer.name}</h3>
                    <p className="text-sm text-slate-500">
                      {item.quantity} licence{item.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {(item.unitPrice * item.quantity).toFixed(2)}€<span className="text-slate-500">/mois</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.unitPrice.toFixed(2)}€ × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <Link href="/espace-client/abonnement">
              <Button className="w-full md:w-auto bg-cyrelis-blue text-white hover:bg-slate-800 rounded-xl">
                Modifier mon abonnement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* No subscription CTA */}
      {!subscription && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-cyrelis-mint/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-cyrelis-blue" />
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
            Pas encore protégé ?
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Configurez votre abonnement Cyrélis en quelques clics et sécurisez votre activité dès maintenant.
          </p>
          <Link href="/simulateur">
            <Button className="bg-cyrelis-mint text-cyrelis-blue hover:bg-teal-400 rounded-xl font-bold">
              Configurer mon offre
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}


