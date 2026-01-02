"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Lock,
  Zap,
  Target,
  Wrench,
  RefreshCcw,
  Users,
  Headphones,
  ShieldCheck,
  ArrowUpRight,
  Quote,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO - Design Premium avec image de fond */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop"
            alt="Cybersécurité"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          </div>
          
        {/* Contenu */}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-32">
            {/* Colonne gauche - Texte */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 bg-cyrelis-mint rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">
                  Cybersécurité managée pour TPE
                </span>
          </div>

            {/* Acronyme CY-RÉ-LIS */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-0 w-fit">
                {/* Ligne 1 : CY • RÉ • LIS */}
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">CY</span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/30 text-center">•</span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-cyrelis-mint text-center">RÉ</span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/30 text-center">•</span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">LIS</span>
                {/* Ligne 2 : Labels alignés */}
                <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider text-center mt-2">Cyber</span>
                <span></span>
                <span className="text-[10px] md:text-xs text-cyrelis-mint font-semibold uppercase tracking-wider text-center mt-2">Résilience</span>
                <span></span>
                <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider text-center mt-2">Lisibilité</span>
              </div>
            </div>

            {/* Titre principal */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl">
              Nous rendons la cybersécurité
              <span className="text-cyrelis-mint"> résiliente</span> et
              <span className="text-cyrelis-mint"> lisible</span>.
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Protection des accès, sécurité des postes, maintenance proactive. 
              Une offre claire pour les TPE et indépendants.
            </p>

          {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/simulateur">
                  <Button className="h-14 px-8 bg-cyrelis-mint text-slate-900 font-semibold hover:bg-white rounded-xl text-lg transition-all shadow-2xl shadow-cyrelis-mint/20 hover:shadow-white/20">
                Configurer mon offre
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
                <Link href="/a-propos">
              <Button
                    variant="outline"
                    className="h-14 px-8 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-medium rounded-xl text-lg"
              >
                    Découvrir Cyrélis
                </Button>
              </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyrelis-mint" />
                  <span className="text-sm text-slate-400">Partenaire Bitwarden</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyrelis-mint" />
                  <span className="text-sm text-slate-400">Chiffrement AES-256</span>
                </div>
              </div>
            </div>

            {/* Colonne droite - Logo Cyrélis */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                <Image
                  src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                  alt="Logo Cyrélis"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION SERVICES - Cards épurées */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              Notre expertise
              </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Une protection complète et lisible
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trois piliers fondamentaux pour sécuriser durablement votre activité.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: KeyRound,
                title: "Gestion des accès",
                description: "Coffre-fort de mots de passe Bitwarden Enterprise. Génération, stockage et partage sécurisé pour toute votre équipe.",
                color: "bg-teal-500",
              },
              {
                icon: Shield,
                title: "Protection des postes",
                description: "Antivirus nouvelle génération SentinelOne avec IA. Détection et neutralisation automatique des menaces.",
                color: "bg-blue-600",
              },
              {
                icon: RefreshCcw,
                title: "Maintenance proactive",
                description: "Supervision continue via NinjaOne. Mises à jour automatiques, alertes et interventions à distance.",
                color: "bg-purple-600",
              },
            ].map((service, i) => (
              <div 
                  key={i} 
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION COMMENT ÇA MARCHE - Timeline professionnelle */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Colonne gauche - Texte */}
            <div>
              <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
                Notre approche
                </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                Deux étapes pour vous protéger
              </h2>
              <p className="text-xl text-slate-600 mb-12">
                Une installation soignée, puis un accompagnement continu. 
                Simple et transparent.
              </p>

              {/* Steps */}
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-cyrelis-mint rounded-xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-slate-900" />
                </div>
                    <div className="w-px h-full bg-slate-200 mt-4" />
                </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-xl font-bold text-slate-900">Installation</h3>
                      <span className="px-3 py-1 bg-cyrelis-mint/20 text-cyrelis-blue text-xs font-semibold rounded-full">
                        Une seule fois
                      </span>
              </div>
                    <p className="text-slate-600 mb-4">
                      Nous auditons vos pratiques, déployons les outils et formons votre équipe.
                    </p>
                    <ul className="space-y-2">
                      {["Audit de sécurité initial", "Déploiement des solutions", "Formation personnalisée"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-cyrelis-mint" />
                          {item}
                        </li>
                ))}
              </ul>
                    </div>
              </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <RefreshCcw className="w-6 h-6 text-white" />
              </div>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-xl font-bold text-slate-900">Accompagnement</h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                        Continu
                      </span>
                </div>
                    <p className="text-slate-600 mb-4">
                      Nous veillons sur vos systèmes, assurons les mises à jour et restons disponibles.
                    </p>
                    <ul className="space-y-2">
                      {["Mises à jour automatiques", "Surveillance 24/7", "Support prioritaire"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          {item}
                        </li>
                ))}
              </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12">
                <Link href="/simulateur">
                  <Button className="h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold">
                    Configurer mon offre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                </div>
              </div>

            {/* Colonne droite - Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2940&auto=format&fit=crop"
                  alt="Équipe travaillant"
                  width={600}
                  height={700}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 max-w-xs">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-emerald-600" />
              </div>
                  <div>
                    <p className="font-semibold text-slate-900">Tarif sur devis</p>
                    <p className="text-sm text-slate-500">Adapté à votre structure</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PARTENAIRES TECHNOLOGIQUES */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-mint uppercase tracking-widest">
              Écosystème
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Propulsé par les leaders
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Nous avons sélectionné les meilleures solutions mondiales.
                </p>
              </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Bitwarden",
                role: "Gestion des mots de passe",
                logo: "https://i.postimg.cc/MTgXqH4z/vertical-blue-logo.png",
                tags: ["Open Source", "SOC2", "Zero-Knowledge"],
                url: "https://bitwarden.com",
              },
              {
                name: "SentinelOne",
                role: "Protection endpoint IA",
                logo: "https://i.postimg.cc/cLNV7MpR/Sentinel-One-id98b5u-Tfq-1.png",
                tags: ["EDR/XDR", "IA Autonome", "Gartner Leader"],
                url: "https://sentinelone.com",
              },
              {
                name: "NinjaOne",
                role: "Supervision & maintenance",
                logo: "https://i.postimg.cc/hj3rCchH/ninja-One-logo-blue.png",
                tags: ["RMM", "Patch Mgmt", "#1 G2"],
                url: "https://ninjaone.com",
              },
            ].map((partner, i) => (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                  {partner.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{partner.role}</p>
                <div className="flex flex-wrap gap-2">
                  {partner.tags.map((tag, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                      {tag}
                  </span>
                  ))}
                </div>
              </a>
            ))}
                 </div>

          {/* Trust badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <CheckCircle2 className="w-5 h-5 text-cyrelis-mint" />
              <span className="text-white font-medium">Partenaire certifié de ces solutions</span>
              </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ÉQUIPE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            {/* Photos */}
            <div className="flex justify-center mb-8">
              <div className="flex -space-x-4">
                <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                  <Image
                    src="https://i.postimg.cc/MHyS7KRY/AO4A9978_MATTHIEU_V_20X30.jpg"
                    alt="Matthieu"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                  <Image
                    src="https://i.postimg.cc/4NQGnyXv/RD049.jpg"
                    alt="Ethan"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                </div>
              </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Vos interlocuteurs directs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              <strong>Matthieu</strong> vous accompagne au quotidien. <strong>Ethan</strong> construit votre infrastructure. 
              Pas de chatbot, pas de call center.
            </p>

            <Link href="/a-propos">
              <Button variant="outline" className="h-12 px-6 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold">
                Découvrir notre histoire
                <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
                  </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TÉMOIGNAGE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              Ils nous font confiance
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Logo client - mis en valeur */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                  <Image
                    src="https://i.postimg.cc/L4yZ04Nd/Capture-d-e-cran-2025-12-08-a-10-18-18.png"
                    alt="Terra"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Témoignage - plus compact */}
              <div className="flex-1 text-center md:text-left">
                <Quote className="w-8 h-8 text-slate-200 mb-4 mx-auto md:mx-0" />
                <blockquote className="text-lg text-slate-700 leading-relaxed mb-4">
                  "Cyrélis nous a permis de sécuriser nos accès sans complexifier notre quotidien."
                </blockquote>
                <div>
                  <p className="font-semibold text-slate-900">Terra</p>
                  <p className="text-sm text-slate-500">Client depuis 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-cyrelis-blue to-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à sécuriser votre activité ?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Obtenez un devis personnalisé en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulateur">
              <Button className="h-14 px-10 bg-cyrelis-mint text-slate-900 font-semibold hover:bg-white rounded-xl text-lg shadow-2xl">
                Configurer mon offre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
                <Button
                  variant="outline"
                className="h-14 px-10 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-medium rounded-xl text-lg"
                >
                <Headphones className="mr-2 h-5 w-5" />
                Nous appeler
               </Button>
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
