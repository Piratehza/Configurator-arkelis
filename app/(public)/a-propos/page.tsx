"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Heart, 
  Phone,
  ArrowRight,
  Quote,
  Target,
  Users,
  Lock,
  MessageCircle,
  Headphones,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
            alt="Équipe"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-5xl py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-6">
              <Users className="w-4 h-4" />
              Notre histoire
            </span>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Une cybersécurité
              <span className="text-cyrelis-mint"> accessible</span> et
              <span className="text-cyrelis-mint"> humaine</span>.
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Cyrélis réunit deux experts autour d'une mission : rendre la protection numérique 
              simple et efficace pour les TPE et indépendants.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* NOTRE VISION */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              Notre vision
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Ce qui nous différencie
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nous avons constaté que les TPE font face à un défi majeur : des solutions de sécurité 
              souvent complexes, coûteuses et inadaptées à leurs besoins réels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Clarté avant tout",
                description: "Un langage accessible, sans jargon technique. Chaque décision est expliquée simplement.",
              },
              {
                icon: Heart,
                title: "Solutions sur mesure",
                description: "Nous adaptons nos recommandations à votre activité, vos contraintes et votre budget.",
              },
              {
                icon: Phone,
                title: "Disponibilité garantie",
                description: "Un interlocuteur dédié, joignable directement. Matthieu ou Ethan prennent vos appels.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-slate-700" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LES FONDATEURS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              L'équipe
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Les fondateurs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Deux profils complémentaires : la relation client d'un côté, l'expertise technique de l'autre.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Matthieu */}
            <div className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <Image 
                    src="https://i.postimg.cc/MHyS7KRY/AO4A9978_MATTHIEU_V_20X30.jpg" 
                    alt="Matthieu Vallet" 
                    width={96}
                    height={96}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 mb-1">
                    Matthieu Vallet
                  </h3>
                  <p className="text-cyrelis-blue font-semibold">
                    Directeur Général & Fondateur
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 mb-4">
                <Quote className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                <p className="text-slate-600 italic leading-relaxed">
                  "Une bonne sécurité doit être invisible. Elle protège efficacement 
                  sans perturber le quotidien de l'entreprise."
                </p>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">
                Matthieu assure la relation client et le pilotage stratégique. Il analyse vos besoins, 
                coordonne les projets et garantit la qualité de l'accompagnement.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Relation client", "Conseil", "Formation"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white text-slate-600 text-sm rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Ethan */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">
                  <Image 
                    src="https://i.postimg.cc/4NQGnyXv/RD049.jpg" 
                    alt="Ethan Mathieu" 
                    width={96}
                    height={96}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    Ethan Mathieu
                  </h3>
                  <p className="text-cyrelis-mint font-semibold">
                    Co-Fondateur & Directeur Technique
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 mb-4">
                <Quote className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                <p className="text-slate-300 italic leading-relaxed">
                  "L'excellence technique, c'est anticiper les problèmes avant qu'ils n'arrivent. 
                  Une infrastructure bien conçue est une infrastructure sereine."
                </p>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                Ethan conçoit et déploie l'ensemble de l'infrastructure de sécurité. Il assure 
                la configuration des outils et la maintenance continue des systèmes.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Infrastructure", "Automatisation", "Sécurité"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white/10 text-slate-300 text-sm rounded-lg border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* NOTRE HISTOIRE - Timeline simplifiée */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              Notre parcours
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              La genèse de Cyrélis
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                date: "Début 2025",
                title: "Le constat initial",
                description: "Matthieu identifie un besoin critique : les TPE manquent de solutions de sécurité adaptées à leur taille et à leurs moyens.",
                icon: Target,
                highlight: false,
              },
              {
                date: "Printemps 2025",
                title: "L'association des compétences",
                description: "Ethan, expert en infrastructure, rejoint le projet. Leur complémentarité permet de construire une offre complète.",
                icon: Users,
                highlight: false,
              },
              {
                date: "Mai 2025",
                title: "Cyrélis est fondée",
                description: "Création officielle de la société, dédiée à la cybersécurité des TPE et indépendants.",
                icon: ShieldCheck,
                highlight: true,
              },
            ].map((step, i) => (
              <div 
                key={i} 
                className={`flex gap-6 ${step.highlight ? "bg-slate-900 text-white" : "bg-white"} rounded-2xl p-8 border ${step.highlight ? "border-slate-800" : "border-slate-200"}`}
              >
                <div className={`w-14 h-14 ${step.highlight ? "bg-cyrelis-mint" : "bg-slate-100"} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`w-6 h-6 ${step.highlight ? "text-slate-900" : "text-slate-700"}`} />
                </div>
                <div>
                  <span className={`text-sm font-semibold ${step.highlight ? "text-cyrelis-mint" : "text-cyrelis-blue"} uppercase tracking-wide`}>
                    {step.date}
                  </span>
                  <h3 className={`font-heading text-xl font-bold ${step.highlight ? "text-white" : "text-slate-900"} mt-1 mb-2`}>
                    {step.title}
                  </h3>
                  <p className={step.highlight ? "text-slate-300" : "text-slate-600"}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* NOS VALEURS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-widest">
              Nos engagements
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Nos valeurs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trois principes fondamentaux qui guident chacune de nos décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Souveraineté des données",
                description: "Vos informations vous appartiennent. Grâce au chiffrement Zero-Knowledge, même nos équipes n'y ont pas accès.",
                color: "bg-slate-900",
              },
              {
                icon: Zap,
                title: "Simplicité avant tout",
                description: "Nous utilisons la technologie pour simplifier, pas pour compliquer. Chaque outil est pensé pour être intuitif.",
                color: "bg-cyrelis-mint",
              },
              {
                icon: Headphones,
                title: "Proximité et réactivité",
                description: "Un interlocuteur dédié, disponible et réactif. Matthieu ou Ethan prennent directement vos appels.",
                color: "bg-blue-600",
              },
            ].map((value, i) => (
              <div key={i} className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className={`w-8 h-8 ${value.color === "bg-cyrelis-mint" ? "text-slate-900" : "text-white"}`} />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-cyrelis-blue to-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à nous faire confiance ?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Configurez votre protection en quelques clics. Devis personnalisé sous 24h.
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
                <Phone className="mr-2 h-5 w-5" />
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
