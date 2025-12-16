"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Building2,
  UserPlus,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Shield,
  Users,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string;
  name: string;
  _count: {
    users: number;
  };
}

function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOrgId = searchParams.get("org");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "CLIENT" as "INTERNAL" | "CLIENT",
    organizationId: preselectedOrgId || "",
  });
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{email: string; password: string; userType: string; organization?: string} | null>(null);
  const [copied, setCopied] = useState(false);

  // Charger les organisations existantes
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch("/api/admin/organizations");
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data);
          // Si une organisation est présélectionnée via l'URL
          if (preselectedOrgId) {
            setFormData(prev => ({ ...prev, organizationId: preselectedOrgId }));
          }
        }
      } catch (err) {
        console.error("Erreur chargement organisations:", err);
      } finally {
        setLoadingOrgs(false);
      }
    }
    fetchOrganizations();
  }, [preselectedOrgId]);

  // Génération de mot de passe sécurisé
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation : un client doit avoir une organisation
    if (formData.userType === "CLIENT" && !formData.organizationId) {
      setError("Veuillez sélectionner une organisation pour ce client");
      setIsLoading(false);
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      };

      if (formData.userType === "CLIENT" && formData.organizationId) {
        payload.organizationId = formData.organizationId;
      }

      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la création");
        setIsLoading(false);
        return;
      }

      // Succès
      setSuccess({
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        organization: organizations.find(o => o.id === formData.organizationId)?.name,
      });
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (success) {
      const typeLabel = success.userType === "INTERNAL" ? "Votre compte équipe Cyrélis" : "Votre compte Cyrélis";
      const text = `Bonjour,\n\n${typeLabel} a été créé.\n\nEmail: ${success.email}\nMot de passe provisoire: ${success.password}\n\nConnectez-vous sur: ${window.location.origin}/login\n${success.userType === "INTERNAL" ? "\n⚠️ L'activation de la 2FA sera requise à la première connexion.\n" : ""}\nCordialement,\nL'équipe Cyrélis`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setSuccess(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      userType: "CLIENT",
      organizationId: preselectedOrgId || "",
    });
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg border border-slate-200 p-8 text-center"
        >
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 ${
            success.userType === "INTERNAL" ? "bg-amber-100" : "bg-green-100"
          }`}>
            <Check className={`w-8 h-8 ${success.userType === "INTERNAL" ? "text-amber-600" : "text-green-600"}`} />
          </div>
          
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
            {success.userType === "INTERNAL" ? "Membre interne créé !" : "Client créé avec succès !"}
          </h1>
          <p className="text-slate-600 mb-6">
            Voici les identifiants à transmettre
          </p>

          {/* Type badge */}
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium ${
              success.userType === "INTERNAL" 
                ? "bg-amber-100 text-amber-700" 
                : "bg-cyrelis-mint/20 text-cyrelis-blue"
            }`}>
              {success.userType === "INTERNAL" ? (
                <><Shield className="w-4 h-4" /> Équipe Cyrélis</>
              ) : (
                <><Users className="w-4 h-4" /> Client</>
              )}
            </span>
          </div>

          {/* Credentials box */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-4">
              {success.organization && (
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Organisation</label>
                  <p className="text-lg text-slate-900">{success.organization}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                <p className="text-lg font-mono text-slate-900">{success.email}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Mot de passe provisoire</label>
                <p className="text-lg font-mono text-slate-900 bg-amber-100 px-3 py-1 rounded inline-block">
                  {success.password}
                </p>
              </div>
            </div>

            {success.userType === "INTERNAL" && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  L'authentification 2FA sera requise après la première connexion
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={copyCredentials}
              variant="outline"
              className="flex-1"
            >
              {copied ? (
                <><Check className="w-4 h-4 mr-2 text-green-600" /> Copié !</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copier le message</>
              )}
            </Button>
            <Button
              onClick={() => router.push("/admin/users")}
              className="flex-1 bg-cyrelis-blue"
            >
              Voir les utilisateurs
            </Button>
          </div>

          <Button variant="ghost" onClick={resetForm} className="mt-4 text-slate-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Créer un autre compte
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Nouvel Utilisateur
          </h1>
          <p className="text-slate-600">
            Créez un compte client ou membre interne
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-slate-200 p-8"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'utilisateur */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Type d'utilisateur</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: "CLIENT" }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.userType === "CLIENT"
                    ? "border-cyrelis-mint bg-cyrelis-mint/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Users className={`w-5 h-5 mb-2 ${formData.userType === "CLIENT" ? "text-cyrelis-blue" : "text-slate-400"}`} />
                <p className="font-medium text-slate-900">Client</p>
                <p className="text-xs text-slate-500">Entreprise cliente</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: "INTERNAL" }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.userType === "INTERNAL"
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Shield className={`w-5 h-5 mb-2 ${formData.userType === "INTERNAL" ? "text-amber-600" : "text-slate-400"}`} />
                <p className="font-medium text-slate-900">Interne</p>
                <p className="text-xs text-slate-500">Équipe Cyrélis</p>
              </button>
            </div>
            {formData.userType === "INTERNAL" && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <Shield className="w-3 h-3" />
                La 2FA sera obligatoire pour ce compte
              </p>
            )}
          </div>

          {/* Organisation (seulement pour les clients) */}
          {formData.userType === "CLIENT" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organisation <span className="text-red-500">*</span>
              </label>
              {loadingOrgs ? (
                <div className="flex items-center gap-2 text-slate-500 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement des organisations...
                </div>
              ) : organizations.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 mb-3">
                    Aucune organisation existante. Créez-en une d'abord.
                  </p>
                  <Link href="/admin/organizations">
                    <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                      <Building2 className="w-4 h-4 mr-2" />
                      Créer une organisation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={formData.organizationId}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationId: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionner une organisation</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org._count.users} utilisateur{org._count.users > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>
          )}

          {/* Nom */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Jean Dupont"
                required
                className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jean@entreprise.com"
                required
                className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Mot de passe provisoire <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mot de passe temporaire"
                required
                minLength={8}
                className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-28 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={generatePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Générer
              </button>
            </div>
            <p className="text-xs text-slate-500">
              L'utilisateur pourra changer ce mot de passe après sa première connexion
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Link href="/admin/users" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || loadingOrgs || (formData.userType === "CLIENT" && organizations.length === 0)}
              className={`flex-1 ${formData.userType === "INTERNAL" ? "bg-amber-500 hover:bg-amber-600" : "bg-cyrelis-blue hover:bg-slate-800"}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Créer le compte
                </span>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function CreateUserFormFallback() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyrelis-blue animate-spin" />
      </div>
    </div>
  );
}

export default function CreateUserPage() {
  return (
    <Suspense fallback={<CreateUserFormFallback />}>
      <CreateUserForm />
    </Suspense>
  );
}
