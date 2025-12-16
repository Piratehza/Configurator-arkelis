"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  Shield, 
  Mail, 
  User, 
  Bell,
  Palette,
  Database,
  Lock,
  Globe,
  Save,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-600 mt-1">Configurez votre plateforme Cyrélis</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-100">
            <User className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Profil Administrateur</h2>
            <p className="text-sm text-slate-500">Vos informations de compte</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-100">
          <div className="h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-lg">{session?.user?.name || "Administrateur"}</p>
            <p className="text-slate-600">{session?.user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium mt-2">
              <Shield className="w-3 h-3" />
              Administrateur
            </span>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">Configurez vos alertes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Nouveaux clients</p>
                <p className="text-sm text-slate-500">Recevoir un email à chaque inscription</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyrelis-blue" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Nouveaux abonnements</p>
                <p className="text-sm text-slate-500">Être notifié des nouvelles souscriptions</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyrelis-blue" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Tickets support</p>
                <p className="text-sm text-slate-500">Alertes pour les nouveaux tickets</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyrelis-blue" />
          </div>
        </div>
      </motion.div>

      {/* Platform Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Plateforme</h2>
            <p className="text-sm text-slate-500">Configuration générale</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-green-500" />
              <p className="font-medium text-slate-900">Base de données</p>
            </div>
            <p className="text-sm text-green-600 font-medium">● Connectée (Supabase)</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-green-500" />
              <p className="font-medium text-slate-900">Authentification</p>
            </div>
            <p className="text-sm text-green-600 font-medium">● NextAuth.js actif</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-yellow-500" />
              <p className="font-medium text-slate-900">Emails (Resend)</p>
            </div>
            <p className="text-sm text-yellow-600 font-medium">○ À configurer</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Palette className="w-5 h-5 text-cyrelis-blue" />
              <p className="font-medium text-slate-900">Thème</p>
            </div>
            <p className="text-sm text-cyrelis-blue font-medium">Cyrélis (Mint & Navy)</p>
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-100">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Sécurité</h2>
            <p className="text-sm text-slate-500">Paramètres de sécurité avancés</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <div>
              <p className="font-medium text-slate-900">Sessions JWT sécurisées</p>
              <p className="text-sm text-slate-500">Expiration après 30 jours d'inactivité</p>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <div>
              <p className="font-medium text-slate-900">Mots de passe hashés (bcrypt)</p>
              <p className="text-sm text-slate-500">Stockage sécurisé des credentials</p>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <div>
              <p className="font-medium text-slate-900">Logs d'audit</p>
              <p className="text-sm text-slate-500">Toutes les actions sont tracées</p>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Authentification 2FA</p>
              <p className="text-sm text-slate-500">Double authentification (prochainement)</p>
            </div>
            <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded-full">Bientôt</span>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleSave}
          className="bg-cyrelis-blue hover:bg-slate-800 text-white rounded-xl px-6"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Sauvegardé !
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

