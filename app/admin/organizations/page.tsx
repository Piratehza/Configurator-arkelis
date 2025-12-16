"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Building2,
  Users,
  ChevronRight,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string;
  name: string;
  slug: string;
  siret: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  activeOffer: string;
  offerStatus: string;
  createdAt: string;
  _count: {
    users: number;
  };
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newOrg, setNewOrg] = useState({
    name: "",
    siret: "",
    address: "",
    city: "",
    postalCode: "",
    contactEmail: "",
    contactPhone: "",
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.siret?.includes(search) ||
      org.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrg),
      });

      if (response.ok) {
        const created = await response.json();
        setOrganizations((prev) => [...prev, { ...created, _count: { users: 0 } }]);
        setShowCreateModal(false);
        setNewOrg({
          name: "",
          siret: "",
          address: "",
          city: "",
          postalCode: "",
          contactEmail: "",
          contactPhone: "",
        });
      } else {
        const data = await response.json();
        setCreateError(data.error || "Erreur lors de la création");
      }
    } catch {
      setCreateError("Une erreur est survenue");
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Actif
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" /> En attente
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" /> Suspendu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Aucune offre
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Organisations
          </h1>
          <p className="text-slate-600 mt-1">
            Gérez les entreprises clientes • {organizations.length} organisation
            {organizations.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-cyrelis-blue hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle organisation
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Actives</p>
          <p className="text-2xl font-bold text-green-600">
            {organizations.filter((o) => o.offerStatus === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">En attente</p>
          <p className="text-2xl font-bold text-amber-600">
            {organizations.filter((o) => o.offerStatus === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Utilisateurs totaux</p>
          <p className="text-2xl font-bold text-cyrelis-blue">
            {organizations.reduce((sum, o) => sum + o._count.users, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, SIRET, ville..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyrelis-blue" />
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-2">Aucune organisation trouvée</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outline"
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une organisation
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-cyrelis-mint transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyrelis-blue/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-cyrelis-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-cyrelis-blue transition-colors">
                      {org.name}
                    </h3>
                    {org.siret && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {org.siret}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(org.offerStatus)}
              </div>

              {/* Infos */}
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                {org.city && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {org.postalCode} {org.city}
                  </p>
                )}
                {org.contactEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {org.contactEmail}
                  </p>
                )}
                {org.contactPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {org.contactPhone}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>
                    {org._count.users} utilisateur{org._count.users > 1 ? "s" : ""}
                  </span>
                </div>
                <Link href={`/admin/organizations/${org.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyrelis-blue hover:bg-cyrelis-mint/10"
                  >
                    Voir <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !creating && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyrelis-blue/10">
                    <Building2 className="w-5 h-5 text-cyrelis-blue" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    Nouvelle organisation
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              )}

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrg.name}
                    onChange={(e) =>
                      setNewOrg((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ma Société SAS"
                    required
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">SIRET</label>
                    <input
                      type="text"
                      value={newOrg.siret}
                      onChange={(e) =>
                        setNewOrg((prev) => ({ ...prev, siret: e.target.value }))
                      }
                      placeholder="12345678901234"
                      maxLength={14}
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Téléphone</label>
                    <input
                      type="tel"
                      value={newOrg.contactPhone}
                      onChange={(e) =>
                        setNewOrg((prev) => ({ ...prev, contactPhone: e.target.value }))
                      }
                      placeholder="01 23 45 67 89"
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Email de contact</label>
                  <input
                    type="email"
                    value={newOrg.contactEmail}
                    onChange={(e) =>
                      setNewOrg((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    placeholder="contact@entreprise.fr"
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Adresse</label>
                  <input
                    type="text"
                    value={newOrg.address}
                    onChange={(e) =>
                      setNewOrg((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="123 rue de la Paix"
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Code postal</label>
                    <input
                      type="text"
                      value={newOrg.postalCode}
                      onChange={(e) =>
                        setNewOrg((prev) => ({ ...prev, postalCode: e.target.value }))
                      }
                      placeholder="75001"
                      maxLength={5}
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Ville</label>
                    <input
                      type="text"
                      value={newOrg.city}
                      onChange={(e) =>
                        setNewOrg((prev) => ({ ...prev, city: e.target.value }))
                      }
                      placeholder="Paris"
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-cyrelis-blue hover:bg-slate-800"
                    disabled={creating}
                  >
                    {creating ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Création...
                      </span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer l'organisation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

