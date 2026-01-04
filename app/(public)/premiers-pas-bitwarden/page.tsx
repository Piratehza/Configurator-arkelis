"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  Mail,
  KeyRound,
  Globe,
  Import,
  MousePointer,
  Keyboard,
  Share2,
  Send,
  Languages,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
} from "lucide-react";

interface VideoSectionProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  vimeoId: string;
  tips?: string[];
}

function VideoSection({ title, description, duration, vimeoId, tips }: VideoSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Play className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{duration}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-5 pt-0 space-y-4">
          <p className="text-slate-300 text-sm">{description}</p>
          
          <div className="relative rounded-xl overflow-hidden border border-slate-600">
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                title={title}
                allowFullScreen
              />
            </div>
          </div>

          {tips && tips.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-300 font-medium mb-2">💡 Astuce</p>
              {tips.map((tip, i) => (
                <p key={i} className="text-sm text-slate-300">{tip}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PremiersPassBitwardenPage() {
  // Ajouter noindex pour cacher la page des moteurs de recherche
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
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
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Centre de formation</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Premiers pas avec Bitwarden
              </h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 max-w-2xl mb-8">
            Votre administrateur a configuré Bitwarden pour votre organisation. 
            Découvrez comment sauvegarder vos mots de passe, les partager en toute sécurité 
            et intégrer Bitwarden dans votre quotidien.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Vidéos officielles</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Partenaire Cyrélis</span>
            </div>
          </div>
        </div>
      </section>

      {/* ⚠️ IMPORTANT: Bitwarden EU */}
      <section className="py-8 bg-amber-500/10 border-y border-amber-500/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-400 mb-2">
                ⚠️ Important : Choisir le serveur Bitwarden EU
              </h3>
              <p className="text-slate-300 mb-3">
                Lors de <strong className="text-white">chaque première connexion</strong> (extension, application mobile, application desktop ou web), vous devez sélectionner le bon serveur :
              </p>
              <ol className="text-slate-300 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-500/30 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">1</span>
                  <span>Sur l'écran de connexion, cliquez sur <strong className="text-white">"bitwarden.com"</strong> en bas de la page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-500/30 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">2</span>
                  <span>Sélectionnez <strong className="text-white">"Bitwarden EU"</strong> dans la liste</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-500/30 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">3</span>
                  <span>Connectez-vous ensuite avec vos identifiants</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 : Rejoindre l'organisation */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-emerald-400 uppercase tracking-wider">Étape 1</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Rejoindre votre organisation
              </h2>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">📧 Vous avez reçu un email d'invitation</h3>
            <p className="text-slate-300 mb-4">
              Cyrélis vous a envoyé une invitation par email à votre <strong className="text-white">adresse mail professionnelle</strong>. 
              Voici comment procéder :
            </p>
            <ol className="text-slate-300 space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400">1</span>
                <span>Ouvrez l'email de Bitwarden dans votre boîte mail professionnelle</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400">2</span>
                <span>Cliquez sur le bouton <strong className="text-white">"Rejoindre l'organisation"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400">3</span>
                <span>Créez votre <strong className="text-white">mot de passe maître</strong> (c'est le seul mot de passe que vous devrez retenir !)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400">4</span>
                <span>Regardez la vidéo ci-dessous pour être accompagné</span>
              </li>
            </ol>
          </div>

          {/* Vidéo rejoindre organisation */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-emerald-500/10 mb-6">
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/1086379394?h=f579068b35&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                title="Rejoindre votre organisation Bitwarden"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">Durée : 3 min • Vidéo officielle Bitwarden</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 : Mot de passe maître */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">À savoir</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Votre mot de passe maître
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Mémorisable
              </h3>
              <p className="text-slate-300 text-sm">
                Bitwarden n'a <strong className="text-white">aucun moyen</strong> de récupérer ou réinitialiser votre mot de passe maître. 
                <span className="text-amber-400"> Ne l'oubliez pas !</span>
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Fort et unique
              </h3>
              <p className="text-slate-300 text-sm">
                Un mot de passe long et complexe protège votre compte. 
                Utilisez l'<a href="https://bitwarden.com/password-strength/" target="_blank" rel="noopener" className="text-blue-400 underline">outil de test Bitwarden</a> pour vérifier sa force.
              </p>
            </div>
          </div>

          {/* Vidéo mot de passe maître */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-purple-500/10 mb-6">
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/1075687841?badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                title="Mot de passe maître et appareils de confiance"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">Durée : 2 min • Appareils de confiance et SSO</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 : Extension navigateur */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Chrome className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Étape 2</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Installer l'extension navigateur
              </h2>
            </div>
          </div>

          {/* Rappel serveur EU */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Globe className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              <strong className="text-amber-400">Rappel :</strong> Lors de la connexion, sélectionnez <strong className="text-white">Bitwarden EU</strong> en bas de l'écran.
            </p>
          </div>

          <p className="text-slate-300 mb-8">
            L'extension navigateur vous permet de remplir automatiquement vos identifiants sur tous les sites web. 
            <a href="https://bitwarden.com/download/" target="_blank" rel="noopener" className="text-blue-400 underline ml-1">
              Télécharger l'extension
            </a>
          </p>

          {/* Vidéo extension */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-500/10 mb-6">
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/1084695614?badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                title="Extension navigateur Bitwarden"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">Durée : 4 min • Chrome, Firefox, Edge, Safari, Brave...</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 : Importer vos mots de passe */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Import className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Étape 3</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Importer vos mots de passe existants
              </h2>
            </div>
          </div>

          <p className="text-slate-300 mb-8">
            Transférez vos mots de passe existants vers Bitwarden. Plusieurs méthodes sont disponibles selon votre appareil.
          </p>

          <div className="space-y-4">
            <VideoSection
              id="import-extension"
              title="Depuis l'extension navigateur"
              description="Importez vos mots de passe directement depuis l'extension Bitwarden."
              duration="1 min"
              vimeoId="1145638461"
            />
            <VideoSection
              id="import-web"
              title="Depuis l'application web"
              description="Importez vos données via l'interface web de Bitwarden."
              duration="1 min"
              vimeoId="1145638443"
            />
            <VideoSection
              id="import-desktop"
              title="Depuis l'application desktop (import direct Chrome, Edge...)"
              description="Importez directement depuis Chrome, Edge, Opera, Brave ou Vivaldi sans exporter de fichier."
              duration="2 min"
              vimeoId="1145638482"
            />
            <VideoSection
              id="import-mobile"
              title="Depuis l'application mobile"
              description="Importez vos mots de passe depuis l'app iOS ou Android."
              duration="1 min"
              vimeoId="1145638494"
            />
            <VideoSection
              id="import-custom"
              title="Depuis un fichier personnalisé"
              description="Importez depuis un fichier CSV ou JSON personnalisé."
              duration="1 min"
              vimeoId="1145638421"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 : Remplissage automatique */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <MousePointer className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-green-400 uppercase tracking-wider">Utilisation quotidienne</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Remplissage automatique (Extension)
              </h2>
            </div>
          </div>

          <p className="text-slate-300 mb-8">
            Découvrez les différentes façons de remplir automatiquement vos identifiants avec l'extension navigateur.
          </p>

          <div className="space-y-4">
            <VideoSection
              id="autofill-inline"
              title="Menu contextuel intégré"
              description="Le menu apparaît directement dans les champs de connexion pour un remplissage instantané."
              duration="1 min"
              vimeoId="1140176329"
              tips={["Si vous utilisez l'authentificateur Bitwarden (TOTP), le code est automatiquement copié après le remplissage. Collez-le avec Ctrl+V (ou Cmd+V sur Mac)."]}
            />
            <VideoSection
              id="autofill-button"
              title="Bouton de remplissage"
              description="Ouvrez l'extension et cliquez sur le bouton à côté de l'identifiant souhaité."
              duration="1 min"
              vimeoId="1141142837"
            />
            <VideoSection
              id="autofill-context"
              title="Menu clic droit"
              description="Faites un clic droit sur n'importe quel champ pour accéder à vos identifiants Bitwarden."
              duration="1 min"
              vimeoId="1141154474"
            />
            <VideoSection
              id="autofill-keyboard"
              title="Raccourcis clavier"
              description="Remplissez instantanément avec Ctrl+Shift+L (ou Cmd+Shift+L sur Mac)."
              duration="1 min"
              vimeoId="1141160672"
              tips={["Vous pouvez personnaliser vos raccourcis dans les paramètres de l'extension."]}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 : Android */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-lime-500/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-lime-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-lime-400 uppercase tracking-wider">Mobile</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Remplissage automatique (Android)
              </h2>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Globe className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              <strong className="text-amber-400">Rappel :</strong> Sur mobile aussi, sélectionnez <strong className="text-white">Bitwarden EU</strong> lors de la première connexion.
            </p>
          </div>

          <div className="space-y-4">
            <VideoSection
              id="android-inline"
              title="Suggestions en ligne"
              description="Les suggestions apparaissent directement au-dessus du clavier pour un accès rapide."
              duration="1 min"
              vimeoId="1149193513"
              tips={["Si vous utilisez le TOTP Bitwarden, le code est automatiquement copié dans le presse-papier après le remplissage."]}
            />
            <VideoSection
              id="android-popup"
              title="Menu popup"
              description="Accédez à vos identifiants via le menu popup qui apparaît sur les champs de connexion."
              duration="1 min"
              vimeoId="1149326073"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 : Partage */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <Share2 className="w-7 h-7 text-pink-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-pink-400 uppercase tracking-wider">Collaboration</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Partager des identifiants
              </h2>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              Collections partagées
            </h3>
            <p className="text-slate-300">
              En tant que membre de votre organisation, vous pouvez accéder aux identifiants partagés dans des <strong className="text-white">collections</strong>. 
              Ces collections regroupent les accès aux outils communs de votre équipe.
            </p>
          </div>

          <div className="space-y-4">
            <VideoSection
              id="send"
              title="Bitwarden Send : partager textes et fichiers"
              description="Envoyez des informations sensibles via des liens chiffrés qui s'autodétruisent. Idéal pour partager avec des personnes externes."
              duration="2 min"
              vimeoId="797850224"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 8 : Aller plus loin */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <Monitor className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-orange-400 uppercase tracking-wider">Pour aller plus loin</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Fonctionnalités avancées
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <VideoSection
              id="all-devices"
              title="Bitwarden sur tous vos appareils"
              description="Téléchargez Bitwarden sur tous vos appareils pour accéder à vos mots de passe partout."
              duration="1 min"
              vimeoId="796410440"
            />
            <VideoSection
              id="language"
              title="Changer la langue de l'application"
              description="Configurez Bitwarden dans votre langue préférée."
              duration="2 min"
              vimeoId="795737043"
            />
            <VideoSection
              id="custom-fields"
              title="Utiliser les champs personnalisés"
              description="Ajoutez des informations supplémentaires à vos identifiants (codes PIN, questions secrètes, etc.)."
              duration="2 min"
              vimeoId="821402921"
            />
            <VideoSection
              id="families"
              title="Plan Bitwarden Families gratuit"
              description="Votre organisation peut vous offrir un plan Families gratuit pour sécuriser vos mots de passe personnels et les partager avec jusqu'à 5 proches."
              duration="1 min"
              vimeoId="828094070"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION : Support */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 text-center">
            <div className="w-16 h-16 bg-cyrelis-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-cyrelis-mint" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Besoin d'aide ?
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              L'équipe Cyrélis est là pour vous accompagner dans la prise en main de Bitwarden. 
              N'hésitez pas à nous contacter si vous avez des questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyrelis-mint text-slate-900 font-semibold rounded-xl hover:bg-white transition-colors"
              >
                Contacter Cyrélis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://community.bitwarden.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
              >
                Communauté Bitwarden
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-slate-950 border-t border-slate-800">
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
