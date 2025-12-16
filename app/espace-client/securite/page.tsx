"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, Shield, QrCode, Copy, AlertTriangle, Fingerprint, Smartphone, Trash2, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";

export default function ClientSecurityPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<"password" | "2fa" | "passkeys">("password");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Sécurité du compte</h1>
        <p className="text-slate-600 mt-1">Gérez vos méthodes d&apos;authentification</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "password"
              ? "bg-cyrelis-blue text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Key className="w-4 h-4" />
          Mot de passe
        </button>
        <button
          onClick={() => setActiveTab("2fa")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "2fa"
              ? "bg-cyrelis-blue text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Shield className="w-4 h-4" />
          2FA
          {session?.user?.twoFactorEnabled && (
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("passkeys")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "passkeys"
              ? "bg-cyrelis-blue text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          Passkeys
        </button>
      </div>

      {activeTab === "password" && <PasswordSection />}
      {activeTab === "2fa" && <TwoFactorSection session={session} update={update} />}
      {activeTab === "passkeys" && <PasskeysSection />}
    </div>
  );
}

// Section Mot de passe
function PasswordSection() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string) => {
    const rules = [
      { test: password.length >= 8, label: "Au moins 8 caractères" },
      { test: /[A-Z]/.test(password), label: "Une majuscule" },
      { test: /[a-z]/.test(password), label: "Une minuscule" },
      { test: /[0-9]/.test(password), label: "Un chiffre" },
      { test: /[^A-Za-z0-9]/.test(password), label: "Un caractère spécial" },
    ];
    return rules;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }

    const rules = validatePassword(formData.newPassword);
    const failedRules = rules.filter((r) => !r.test);
    if (failedRules.length > 0) {
      setMessage({
        type: "error",
        text: `Le mot de passe doit contenir : ${failedRules.map((r) => r.label.toLowerCase()).join(", ")}`,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du changement de mot de passe");
      }

      setMessage({ type: "success", text: "Mot de passe modifié avec succès" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erreur lors du changement",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(formData.newPassword);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyrelis-blue/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-cyrelis-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Changer le mot de passe</h2>
            <p className="text-sm text-slate-500">Mettez à jour votre mot de passe régulièrement</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Mot de passe actuel */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("current")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("new")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Indicateur de force */}
          {formData.newPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordRules.filter((r) => r.test).length >= level
                        ? "bg-green-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {passwordRules.map((rule, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1 ${
                      rule.test ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    {rule.test ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-300" />
                    )}
                    {rule.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyrelis-mint transition-all ${
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-cyrelis-blue"
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirm")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          className="w-full py-3 px-4 bg-cyrelis-blue text-white font-semibold rounded-xl hover:bg-cyrelis-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Modification...
            </>
          ) : (
            "Modifier le mot de passe"
          )}
        </button>
      </form>
    </div>
  );
}

// Section 2FA
function TwoFactorSection({ session, update }: { session: any; update: any }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"initial" | "setup">("initial");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const is2FAEnabled = session?.user?.twoFactorEnabled;

  const handleSetup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/two-factor/setup", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la configuration");
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      if (data.backupCodes) {
        setRecoveryCodes(data.backupCodes);
      }
      setStep("setup");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur lors de la configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Code invalide");
      }

      if (recoveryCodes.length > 0) {
        setShowRecoveryCodes(true);
      }

      await update({ twoFactorEnabled: true });
      setStep("initial");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver la 2FA ? Votre compte sera moins protégé.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/two-factor/disable", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la désactivation");
      }

      await update({ twoFactorEnabled: false });
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur lors de la désactivation");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback pour HTTP ou contextes non sécurisés
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      alert("Copié dans le presse-papiers !");
    } catch (err) {
      console.error("Erreur copie:", err);
      alert("Impossible de copier. Sélectionnez et copiez manuellement.");
    }
  };

  return (
    <>
      {/* Statut actuel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                is2FAEnabled ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              <Shield className={`w-6 h-6 ${is2FAEnabled ? "text-green-600" : "text-amber-600"}`} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                {is2FAEnabled ? "2FA activée" : "2FA désactivée"}
              </h2>
              <p className="text-sm text-slate-500">
                {is2FAEnabled
                  ? "Votre compte est protégé par l'authentification à deux facteurs"
                  : "Ajoutez une couche de sécurité supplémentaire à votre compte"}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                is2FAEnabled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {is2FAEnabled ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Codes de récupération */}
      {showRecoveryCodes && recoveryCodes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Codes de récupération</h3>
              <p className="text-sm text-amber-700 mt-1">
                Sauvegardez ces codes en lieu sûr. Ils vous permettront de récupérer l&apos;accès à
                votre compte si vous perdez votre appareil.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-200">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code, i) => (
                <div key={i} className="font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg">
                  {code}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => copyToClipboard(recoveryCodes.join("\n"))}
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800"
            >
              <Copy className="w-4 h-4" /> Copier tous les codes
            </button>
            <button
              onClick={() => setShowRecoveryCodes(false)}
              className="text-sm text-amber-700 hover:text-amber-800"
            >
              J&apos;ai sauvegardé mes codes
            </button>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {step === "initial" && (
          <div className="p-6">
            {is2FAEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    L&apos;authentification à deux facteurs est activée
                  </span>
                </div>
                <button
                  onClick={handleDisable}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Désactivation..." : "Désactiver la 2FA"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyrelis-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-cyrelis-blue" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Configurez l&apos;authentification à deux facteurs
                  </h3>
                  <p className="text-sm text-slate-600">
                    Utilisez une application comme Google Authenticator ou Bitwarden pour sécuriser
                    votre compte.
                  </p>
                </div>
                <button
                  onClick={handleSetup}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-cyrelis-blue text-white font-semibold rounded-xl hover:bg-cyrelis-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Configuration...
                    </>
                  ) : (
                    "Configurer la 2FA"
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "setup" && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-slate-900 mb-4">
                Scannez ce QR code avec votre application
              </h3>
              {qrCode && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block">
                  <Image src={qrCode} alt="QR Code 2FA" width={200} height={200} className="mx-auto" />
                </div>
              )}
            </div>

            {secret && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-2">Ou entrez ce code manuellement :</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm">
                    {showSecret ? secret : "••••••••••••••••"}
                  </code>
                  <button onClick={() => setShowSecret(!showSecret)} className="p-2 hover:bg-slate-200 rounded-lg">
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button onClick={() => copyToClipboard(secret)} className="p-2 hover:bg-slate-200 rounded-lg">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Entrez le code de vérification
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("initial")}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 py-3 px-4 bg-cyrelis-blue text-white font-semibold rounded-xl hover:bg-cyrelis-blue/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Activer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// Section Passkeys (WebAuthn)
// ============================================

interface PasskeyData {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

function PasskeysSection() {
  const [passkeys, setPasskeys] = useState<PasskeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Vérifier le support WebAuthn
    setIsSupported(browserSupportsWebAuthn());
    fetchPasskeys();
  }, []);

  const fetchPasskeys = async () => {
    try {
      const response = await fetch("/api/auth/passkeys");
      const data = await response.json();
      if (response.ok) {
        setPasskeys(data.passkeys || []);
      }
    } catch (err) {
      console.error("Erreur chargement passkeys:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!deviceName.trim()) {
      setError("Veuillez donner un nom à cet appareil");
      return;
    }

    setRegistering(true);
    setError("");
    setSuccess("");

    try {
      // 1. Obtenir les options d'enregistrement
      const optionsResponse = await fetch("/api/auth/passkeys/register");
      const data = await optionsResponse.json();

      if (!optionsResponse.ok) {
        throw new Error(data.error || "Erreur lors de la préparation");
      }

      console.log("[Passkey] Options reçues:", data);

      const registrationOptions = data.options;
      const challenge = data.challenge;

      if (!registrationOptions) {
        throw new Error("Options d'enregistrement manquantes");
      }

      // 2. Créer la passkey via le navigateur
      const credential = await startRegistration(registrationOptions);

      // 3. Envoyer au serveur pour vérification
      const verifyResponse = await fetch("/api/auth/passkeys/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: credential,
          challenge,
          deviceName: deviceName.trim(),
        }),
      });

      const result = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(result.error || "Erreur lors de l'enregistrement");
      }

      setSuccess("Passkey enregistrée avec succès !");
      setDeviceName("");
      setShowRegister(false);
      fetchPasskeys();
    } catch (err: any) {
      console.error("Erreur enregistrement passkey:", err);
      if (err.name === "NotAllowedError") {
        setError("Opération annulée ou non autorisée");
      } else if (err.name === "InvalidStateError") {
        setError("Cette passkey existe déjà");
      } else {
        setError(err.message || "Erreur lors de l'enregistrement");
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async (passkeyId: string, deviceName: string | null) => {
    if (!confirm(`Supprimer la passkey "${deviceName || "Sans nom"}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/passkeys?id=${passkeyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setSuccess("Passkey supprimée");
      fetchPasskeys();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Jamais";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isSupported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Passkeys non supportées</h3>
            <p className="text-sm text-amber-700 mt-1">
              Votre navigateur ne supporte pas les Passkeys (WebAuthn). 
              Utilisez un navigateur moderne comme Chrome, Safari ou Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Passkeys */}
      <div className="bg-gradient-to-br from-cyrelis-blue/5 to-cyrelis-mint/5 border border-cyrelis-blue/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-cyrelis-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Fingerprint className="w-6 h-6 text-cyrelis-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Connexion sans mot de passe</h3>
            <p className="text-sm text-slate-600 mt-1">
              Les Passkeys utilisent la biométrie de votre appareil (Touch ID, Face ID, Windows Hello) 
              pour vous connecter de façon ultra-sécurisée, sans mot de passe.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Liste des Passkeys */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyrelis-blue/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-cyrelis-blue" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Vos appareils</h2>
              <p className="text-sm text-slate-500">{passkeys.length} passkey{passkeys.length !== 1 ? "s" : ""} enregistrée{passkeys.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyrelis-blue text-white font-medium rounded-lg hover:bg-cyrelis-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-cyrelis-blue animate-spin mx-auto" />
            <p className="text-slate-500 mt-2">Chargement...</p>
          </div>
        ) : passkeys.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Aucune passkey enregistrée</p>
            <p className="text-sm text-slate-500 mt-1">
              Ajoutez une passkey pour vous connecter sans mot de passe
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {passkeys.map((passkey) => (
              <div key={passkey.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {passkey.deviceType === "platform" ? (
                      <Fingerprint className="w-5 h-5 text-slate-600" />
                    ) : (
                      <Key className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{passkey.deviceName || "Appareil sans nom"}</p>
                    <p className="text-xs text-slate-500">
                      Ajoutée le {formatDate(passkey.createdAt)}
                      {passkey.lastUsedAt && ` • Dernière utilisation: ${formatDate(passkey.lastUsedAt)}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(passkey.id, passkey.deviceName)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer cette passkey"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'enregistrement */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-cyrelis-blue/10 rounded-xl flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-cyrelis-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Nouvelle Passkey</h3>
                <p className="text-sm text-slate-500">Enregistrez cet appareil</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom de l&apos;appareil
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="ex: MacBook Pro, iPhone 15..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue"
                  disabled={registering}
                />
              </div>

              <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                💡 Votre appareil vous demandera de confirmer avec Touch ID, Face ID ou votre code PIN.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRegister(false);
                    setDeviceName("");
                    setError("");
                  }}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  disabled={registering}
                >
                  Annuler
                </button>
                <button
                  onClick={handleRegister}
                  disabled={registering || !deviceName.trim()}
                  className="flex-1 py-3 px-4 bg-cyrelis-blue text-white font-semibold rounded-xl hover:bg-cyrelis-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Créer la Passkey"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
