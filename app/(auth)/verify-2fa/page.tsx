"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, Lock, AlertCircle, ArrowRight, LogOut, Clock } from "lucide-react";
import Link from "next/link";

export default function Verify2FAPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { data: session, update } = useSession();

  // Vérifier si un token de confiance existe
  useEffect(() => {
    const checkTrustToken = async () => {
      // Récupérer le cookie 2fa_trust_token
      const cookies = document.cookie.split(';');
      const trustCookie = cookies.find(c => c.trim().startsWith('2fa_trust_token='));
      
      if (trustCookie) {
        const trustToken = trustCookie.split('=')[1];
        
        try {
          const response = await fetch("/api/auth/two-factor/check-trust", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trustToken }),
          });

          const data = await response.json();

          if (data.trusted) {
            console.log('[2FA] Appareil de confiance reconnu, bypass 2FA');
            // Mettre à jour la session et rediriger
            await update({ twoFactorVerified: true });
            const redirectUrl = session?.user?.role === "ADMIN" ? "/admin" : "/espace-client";
            router.push(redirectUrl);
            router.refresh();
            return;
          }
        } catch (error) {
          console.error('[2FA] Erreur vérification trust token:', error);
        }
      }

      // Si pas de token valide, focus sur le premier input
      inputRefs.current[0]?.focus();
    };

    if (session?.user?.id) {
      checkTrustToken();
    }
  }, [session, router, update]);

  const handleChange = (index: number, value: string) => {
    // Permettre seulement les chiffres
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Prendre seulement le dernier chiffre
    setCode(newCode);
    setError("");

    // Auto-focus sur l'input suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si tous les champs sont remplis
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value.slice(-1)].join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Gestion du backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Gestion des flèches
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newCode = pastedData.split("");
      while (newCode.length < 6) newCode.push("");
      setCode(newCode);
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join("");
    if (codeToVerify.length !== 6) {
      setError("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/two-factor/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: codeToVerify,
          rememberDevice: rememberDevice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Code invalide");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      // Si "Se souvenir" est coché et qu'on reçoit un token, le stocker dans un cookie
      if (data.rememberToken) {
        // Stocker le token dans un cookie sécurisé (3 jours)
        const expires = new Date();
        expires.setDate(expires.getDate() + 3);
        document.cookie = `2fa_trust_token=${data.rememberToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
      }

      // Mettre à jour la session pour marquer 2FA comme vérifié
      await update({ twoFactorVerified: true });

      // Rediriger vers la bonne destination
      const redirectUrl = session?.user?.role === "ADMIN" ? "/admin" : "/espace-client";
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyrelis-mint/5 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyrelis-mint/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyrelis-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cyrelis-blue rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-cyrelis-blue font-heading">Cyrélis</span>
          </Link>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyrelis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-cyrelis-blue" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading mb-2">
              Vérification 2FA
            </h1>
            <p className="text-slate-600">
              Entrez le code à 6 chiffres de votre application d&apos;authentification
            </p>
          </div>

          {/* Inputs du code */}
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className={`
                  w-12 h-14 text-center text-2xl font-bold
                  border-2 rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-cyrelis-blue
                  disabled:bg-slate-50 disabled:cursor-not-allowed
                  ${digit ? "border-cyrelis-blue bg-cyrelis-blue/5" : "border-slate-200 bg-white"}
                  ${error ? "border-red-300 shake" : ""}
                `}
              />
            ))}
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Checkbox "Se souvenir" */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all ${
                rememberDevice 
                  ? "bg-cyrelis-blue border-cyrelis-blue" 
                  : "border-slate-300 group-hover:border-cyrelis-blue/50"
              }`}>
                {rememberDevice && (
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Se souvenir de cet appareil pendant 3 jours</span>
            </div>
          </label>

          {/* Bouton de validation */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || code.join("").length !== 6}
            className={`
              w-full py-3.5 px-4 rounded-xl font-semibold
              flex items-center justify-center gap-2
              transition-all duration-200
              ${loading || code.join("").length !== 6
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-cyrelis-blue text-white hover:bg-cyrelis-blue/90 shadow-lg shadow-cyrelis-blue/20"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                Valider <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Lien d'aide */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Vous n&apos;avez plus accès à votre application ?</p>
            <Link href="/forgot-password" className="text-cyrelis-blue hover:underline font-medium">
              Utiliser un code de récupération
            </Link>
          </div>

          {/* Bouton de déconnexion */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: window.location.origin + "/login" })}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter et changer de compte
            </button>
          </div>
        </div>

        {/* Info sécurité */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Connexion sécurisée avec authentification à deux facteurs
          </p>
        </div>
      </div>

      {/* Animation shake pour erreur */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

