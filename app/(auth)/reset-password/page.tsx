"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Check, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenData, setTokenData] = useState<{ valid: boolean; email?: string; name?: string } | null>(null);

  // Vérifier le token
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError("Lien invalide");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await res.json();

        if (!data.valid) {
          setError(data.error || "Lien invalide ou expiré");
        } else {
          setTokenData(data);
        }
      } catch {
        setError("Erreur de vérification");
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-cyrelis-blue" />
      </div>
    );
  }

  // Succès
  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-8 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="font-heading text-2xl font-semibold text-slate-900 mb-3">
            Mot de passe modifié !
          </h1>
          <p className="text-slate-600 mb-6">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
          </p>

          <Button 
            onClick={() => router.push("/login")}
            className="w-full h-12 bg-cyrelis-blue hover:bg-slate-800"
          >
            Se connecter
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </main>
    );
  }

  // Token invalide
  if (!tokenData?.valid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-8 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="font-heading text-2xl font-semibold text-slate-900 mb-3">
            Lien invalide
          </h1>
          <p className="text-slate-600 mb-6">
            {error || "Ce lien de réinitialisation est invalide ou a expiré."}
          </p>

          <Link href="/forgot-password">
            <Button className="w-full h-12 bg-cyrelis-blue hover:bg-slate-800">
              Demander un nouveau lien
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  // Formulaire
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                <Image
                  src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                  alt="Logo Cyrélis"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading text-2xl font-semibold text-cyrelis-blue">Cyrélis</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-semibold text-slate-900 mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-slate-600">
              {tokenData.name && `Bonjour ${tokenData.name}, `}
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Minimum 8 caractères</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyrelis-mint focus:border-transparent"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !password || !confirmPassword}
              className="w-full h-12 bg-cyrelis-blue hover:bg-slate-800"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-cyrelis-blue" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

