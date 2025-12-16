"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronRight,
  Users,
  Building2,
  Mail,
  Trash2,
  AlertTriangle,
  X,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  createdAt: string;
  organization: Organization | null;
  subscriptions: {
    status: string;
    totalMonthly: number;
  }[];
  _count: {
    invoices: number;
    tickets: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [orgFilter, setOrgFilter] = useState<string>("");
  
  // Modal de suppression
  const [deleteModal, setDeleteModal] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Charger les organisations pour le filtre
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch("/api/admin/organizations");
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data);
        }
      } catch (err) {
        console.error("Erreur chargement organisations:", err);
      }
    }
    fetchOrganizations();
  }, []);

  const fetchClients = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (orgFilter) params.set("organizationId", orgFilter);

      const response = await fetch(`/api/admin/clients?${params}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, orgFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/clients/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Retirer le client de la liste
        setClients(prev => prev.filter(c => c.id !== deleteModal.id));
        setDeleteModal(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-600 mt-1">
            Gérez vos clients et leurs abonnements • {pagination?.total || 0} client{(pagination?.total || 0) > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/organizations">
            <Button variant="outline" size="sm">
              <Building2 className="w-4 h-4 mr-2" />
              Organisations ({organizations.length})
            </Button>
          </Link>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            {clients.filter(c => c.subscriptions.some(s => s.status === "ACTIVE")).length} actifs
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
            {clients.filter(c => !c.subscriptions.some(s => s.status === "ACTIVE")).length} inactifs
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, email, entreprise..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
              />
            </div>
          </form>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint bg-white"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Abonnement actif</option>
              <option value="inactive">Sans abonnement</option>
            </select>
          </div>

          {/* Organization filter */}
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint bg-white min-w-[180px]"
            >
              <option value="">Toutes les organisations</option>
              <option value="none">Sans organisation</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyrelis-blue" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-20 text-center">
            <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">Aucun client trouvé</p>
            <p className="text-sm text-slate-400">Les clients s'inscrivent via le site public</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Entreprise</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">MRR</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-slate-600">Inscrit le</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => {
                  const activeSubscription = client.subscriptions.find(s => s.status === "ACTIVE");
                  const totalMRR = client.subscriptions.reduce((sum, s) => sum + (s.totalMonthly || 0), 0);

                  return (
                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyrelis-blue flex items-center justify-center text-white font-bold text-sm">
                            {client.name?.[0] || client.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{client.name || "Sans nom"}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {client.organization ? (
                          <Link 
                            href={`/admin/organizations/${client.organization.id}`}
                            className="flex items-center gap-2 text-slate-700 hover:text-cyrelis-blue transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {client.organization.name}
                          </Link>
                        ) : client.company ? (
                          <span className="flex items-center gap-2 text-slate-500 text-sm">
                            <Building2 className="w-4 h-4 text-slate-300" />
                            {client.company}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {activeSubscription ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-slate-900">{totalMRR.toFixed(2)}€</span>
                        <span className="text-slate-500">/mois</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500">
                        {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/clients/${client.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-cyrelis-blue">
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteModal(client)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} clients)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchClients(pagination.page - 1)}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchClients(pagination.page + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Supprimer ce client ?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cette action est irréversible
                  </p>
                </div>
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="ml-auto p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyrelis-blue flex items-center justify-center text-white font-bold">
                    {deleteModal.name?.[0] || deleteModal.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{deleteModal.name || "Sans nom"}</p>
                    <p className="text-sm text-slate-500">{deleteModal.email}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Toutes les données associées seront supprimées : abonnements, factures, tickets de support, documents...
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Suppression...
                    </span>
                  ) : (
                    "Supprimer définitivement"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
