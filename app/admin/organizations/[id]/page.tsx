"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Hash,
  Edit2,
  Save,
  X,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  userType: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  subscriptions: {
    status: string;
    totalMonthly: number;
  }[];
}

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
  users: User[];
  _count: {
    users: number;
  };
}

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    siret: "",
    address: "",
    city: "",
    postalCode: "",
    contactEmail: "",
    contactPhone: "",
    offerStatus: "",
  });

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/admin/organizations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
        setEditData({
          name: data.name || "",
          siret: data.siret || "",
          address: data.address || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          offerStatus: data.offerStatus || "PENDING",
        });
      } else {
        router.push("/admin/organizations");
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
      router.push("/admin/organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrganization((prev) =>
          prev ? { ...prev, ...updated } : null
        );
        setEditing(false);
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/organizations");
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
        setDeleteModal(false);
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4" /> Actif
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" /> En attente
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-4 h-4" /> Suspendu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
            Aucune offre
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyrelis-blue" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Organisation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/organizations">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              {organization.name}
            </h1>
            {getStatusBadge(organization.offerStatus)}
          </div>
          <p className="text-slate-600 mt-1">
            {organization._count.users} utilisateur
            {organization._count.users > 1 ? "s" : ""} • Créée le{" "}
            {new Date(organization.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-cyrelis-blue"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    Enregistrement...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                className="text-red-500 hover:bg-red-50"
                onClick={() => setDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-cyrelis-blue/10 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-cyrelis-blue" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Informations</h2>
                <p className="text-sm text-slate-500">Détails de l'organisation</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nom</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">SIRET</label>
                  <input
                    type="text"
                    value={editData.siret}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, siret: e.target.value }))
                    }
                    maxLength={14}
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={editData.contactEmail}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Téléphone</label>
                  <input
                    type="tel"
                    value={editData.contactPhone}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, contactPhone: e.target.value }))
                    }
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Adresse</label>
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">CP</label>
                    <input
                      type="text"
                      value={editData.postalCode}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, postalCode: e.target.value }))
                      }
                      maxLength={5}
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Ville</label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Statut</label>
                  <select
                    value={editData.offerStatus}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, offerStatus: e.target.value }))
                    }
                    className="w-full mt-1 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="ACTIVE">Actif</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {organization.siret && (
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{organization.siret}</span>
                  </div>
                )}
                {organization.contactEmail && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a
                      href={`mailto:${organization.contactEmail}`}
                      className="text-cyrelis-blue hover:underline"
                    >
                      {organization.contactEmail}
                    </a>
                  </div>
                )}
                {organization.contactPhone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a
                      href={`tel:${organization.contactPhone}`}
                      className="text-slate-600 hover:text-cyrelis-blue"
                    >
                      {organization.contactPhone}
                    </a>
                  </div>
                )}
                {(organization.address || organization.city) && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="text-slate-600">
                      {organization.address && <p>{organization.address}</p>}
                      {(organization.postalCode || organization.city) && (
                        <p>
                          {organization.postalCode} {organization.city}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {!organization.siret &&
                  !organization.contactEmail &&
                  !organization.contactPhone &&
                  !organization.address && (
                    <p className="text-sm text-slate-400 italic">
                      Aucune information renseignée
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-cyrelis-blue" />
                <h2 className="font-semibold text-slate-900">Utilisateurs</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-sm">
                  {organization.users.length}
                </span>
              </div>
              <Link href={`/admin/users/create?org=${organization.id}`}>
                <Button size="sm" className="bg-cyrelis-blue">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </Link>
            </div>

            {organization.users.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">Aucun utilisateur</p>
                <p className="text-sm text-slate-400">
                  Ajoutez des utilisateurs à cette organisation
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                        Utilisateur
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                        Type
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                        2FA
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                        Inscrit le
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {organization.users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-cyrelis-blue flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {user.name || "Sans nom"}
                              </p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.userType === "INTERNAL" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
                              <Shield className="w-3 h-3" /> Interne
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-cyrelis-mint/20 text-cyrelis-blue">
                              <Users className="w-3 h-3" /> Client
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.twoFactorEnabled ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                              <CheckCircle className="w-4 h-4" /> Activée
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Non</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/clients/${user.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Supprimer cette organisation ?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cette action est irréversible
                  </p>
                </div>
              </div>

              {organization._count.users > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Cette organisation contient {organization._count.users} utilisateur
                    {organization._count.users > 1 ? "s" : ""}. Vous devez d'abord les
                    supprimer ou les réassigner.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteModal(false)}
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={deleting || organization._count.users > 0}
                >
                  {deleting ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

