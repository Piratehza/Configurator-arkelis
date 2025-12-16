"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Users,
  Mail,
  Trash2,
  AlertTriangle,
  X,
  Shield,
  User,
  Calendar,
  UserCog,
  Check,
  UserPlus,
  Building2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CLIENT" | "PROSPECT";
  company: string | null;
  createdAt: string;
  _count?: {
    subscriptions: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  
  // Modals
  const [deleteModal, setDeleteModal] = useState<UserData | null>(null);
  const [roleModal, setRoleModal] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
        setDeleteModal(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (newRole: "ADMIN" | "CLIENT") => {
    if (!roleModal) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${roleModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === roleModal.id ? { ...u, role: newRole } : u
        ));
        setRoleModal(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const roleColors = {
    ADMIN: "bg-amber-100 text-amber-700 border-amber-200",
    CLIENT: "bg-green-100 text-green-700 border-green-200",
    PROSPECT: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const roleIcons = {
    ADMIN: Shield,
    CLIENT: User,
    PROSPECT: User,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-600 mt-1">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {users.filter(u => u.role === "ADMIN").length}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              {users.filter(u => u.role === "CLIENT").length} clients
            </span>
          </div>
          <Link href="/admin/users/create">
            <Button className="bg-cyrelis-blue hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-cyrelis-blue/20">
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel Onboarding
            </Button>
          </Link>
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
                placeholder="Rechercher par nom, email..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
              />
            </div>
          </form>

          {/* Role filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint bg-white"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Administrateurs</option>
              <option value="CLIENT">Clients</option>
              <option value="PROSPECT">Prospects</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyrelis-blue" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Utilisateur</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Rôle</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-slate-600">Inscrit le</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const RoleIcon = roleIcons[user.role];
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            user.role === "ADMIN" ? "bg-amber-500" : "bg-cyrelis-blue"
                          }`}>
                            {user.name?.[0] || user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name || "Sans nom"}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role === "ADMIN" ? "Admin" : user.role === "CLIENT" ? "Client" : "Prospect"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-500 flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-600 hover:text-cyrelis-blue"
                            onClick={() => setRoleModal(user)}
                          >
                            <UserCog className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteModal(user)}
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
                    Supprimer cet utilisateur ?
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    deleteModal.role === "ADMIN" ? "bg-amber-500" : "bg-cyrelis-blue"
                  }`}>
                    {deleteModal.name?.[0] || deleteModal.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{deleteModal.name || "Sans nom"}</p>
                    <p className="text-sm text-slate-500">{deleteModal.email}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${roleColors[deleteModal.role]}`}>
                      {deleteModal.role}
                    </span>
                  </div>
                </div>
              </div>

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
                  {deleting ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Change Modal */}
      <AnimatePresence>
        {roleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !updating && setRoleModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Modifier le rôle
                  </h3>
                  <p className="text-sm text-slate-500">
                    {roleModal.name || roleModal.email}
                  </p>
                </div>
                <button
                  onClick={() => setRoleModal(null)}
                  disabled={updating}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleRoleChange("ADMIN")}
                  disabled={updating || roleModal.role === "ADMIN"}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    roleModal.role === "ADMIN" 
                      ? "border-amber-500 bg-amber-50" 
                      : "border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">Administrateur</p>
                      <p className="text-xs text-slate-500">Accès complet à la plateforme</p>
                    </div>
                  </div>
                  {roleModal.role === "ADMIN" && (
                    <Check className="w-5 h-5 text-amber-600" />
                  )}
                </button>

                <button
                  onClick={() => handleRoleChange("CLIENT")}
                  disabled={updating || roleModal.role === "CLIENT"}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    roleModal.role === "CLIENT" 
                      ? "border-green-500 bg-green-50" 
                      : "border-slate-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">Client</p>
                      <p className="text-xs text-slate-500">Accès à l'espace client uniquement</p>
                    </div>
                  </div>
                  {roleModal.role === "CLIENT" && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              </div>

              {updating && (
                <div className="flex items-center justify-center mt-4 text-sm text-slate-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyrelis-blue mr-2" />
                  Mise à jour...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

