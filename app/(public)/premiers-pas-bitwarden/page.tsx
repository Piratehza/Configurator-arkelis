"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Shield, 
  Download,
  Chrome,
  Smartphone,
  Monitor,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function PremiersPassBitwardenPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-950 to-slate-950" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-5xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white p-2">
              <Image
                src="https://i.postimg.cc/MTgXqH4z/vertical-blue-logo.png"
                alt="Bitwarden"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Formation</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Premiers pas avec Bitwarden
              </h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 max-w-2xl mb-8">
            Apprenez à installer et utiliser Bitwarden pour sécuriser tous vos mots de passe. 
            Cette vidéo officielle vous guide étape par étape.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Vidéo officielle Bitwarden</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Extension navigateur</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Installation de l'extension navigateur
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Suivez cette vidéo pour installer l'extension Bitwarden sur votre navigateur web 
              (Chrome, Firefox, Edge, Safari...).
            </p>
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity" />
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/1084695614?badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                title="Getting started with the Bitwarden browser extension"
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Vidéo fournie par Bitwarden</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Les étapes clés
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Download,
                step: "1",
                title: "Télécharger l'extension",
                description: "Installez l'extension Bitwarden depuis le store de votre navigateur (Chrome, Firefox, Edge...).",
              },
              {
                icon: Chrome,
                step: "2",
                title: "Se connecter",
                description: "Connectez-vous avec les identifiants fournis par Cyrélis pour accéder à votre coffre-fort.",
              },
              {
                icon: Shield,
                step: "3",
                title: "Utiliser au quotidien",
                description: "Bitwarden remplit automatiquement vos identifiants sur les sites web que vous visitez.",
              },
            ].map((item, i) => (
              <div 
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-4xl font-bold text-slate-700">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Platforms */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Bitwarden sur tous vos appareils
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Une fois l'extension installée, vous pouvez aussi accéder à vos mots de passe 
            depuis votre smartphone ou votre ordinateur.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Chrome,
                title: "Extension navigateur",
                description: "Chrome, Firefox, Edge, Safari, Brave...",
                status: "Couvert dans cette vidéo",
                highlight: true,
              },
              {
                icon: Smartphone,
                title: "Application mobile",
                description: "iOS (iPhone/iPad) et Android",
                status: "Disponible sur les stores",
                highlight: false,
              },
              {
                icon: Monitor,
                title: "Application desktop",
                description: "Windows, macOS, Linux",
                status: "Téléchargement gratuit",
                highlight: false,
              },
            ].map((item, i) => (
              <div 
                key={i}
                className={`rounded-2xl p-6 border ${
                  item.highlight 
                    ? "bg-blue-500/10 border-blue-500/50" 
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  item.highlight ? "bg-blue-500/20" : "bg-slate-700"
                }`}>
                  <item.icon className={`w-6 h-6 ${item.highlight ? "text-blue-400" : "text-slate-400"}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                <span className={`text-xs font-medium ${item.highlight ? "text-blue-400" : "text-slate-500"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 text-center">
            <div className="w-16 h-16 bg-cyrelis-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-cyrelis-mint" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Besoin d'aide ?
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Si vous rencontrez des difficultés lors de l'installation ou de l'utilisation de Bitwarden, 
              notre équipe est là pour vous accompagner.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyrelis-mint text-slate-900 font-semibold rounded-xl hover:bg-white transition-colors"
            >
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer link */}
      <section className="py-8 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <Link 
            href="/"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ← Retour à cyrelis.fr
          </Link>
        </div>
      </section>
    </main>
  );
}

