"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Send, 
  RefreshCw,
  Server,
  Key,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailConfig {
  configured: boolean;
  connectionOk: boolean;
  mode: "resend" | "smtp" | "none";
  config: {
    resendConfigured: boolean;
    resendKey: string | null;
    host: string;
    port: string;
    user: string | null;
    passwordSet: boolean;
    fromEmail: string;
    fromName: string;
    adminEmail: string;
  };
}

export default function EmailSettingsPage() {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/test-email");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: "error", text: "Entre une adresse email" });
      return;
    }

    setTesting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: `✅ Email envoyé à ${testEmail}` });
      } else {
        setMessage({ type: "error", text: data.error || "Échec de l'envoi" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-cyrelis-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Configuration Email</h1>
        <p className="text-slate-600 mt-1">Paramètres SMTP pour l&apos;envoi d&apos;emails</p>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        <div className={`p-6 ${config?.connectionOk ? "bg-green-50" : config?.configured ? "bg-amber-50" : "bg-red-50"}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              config?.connectionOk ? "bg-green-100" : config?.configured ? "bg-amber-100" : "bg-red-100"
            }`}>
              {config?.connectionOk ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : config?.configured ? (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {config?.connectionOk 
                  ? "SMTP Connecté ✅" 
                  : config?.configured 
                    ? "Configuration présente mais connexion échouée"
                    : "SMTP Non configuré"
                }
              </h2>
              <p className="text-sm text-slate-600">
                {config?.connectionOk 
                  ? "Les emails peuvent être envoyés"
                  : config?.configured
                    ? "Vérifie le mot de passe d'application Google"
                    : "Ajoute les variables SMTP dans .env"
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchConfig}
              className="ml-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Config Details */}
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Configuration actuelle
            {config?.mode && (
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                config.mode === "resend" ? "bg-purple-100 text-purple-700" : 
                config.mode === "smtp" ? "bg-blue-100 text-blue-700" : 
                "bg-slate-100 text-slate-700"
              }`}>
                {config.mode === "resend" ? "Resend API" : config.mode === "smtp" ? "SMTP" : "Non configuré"}
              </span>
            )}
          </h3>
          
          {config?.mode === "resend" ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs text-purple-600 mb-1">Clé API Resend</p>
                <p className="font-mono text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-700">{config?.config.resendKey}</span>
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Expéditeur</p>
                <p className="font-mono text-sm">
                  {config?.config.fromName} &lt;{config?.config.fromEmail}&gt;
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Serveur SMTP</p>
                <p className="font-mono text-sm">{config?.config.host}:{config?.config.port}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Utilisateur</p>
                <p className="font-mono text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {config?.config.user || <span className="text-red-500">Non défini</span>}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Mot de passe</p>
                <p className="font-mono text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-400" />
                  {config?.config.passwordSet 
                    ? <span className="text-green-600">••••••••</span>
                    : <span className="text-red-500">Non défini</span>
                  }
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Expéditeur</p>
                <p className="font-mono text-sm">
                  {config?.config.fromName} &lt;{config?.config.fromEmail}&gt;
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Email notifications admin</p>
            <p className="font-mono text-sm">{config?.config.adminEmail}</p>
          </div>
        </div>
      </motion.div>

      {/* Test Email */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-cyrelis-blue" />
          Tester l&apos;envoi
        </h3>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="ton@email.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
          />
          <Button
            onClick={handleTestEmail}
            disabled={testing || !config?.connectionOk}
            className="bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 rounded-xl"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un test
              </>
            )}
          </Button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {!config?.connectionOk && (
          <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-800 font-medium mb-2">💡 Configuration recommandée : Resend</p>
            <p className="text-sm text-purple-700 mb-3">
              Google Workspace ne supporte plus les mots de passe d&apos;application depuis mai 2025. 
              Utilise <strong>Resend</strong> (gratuit jusqu&apos;à 100 emails/jour).
            </p>
            <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside mb-3">
              <li>Crée un compte sur <a href="https://resend.com" target="_blank" rel="noopener" className="underline font-medium">resend.com</a></li>
              <li>Ajoute et vérifie ton domaine (cyrelis.fr)</li>
              <li>Crée une clé API dans Settings → API Keys</li>
              <li>Ajoute dans ton fichier <code className="bg-purple-100 px-1 rounded">.env</code> :</li>
            </ol>
            <pre className="p-3 bg-slate-900 text-green-400 rounded-lg text-xs overflow-x-auto">
{`# Resend (recommandé)
RESEND_API_KEY=re_xxxxxxxxxx

# Configuration commune
EMAIL_FROM=noreply@cyrelis.fr
EMAIL_FROM_NAME=Cyrélis
ADMIN_NOTIFICATION_EMAIL=contact@cyrelis.fr`}
            </pre>
            
            <details className="mt-4">
              <summary className="text-sm text-slate-600 cursor-pointer hover:text-slate-800">
                Alternative : SMTP classique (serveur compatible)
              </summary>
              <pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded-lg text-xs overflow-x-auto">
{`# SMTP (si tu as un serveur SMTP compatible)
SMTP_HOST=smtp.ton-serveur.com
SMTP_PORT=587
SMTP_USER=user@tondomaine.com
SMTP_PASSWORD=mot-de-passe
SMTP_FROM_NAME=Cyrélis
ADMIN_NOTIFICATION_EMAIL=contact@tondomaine.com`}
              </pre>
            </details>
          </div>
        )}
      </motion.div>
    </div>
  );
}

