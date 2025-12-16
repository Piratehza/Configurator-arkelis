"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SetupData {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export default function SecurityPage() {
  const { data: session, update: updateSession } = useSession();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [step, setStep] = useState<"idle" | "setup" | "verify" | "disable">("idle");
  const [isInternal, setIsInternal] = useState(false);

  // Charger le statut 2FA
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setIs2FAEnabled(data?.user?.twoFactorEnabled || false);
          setIsInternal(data?.user?.userType === "INTERNAL");
        }
      } catch (err) {
        console.error("Erreur chargement statut 2FA:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkStatus();
  }, []);

  // Démarrer la configuration 2FA
  const startSetup = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/two-factor/setup");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la configuration");
        return;
      }

      setSetupData(data);
      setStep("setup");
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier le code TOTP
  const verifyTOTP = async () => {
    if (verifyCode.length !== 6) {
      setError("Le code doit contenir 6 chiffres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code invalide");
        return;
      }

      setSuccess("2FA activée avec succès !");
      setIs2FAEnabled(true);
      setStep("verify"); // Afficher les codes de secours
      await updateSession();
    } catch (err) {
      setError("Erreur de vérification");
    } finally {
      setIsLoading(false);
    }
  };

  // Désactiver la 2FA
  const disable2FA = async () => {
    if (disableCode.length !== 6) {
      setError("Le code doit contenir 6 chiffres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/two-factor/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: disableCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code invalide");
        return;
      }

      setSuccess("2FA désactivée");
      setIs2FAEnabled(false);
      setStep("idle");
      setDisableCode("");
      await updateSession();
    } catch (err) {
      setError("Erreur lors de la désactivation");
    } finally {
      setIsLoading(false);
    }
  };

  // Copier les codes de secours
  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join("\n"));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const resetState = () => {
    setStep("idle");
    setSetupData(null);
    setVerifyCode("");
    setError("");
    setSuccess("");
  };

  if (isLoading && step === "idle") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyrelis-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/espace-client">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Sécurité du compte
          </h1>
          <p className="text-slate-600">
            Gérez l'authentification à deux facteurs
          </p>
        </div>
      </div>

      {/* Alertes */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </motion.div>
      )}

      {/* Statut 2FA */}
      {step === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${is2FAEnabled ? "bg-green-100" : "bg-slate-100"}`}>
              <Shield className={`w-6 h-6 ${is2FAEnabled ? "text-green-600" : "text-slate-600"}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-heading font-semibold text-slate-900">
                  Authentification à deux facteurs (2FA)
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  is2FAEnabled 
                    ? "bg-green-100 text-green-700" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {is2FAEnabled ? "Activée" : "Désactivée"}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                {is2FAEnabled 
                  ? "Votre compte est protégé par une authentification à deux facteurs." 
                  : "Ajoutez une couche de sécurité supplémentaire à votre compte avec Google Authenticator ou une application compatible."}
              </p>

              {isInternal && !is2FAEnabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    La 2FA est obligatoire pour les comptes internes Cyrélis
                  </p>
                </div>
              )}

              {is2FAEnabled ? (
                <Button
                  variant="outline"
                  onClick={() => setStep("disable")}
                  disabled={isInternal}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Désactiver la 2FA
                </Button>
              ) : (
                <Button onClick={startSetup} className="bg-cyrelis-blue">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Configurer la 2FA
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Setup 2FA - Étape 1: Scanner QR */}
      {step === "setup" && setupData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-cyrelis-blue/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-cyrelis-blue" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-slate-900 mb-2">
              Scanner le QR Code
            </h2>
            <p className="text-sm text-slate-600">
              Scannez ce code avec Google Authenticator ou une application compatible
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-slate-200 rounded-lg">
              <img 
                src={setupData.qrCode} 
                alt="QR Code 2FA" 
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Secret manuel */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-500 mb-2 text-center">
              Ou entrez ce code manuellement :
            </p>
            <p className="font-mono text-sm text-center text-slate-900 select-all break-all">
              {setupData.secret}
            </p>
          </div>

          {/* Vérification */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Entrez le code à 6 chiffres de l'application
              </label>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-cyrelis-mint"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetState} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={verifyTOTP}
                disabled={verifyCode.length !== 6 || isLoading}
                className="flex-1 bg-cyrelis-blue"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Vérifier et activer
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Codes de secours après activation */}
      {step === "verify" && setupData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-slate-900 mb-2">
              2FA Activée !
            </h2>
            <p className="text-sm text-slate-600">
              Conservez ces codes de secours dans un endroit sûr
            </p>
          </div>

          {/* Codes de secours */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-amber-800 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Codes de secours
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="text-amber-700"
              >
                {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {showBackupCodes ? (
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, i) => (
                  <code key={i} className="text-sm font-mono text-amber-900 bg-amber-100 px-2 py-1 rounded">
                    {code}
                  </code>
                ))}
              </div>
            ) : (
              <p className="text-sm text-amber-700">
                Cliquez sur l'œil pour afficher les codes
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={copyBackupCodes}
              className="flex-1"
            >
              {copiedCodes ? (
                <><Check className="w-4 h-4 mr-2 text-green-600" /> Copié !</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copier les codes</>
              )}
            </Button>
            <Button onClick={resetState} className="flex-1 bg-cyrelis-blue">
              Terminé
            </Button>
          </div>
        </motion.div>
      )}

      {/* Désactiver 2FA */}
      {step === "disable" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-slate-900 mb-2">
              Désactiver la 2FA
            </h2>
            <p className="text-sm text-slate-600">
              Entrez un code de votre application pour confirmer
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full border border-slate-200 rounded-lg py-3 px-4 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-300"
              maxLength={6}
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetState} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={disable2FA}
                disabled={disableCode.length !== 6 || isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Désactiver"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info supplémentaire */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Applications recommandées
        </h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Google Authenticator (iOS / Android)</li>
          <li>• Microsoft Authenticator</li>
          <li>• Authy</li>
          <li>• 1Password</li>
        </ul>
      </div>
    </div>
  );
}

