"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff, 
  Shuffle,
  BookOpen,
  Shield,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

interface Credential {
  id: number;
  folder: string;
  name: string;
  login_uri: string;
  login_username: string;
  login_password: string;
  showPassword: boolean;
}

export default function CollecteDonneesPage() {
  const [credentials, setCredentials] = useState<Credential[]>([
    { id: 1, folder: "", name: "", login_uri: "", login_username: "", login_password: "", showPassword: false }
  ]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const generatePassword = (length = 16) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return password;
  };

  const addCredential = () => {
    const newId = Math.max(0, ...credentials.map(c => c.id)) + 1;
    setCredentials([...credentials, { 
      id: newId, 
      folder: "", 
      name: "", 
      login_uri: "", 
      login_username: "", 
      login_password: "",
      showPassword: false 
    }]);
  };

  const removeCredential = (id: number) => {
    setCredentials(credentials.filter(c => c.id !== id));
  };

  const updateCredential = (id: number, field: keyof Credential, value: string | boolean) => {
    setCredentials(credentials.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const clearAll = () => {
    if (credentials.length === 0) return;
    if (confirm("⚠️ Effacer tous les identifiants ?\n\nCette action est irréversible.")) {
      setCredentials([]);
      showToast("🗑️ Tout a été effacé");
    }
  };

  const escapeCSV = (text: string) => {
    if (!text) return "";
    if (text.includes('"') || text.includes(",") || text.includes("\n")) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  };

  const exportCSV = () => {
    if (credentials.length === 0) {
      showToast("⚠️ Ajoutez au moins un identifiant");
      return;
    }

    const valid = credentials.filter(c => c.name && c.name.trim());
    if (valid.length === 0) {
      showToast("⚠️ Donnez un nom à vos identifiants");
      return;
    }

    const headers = ["folder", "favorite", "type", "name", "notes", "fields", "login_uri", "login_username", "login_password", "login_totp"];
    let csv = headers.join(",") + "\n";

    for (const cred of credentials) {
      const row = [
        escapeCSV(cred.folder),
        "0",
        "login",
        escapeCSV(cred.name),
        "",
        "",
        escapeCSV(cred.login_uri),
        escapeCSV(cred.login_username),
        escapeCSV(cred.login_password),
        ""
      ];
      csv += row.join(",") + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bitwarden_import.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("✅ Fichier téléchargé !");
    setTimeout(() => setShowSecurityWarning(true), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Cyrélis<span className="text-cyrelis-mint">.</span>
            </h1>
            <p className="text-slate-400 text-lg">Générateur d'identifiants pour Bitwarden</p>
            
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-cyrelis-mint/10 border border-cyrelis-mint/30 text-cyrelis-mint text-sm font-medium hover:bg-cyrelis-mint/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Comment ça marche ?
            </button>
          </div>
        </div>

        {/* Tutorial */}
        {showTutorial && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 animate-in slide-in-from-top-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🚀 Guide rapide
            </h2>
            <div className="space-y-5">
              {[
                { title: "Remplissez vos identifiants", desc: "Ajoutez vos comptes : nom du service, URL, identifiant et mot de passe." },
                { title: "Téléchargez le fichier CSV", desc: "Cliquez sur « Exporter pour Bitwarden » pour télécharger le fichier." },
                { title: "Importez dans Bitwarden", desc: "Bitwarden → Outils → Importer des données → Format : Bitwarden (csv)" },
                { title: "⚠️ Supprimez le fichier CSV !", desc: "TRÈS IMPORTANT : Supprimez définitivement le fichier après l'import !" },
                { title: "C'est terminé !", desc: "Vos identifiants sont maintenant dans votre coffre-fort Bitwarden. 🎉" },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-cyrelis-mint text-slate-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 pb-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🔐 Vos identifiants
            </h2>
            <span className="px-3 py-1.5 bg-cyrelis-mint/10 text-cyrelis-mint text-sm font-medium rounded-full">
              {credentials.length} entrée{credentials.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Credentials List */}
          <div className="space-y-4 mb-6">
            {credentials.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-3 opacity-50">🔑</div>
                <p>Aucun identifiant pour l'instant</p>
              </div>
            ) : (
              credentials.map((cred) => (
                <div key={cred.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-cyrelis-mint/30 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-cyrelis-mint to-teal-500 rounded-lg flex items-center justify-center">
                        🔐
                      </div>
                      <span className={`font-medium ${cred.name ? "text-white" : "text-slate-500 italic"}`}>
                        {cred.name || "Sans titre"}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeCredential(cred.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                        Nom du service
                      </label>
                      <input
                        type="text"
                        value={cred.name}
                        onChange={(e) => updateCredential(cred.id, "name", e.target.value)}
                        placeholder="Ex: Gmail, Netflix..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyrelis-mint focus:ring-1 focus:ring-cyrelis-mint/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                        Dossier (optionnel)
                      </label>
                      <input
                        type="text"
                        value={cred.folder}
                        onChange={(e) => updateCredential(cred.id, "folder", e.target.value)}
                        placeholder="Ex: Travail, Perso..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyrelis-mint focus:ring-1 focus:ring-cyrelis-mint/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                        URL du site
                      </label>
                      <input
                        type="url"
                        value={cred.login_uri}
                        onChange={(e) => updateCredential(cred.id, "login_uri", e.target.value)}
                        placeholder="https://accounts.google.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyrelis-mint focus:ring-1 focus:ring-cyrelis-mint/20"
                      />
                      <p className="text-xs text-slate-600 mt-1">
                        ⚠️ Copiez l'URL de la <strong>page de connexion</strong>, pas la page d'accueil.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                        Identifiant / Email
                      </label>
                      <input
                        type="text"
                        value={cred.login_username}
                        onChange={(e) => updateCredential(cred.id, "login_username", e.target.value)}
                        placeholder="mon@email.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyrelis-mint focus:ring-1 focus:ring-cyrelis-mint/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={cred.showPassword ? "text" : "password"}
                          value={cred.login_password}
                          onChange={(e) => updateCredential(cred.id, "login_password", e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 pr-20 text-white text-sm focus:outline-none focus:border-cyrelis-mint focus:ring-1 focus:ring-cyrelis-mint/20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button
                            onClick={() => updateCredential(cred.id, "showPassword", !cred.showPassword)}
                            className="p-1.5 bg-slate-700 text-slate-400 rounded hover:bg-cyrelis-mint hover:text-slate-900 transition-colors"
                            title="Afficher"
                          >
                            {cred.showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              updateCredential(cred.id, "login_password", generatePassword());
                              updateCredential(cred.id, "showPassword", true);
                              showToast("🎲 Mot de passe généré !");
                            }}
                            className="p-1.5 bg-slate-700 text-slate-400 rounded hover:bg-cyrelis-mint hover:text-slate-900 transition-colors"
                            title="Générer"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addCredential}
              className="inline-flex items-center px-5 py-3 bg-slate-800 border border-slate-600 text-slate-200 rounded-xl font-medium hover:bg-slate-700 hover:border-slate-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center px-5 py-3 bg-transparent border border-rose-500/50 text-rose-400 rounded-xl font-medium hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout effacer
            </button>
            <button
              onClick={exportCSV}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-cyrelis-mint to-teal-500 text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter pour Bitwarden
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-sm mb-3">
            <Shield className="w-4 h-4" />
            Aucune donnée stockée
          </div>
          <p className="text-slate-500 text-sm">
            Vos identifiants restent en mémoire et disparaissent à la fermeture de la page.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-cyrelis-mint text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}

      {/* Security Warning Modal */}
      {showSecurityWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl p-8 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-rose-400 mb-3">Rappel de sécurité important</h3>
            <p className="text-white mb-4">
              Le fichier <strong>bitwarden_import.csv</strong> contient tous vos mots de passe <strong>en clair</strong>.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Après avoir importé vos identifiants dans Bitwarden :<br />
              <strong className="text-rose-400">Supprimez définitivement ce fichier</strong><br />
              (Corbeille → Vider la corbeille)
            </p>
            <button
              onClick={() => setShowSecurityWarning(false)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyrelis-mint to-teal-500 text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

