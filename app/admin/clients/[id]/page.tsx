"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Euro,
  Trash2,
  AlertTriangle,
  X,
  Edit3,
  Save,
  Clock,
  Shield,
  ShieldOff,
  RotateCcw,
  Fingerprint,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscription {
  id: string;
  status: string;
  totalMonthly: number;
  startDate: string;
  items: {
    id: string;
    quantity: number;
    offer: {
      name: string;
      description: string | null;
    };
  }[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  issueDate: string;
  dueDate: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface Passkey {
  id: string;
  deviceName: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

interface Client {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  siret: string | null;
  address: string | null;
  createdAt: string;
  twoFactorEnabled: boolean;
  passkeys?: Passkey[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  tickets: Ticket[];
}

interface Stats {
  totalSpent: { _sum: { total: number | null } };
  activeSubscriptions: number;
  openTickets: number;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetting2FA, setResetting2FA] = useState(false);
  const [resettingPasskeys, setResettingPasskeys] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    siret: "",
    address: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/admin/clients/${clientId}`);
        if (response.ok) {
          const data = await response.json();
          setClient(data.client);
          setStats(data.stats);
          setFormData({
            name: data.client.name || "",
            email: data.client.email || "",
            phone: data.client.phone || "",
            company: data.client.company || "",
            siret: data.client.siret || "",
            address: data.client.address || "",
          });
        } else {
          router.push("/admin/clients");
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        router.push("/admin/clients");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setClient(prev => prev ? { ...prev, ...data.client } : null);
        setEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/clients");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const handleReset2FA = async () => {
    if (!confirm("Êtes-vous sûr de vouloir réinitialiser la 2FA de ce client ? Il devra la reconfigurer.")) {
      return;
    }
    
    setResetting2FA(true);
    try {
      const response = await fetch(`/api/admin/users/${clientId}/reset-2fa`, {
        method: "POST",
      });

      if (response.ok) {
        alert("2FA réinitialisée avec succès");
        // Mettre à jour l'état local
        setClient(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la réinitialisation");
      }
    } catch (error) {
      console.error("Error resetting 2FA:", error);
      alert("Erreur lors de la réinitialisation");
    } finally {
      setResetting2FA(false);
    }
  };

  const handleResetPasskeys = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer toutes les passkeys de ce client ? Il devra les reconfigurer.")) {
      return;
    }
    
    setResettingPasskeys(true);
    try {
      const response = await fetch(`/api/admin/users/${clientId}/reset-passkeys`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Passkeys réinitialisées avec succès");
        // Mettre à jour l'état local
        setClient(prev => prev ? { ...prev, passkeys: [] } : null);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la réinitialisation");
      }
    } catch (error) {
      console.error("Error resetting passkeys:", error);
      alert("Erreur lors de la réinitialisation");
    } finally {
      setResettingPasskeys(false);
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    EXPIRED: "bg-slate-100 text-slate-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrelis-blue" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Client non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/clients">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyrelis-blue flex items-center justify-center text-white font-bold text-2xl">
              {client.name?.[0] || client.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                {client.name || "Sans nom"}
              </h1>
              <p className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {client.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-cyrelis-blue"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total dépensé</p>
          <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
            <Euro className="w-5 h-5" />
            {stats?.totalSpent._sum.total?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Abonnements actifs</p>
          <p className="text-2xl font-bold text-green-600">
            {stats?.activeSubscriptions || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Tickets ouverts</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats?.openTickets || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Client depuis</p>
          <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(client.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Infos client */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
            Informations
          </h2>
          
          <div className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SIRET</label>
                  <input
                    type="text"
                    value={formData.siret}
                    onChange={e => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                  />
                </div>
              </>
            ) : (
              <>
                {client.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {client.phone}
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {client.company}
                    {client.siret && <span className="text-xs text-slate-400">({client.siret})</span>}
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="whitespace-pre-line">{client.address}</span>
                  </div>
                )}
                {!client.phone && !client.company && !client.address && (
                  <p className="text-sm text-slate-400 italic">
                    Aucune information supplémentaire
                  </p>
                )}
              </>
            )}
          </div>

          {/* Section 2FA */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {client.twoFactorEnabled ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-700">2FA activée</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-sm text-amber-700">2FA désactivée</span>
                  </>
                )}
              </div>
              {client.twoFactorEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset2FA}
                  disabled={resetting2FA}
                  className="text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <RotateCcw className={`w-4 h-4 mr-1 ${resetting2FA ? "animate-spin" : ""}`} />
                  {resetting2FA ? "Reset..." : "Reset 2FA"}
                </Button>
              )}
            </div>
          </div>

          {/* Section Passkeys */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              Passkeys
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {client.passkeys && client.passkeys.length > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-700">
                      {client.passkeys.length} passkey{client.passkeys.length > 1 ? "s" : ""} enregistrée{client.passkeys.length > 1 ? "s" : ""}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <span className="text-sm text-slate-500">Aucune passkey</span>
                  </>
                )}
              </div>
              {client.passkeys && client.passkeys.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetPasskeys}
                  disabled={resettingPasskeys}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className={`w-4 h-4 mr-1 ${resettingPasskeys ? "animate-spin" : ""}`} />
                  {resettingPasskeys ? "Suppression..." : "Supprimer passkeys"}
                </Button>
              )}
            </div>
            {/* Liste des passkeys */}
            {client.passkeys && client.passkeys.length > 0 && (
              <div className="mt-3 space-y-2">
                {client.passkeys.map((passkey) => (
                  <div key={passkey.id} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                    <Smartphone className="w-3 h-3" />
                    <span className="font-medium">{passkey.deviceName || "Appareil sans nom"}</span>
                    <span className="text-slate-400">•</span>
                    <span>Ajoutée le {new Date(passkey.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Abonnements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyrelis-blue" />
              Abonnements
            </h2>
          </div>

          {client.subscriptions.length > 0 ? (
            <div className="space-y-3">
              {client.subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status] || "bg-slate-100 text-slate-600"}`}>
                      {sub.status}
                    </span>
                    <span className="font-bold text-slate-900">
                      {sub.totalMonthly.toFixed(2)}€/mois
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {sub.items.map((item) => (
                      <p key={item.id}>
                        {item.quantity}x {item.offer.name}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Depuis le {new Date(sub.startDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Aucun abonnement</p>
          )}
        </motion.div>

        {/* Factures + Tickets */}
        <div className="space-y-6">
          {/* Factures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200"
          >
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-cyrelis-blue" />
              Dernières factures
            </h2>

            {client.invoices.length > 0 ? (
              <div className="space-y-2">
                {client.invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        #{invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(invoice.issueDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{invoice.total.toFixed(2)}€</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[invoice.status] || "bg-slate-100 text-slate-600"}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Aucune facture</p>
            )}
          </motion.div>

          {/* Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-slate-200"
          >
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-cyrelis-blue" />
              Tickets support
            </h2>

            {client.tickets.length > 0 ? (
              <div className="space-y-2">
                {client.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status] || "bg-slate-100 text-slate-600"}`}>
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Aucun ticket</p>
            )}
          </motion.div>
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
                    Supprimer ce client ?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cette action est irréversible
                  </p>
                </div>
                <button
                  onClick={() => setDeleteModal(false)}
                  disabled={deleting}
                  className="ml-auto p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Toutes les données de <strong>{client.name || client.email}</strong> seront supprimées définitivement.
              </p>

              <div className="flex gap-3">
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
                  disabled={deleting}
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

