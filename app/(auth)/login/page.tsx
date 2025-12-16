"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, Shield, KeyRound, Loader2, Fingerprint } from "lucide-react";
import { browserSupportsWebAuthn, startAuthentication } from "@simplewebauthn/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/espace-client";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);

  useEffect(() => {
    setPasskeySupported(browserSupportsWebAuthn());
  }, []);

  // Connexion via Passkey
  const handlePasskeyLogin = async () => {
    setIsPasskeyLoading(true);
    setError("");

    try {
      // 1. Obtenir les options d'authentification
      const optionsRes = await fetch("/api/auth/passkeys/authenticate");
      const { options, challenge } = await optionsRes.json();

      if (!optionsRes.ok) {
        throw new Error("Erreur lors de la préparation");
      }

      // 2. Démarrer l'authentification WebAuthn
      const credential = await startAuthentication(options);

      // 3. Vérifier sur le serveur
      const verifyRes = await fetch("/api/auth/passkeys/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: credential, challenge }),
      });

      const result = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(result.error || "Authentification échouée");
      }

      // 4. Connexion réussie - créer la session NextAuth
      const signInResult = await signIn("credentials", {
        email: result.user.email,
        password: "__PASSKEY_AUTH__", // Token spécial pour l'auth passkey
        redirect: false,
      });

      // Note: L'auth via passkey nécessite une intégration plus poussée avec NextAuth
      // Pour l'instant, on redirige vers le dashboard avec les infos
      if (result.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    } catch (err: any) {
      console.error("Erreur passkey:", err);
      if (err.name === "NotAllowedError") {
        setError("Authentification annulée");
      } else {
        setError(err.message || "Erreur lors de la connexion via Passkey");
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Récupérer la session pour connaître le rôle
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      // Redirection conditionnelle basée sur le rôle
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md"
    >
      {/* Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-cyrelis-blue flex items-center justify-center">
              <Shield className="h-6 w-6 text-cyrelis-mint" strokeWidth={1.5} />
            </div>
            <span className="font-heading text-2xl font-semibold text-white group-hover:text-cyrelis-mint transition-colors">
              Cyrélis
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-semibold text-white mb-2">
            Connexion
          </h1>
          <p className="text-slate-400 text-sm">
            Accédez à votre espace sécurisé
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" strokeWidth={1.5} />
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Passkey Login */}
        {passkeySupported && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={isPasskeyLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3 px-4 font-semibold hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasskeyLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" strokeWidth={1.5} />
                  Se connecter avec Passkey
                </>
              )}
            </button>
            
            {/* Séparateur */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" strokeWidth={1.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full bg-slate-900/50 border border-slate-700 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-cyrelis-mint hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" strokeWidth={1.5} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/50 border border-slate-700 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-cyrelis-mint text-cyrelis-blue font-semibold hover:bg-white transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Connexion...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Se connecter <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </span>
            )}
          </Button>
        </form>

        {/* Info Invite-Only */}
        <div className="bg-slate-900/50 border border-slate-700 p-4 mt-6">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-cyrelis-mint flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-white font-medium">Accès sur invitation</p>
              <p className="text-xs text-slate-400">
                Contactez-nous pour obtenir vos identifiants
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-4 text-center">
          <a
            href="mailto:contact@cyrelis.fr"
            className="text-xs text-cyrelis-mint hover:underline"
          >
            contact@cyrelis.fr
          </a>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="w-4 h-4 text-cyrelis-mint" strokeWidth={1.5} />
        <span>Connexion sécurisée TLS</span>
      </div>
    </motion.div>
  );
}

function LoginFormFallback() {
  return (
    <div className="relative w-full max-w-md">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyrelis-mint animate-spin" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyrelis-blue/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyrelis-mint/10 blur-3xl" />

      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
