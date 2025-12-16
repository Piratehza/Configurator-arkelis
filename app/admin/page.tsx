"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  ArrowUpRight,
  Activity,
  Euro,
  Building2,
  UserPlus,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  pendingInvoices: number;
  openTickets: number;
  monthlyRevenue: number;
}

interface Client {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  createdAt: string;
  subscriptions: { 
    status: string;
    totalMonthly: number;
  }[];
}

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
  user: { name: string | null; email: string } | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentClients: Client[];
  recentActivities: AuditLog[];
}

const statCards = [
  { key: "totalClients", label: "Entreprises clientes", icon: Building2, color: "bg-blue-500", href: "/admin/clients" },
  { key: "activeSubscriptions", label: "Abonnements actifs", icon: CreditCard, color: "bg-green-500", href: "/admin/subscriptions" },
  { key: "pendingInvoices", label: "Factures en attente", icon: FileText, color: "bg-orange-500", href: "/admin/invoices" },
  { key: "openTickets", label: "Tickets ouverts", icon: MessageSquare, color: "bg-purple-500", href: "/admin/tickets" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getStatusConfig = (subscriptions: Client["subscriptions"]) => {
  const hasActive = subscriptions.some(s => s.status === "ACTIVE");
  const hasPending = subscriptions.some(s => s.status === "PENDING");
  
  if (hasActive) return { label: "Actif", color: "bg-green-100 text-green-700", icon: CheckCircle2 };
  if (hasPending) return { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
  return { label: "Inactif", color: "bg-slate-100 text-slate-600", icon: XCircle };
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrelis-blue" />
      </div>
    );
  }

  const formatAction = (action: string) => {
    const actions: Record<string, string> = {
      USER_LOGIN: "Connexion",
      USER_CREATED: "Compte créé",
      USER_CREATED_BY_ADMIN: "Client onboardé",
      OFFER_CREATED: "Offre créée",
      OFFER_UPDATED: "Offre modifiée",
      SUBSCRIPTION_CREATED: "Abonnement créé",
      LICENSE_ADDED: "Licences ajoutées",
      CLIENT_UPDATED: "Client modifié",
      USER_ROLE_CHANGED: "Rôle modifié",
      USER_DELETED: "Utilisateur supprimé",
    };
    return actions[action] || action;
  };

  return (
    <div className="space-y-8">
      {/* Header avec CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Vue MSP</h1>
          <p className="text-slate-600 mt-1">Tableau de bord de pilotage Cyrélis</p>
        </div>
        <Link href="/admin/users/create">
          <Button className="bg-cyrelis-blue hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-cyrelis-blue/20">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel Onboarding
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link href={stat.href} key={stat.key}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyrelis-blue transition-colors" />
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {data?.stats[stat.key as keyof DashboardStats] || 0}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Revenue Card */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-cyrelis-blue to-slate-800 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-sm font-medium">Revenu mensuel récurrent (MRR)</p>
            <p className="text-4xl font-bold mt-2 flex items-center gap-2">
              <Euro className="w-8 h-8" />
              {data?.stats.monthlyRevenue?.toFixed(2) || "0.00"}
            </p>
            <p className="text-cyrelis-mint text-sm mt-2">
              Basé sur {data?.stats.activeSubscriptions || 0} abonnements actifs
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-24 h-24 text-white/10" />
          </div>
        </div>
      </motion.div>

      {/* Liste des clients (Vue MSP) */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Clients (Entreprises)</h2>
            <p className="text-sm text-slate-500">Vue d'ensemble de votre portefeuille</p>
          </div>
          <Link href="/admin/clients" className="text-sm text-cyrelis-blue hover:underline flex items-center gap-1">
            Voir tout <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        {data?.recentClients?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entreprise</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">MRR</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentClients.map((client) => {
                  const statusConfig = getStatusConfig(client.subscriptions);
                  const totalMRR = client.subscriptions.reduce((sum, s) => sum + (s.totalMonthly || 0), 0);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyrelis-blue flex items-center justify-center text-white font-bold text-sm">
                            {(client.company || client.name)?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{client.company || "Sans entreprise"}</p>
                            <p className="text-xs text-slate-500">
                              Client depuis {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{client.name || "N/A"}</p>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900">{totalMRR.toFixed(2)}€</span>
                        <span className="text-slate-500 text-sm">/mois</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/clients/${client.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-cyrelis-blue" title="Voir le détail">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/api/auth/impersonate/${client.id}`}>
                            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Se connecter en tant que ce client">
                              <Users className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucun client pour le moment</p>
            <Link href="/admin/users/create">
              <Button className="bg-cyrelis-blue hover:bg-slate-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Onboarder votre premier client
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Activité récente */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-heading text-lg font-bold text-slate-900">Activité récente</h2>
        </div>
        <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
          {data?.recentActivities?.length ? (
            data.recentActivities.map((log) => (
              <div key={log.id} className="p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-cyrelis-mint flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{formatAction(log.action)}</span>
                    {" "}sur {log.entity}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    par {log.user?.name || log.user?.email || "Système"} • {new Date(log.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-slate-500">Aucune activité récente</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
