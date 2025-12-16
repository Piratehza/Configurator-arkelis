"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowLeft, Mail, KeyRound, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  // Redirection automatique après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-slate-900 border border-cyrelis-mint flex items-center justify-center">
                <Shield className="h-4 w-4 text-cyrelis-mint" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl font-semibold text-white text-center mb-3">
            Accès sur invitation
          </h1>

          <p className="text-slate-400 text-center mb-6 leading-relaxed text-sm">
            Cyrélis est une plateforme{" "}
            <strong className="text-cyrelis-mint">B2B exclusive</strong>. 
            L'inscription publique n'est pas disponible.
          </p>

          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-amber-200 font-medium">Accès restreint</p>
                <p className="text-xs text-amber-200/70 mt-1">
                  Seuls les administrateurs peuvent créer de nouveaux comptes utilisateurs.
                </p>
              </div>
            </div>
          </div>

          {/* Info Steps */}
          <div className="bg-slate-900/50 border border-slate-700 p-5 mb-6">
            <h2 className="font-medium text-white mb-4 flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-cyrelis-mint" strokeWidth={1.5} />
              Comment obtenir un accès ?
            </h2>
            <ol className="text-sm text-slate-400 space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-cyrelis-blue text-white text-xs font-medium flex-shrink-0">
                  1
                </span>
                <span>Contactez notre équipe commerciale</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-cyrelis-blue text-white text-xs font-medium flex-shrink-0">
                  2
                </span>
                <span>Nous étudions votre besoin ensemble</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-cyrelis-blue text-white text-xs font-medium flex-shrink-0">
                  3
                </span>
                <span>Nous créons votre compte et vous envoyons vos identifiants</span>
              </li>
            </ol>
          </div>

          {/* Contact */}
          <div className="bg-cyrelis-mint/10 border border-cyrelis-mint/30 p-4 mb-6 flex items-center justify-center gap-2">
            <KeyRound className="w-4 h-4 text-cyrelis-mint" strokeWidth={1.5} />
            <a
              href="mailto:contact@cyrelis.fr"
              className="text-cyrelis-mint text-sm font-medium hover:underline"
            >
              contact@cyrelis.fr
            </a>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full h-12 bg-slate-900 text-white font-medium hover:bg-slate-800 border border-slate-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Retour à la connexion
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                Visiter le site
              </Button>
            </Link>
          </div>

          {/* Auto-redirect */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Redirection automatique vers la connexion dans 5 secondes...
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-cyrelis-mint" strokeWidth={1.5} />
          <span>Plateforme sécurisée</span>
        </div>
      </motion.div>
    </main>
  );
}
