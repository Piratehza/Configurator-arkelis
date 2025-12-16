"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Handshake, 
  ShieldCheck, 
  Heart, 
  Lightbulb, 
  Phone,
  ArrowRight,
  Quote,
  Sparkles,
  Target,
  Users,
  Lock,
  MessageCircle,
  Cog,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  HeroBackground,
  FloatingShapes,
  GridBackground,
} from "@/components/backgrounds/AnimatedBackground";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  },
};

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-white min-h-screen pt-20 overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO - Introduction Premium */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative py-24 md:py-32 overflow-hidden">
        <HeroBackground />
        
        <motion.div 
          className="container mx-auto px-4 max-w-5xl text-center relative z-10"
          style={{ y: heroY }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-8 text-cyrelis-blue bg-cyrelis-mint/20 px-5 py-2 text-sm font-semibold rounded-full border border-cyrelis-mint/30">
                <Sparkles className="w-4 h-4 mr-2" />
              Notre ADN
            </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]"
            >
              Une cybersécurité{" "}
              <span className="relative inline-block">
                <span className="text-cyrelis-blue">accessible</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-cyrelis-blue/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br className="hidden md:block" />
              et{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyrelis-mint to-teal-400">intelligente</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-cyrelis-mint/20 to-teal-400/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                />
              </span>.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
            >
              Cyrélis réunit <strong className="text-slate-800">deux experts complémentaires</strong> autour d'une mission : 
              <span className="text-cyrelis-blue font-semibold"> rendre la protection numérique simple et efficace pour les TPE</span>.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Forme décorative */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* NOTRE PROMESSE - Ce qui nous différencie */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6"
            >
              Notre vision
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Nous avons constaté que les TPE et indépendants font face à un défi majeur : 
              des solutions de sécurité souvent complexes, coûteuses, et inadaptées à leurs besoins réels.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MessageCircle,
                title: "Clarté avant tout",
                desc: "Nous privilégions un langage clair et accessible. Chaque décision technique est expliquée simplement, sans jargon inutile.",
                color: "cyrelis-mint",
              },
              {
                icon: Heart,
                title: "Solutions sur mesure",
                desc: "Chaque entreprise est unique. Nous adaptons nos recommandations à votre activité, vos contraintes et votre budget.",
                color: "cyrelis-blue",
              },
              {
                icon: Phone,
                title: "Disponibilité garantie",
                desc: "Un interlocuteur dédié, joignable directement. Matthieu ou Ethan prennent personnellement en charge vos demandes.",
                color: "cyrelis-mint",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`p-4 bg-${item.color}/10 rounded-xl w-fit mb-6`}>
                  <item.icon className={`w-7 h-7 text-${item.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LE DUO - Présentation Premium */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative">
        <FloatingShapes variant="light" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
              <span className="text-sm font-semibold text-cyrelis-mint uppercase tracking-wider">L'équipe fondatrice</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              Les <span className="text-cyrelis-blue">fondateurs</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Deux profils complémentaires : la relation client et la vision stratégique d'un côté, 
              l'expertise technique et l'architecture de l'autre.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12"
          >
            
            {/* === CARTE MATTHIEU === */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyrelis-mint/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full bg-gradient-to-br from-slate-50 to-white rounded-[2rem] p-8 md:p-10 border border-slate-200 overflow-hidden transition-all duration-500 hover:border-cyrelis-mint/50 hover:shadow-2xl">
                {/* Accent décoratif */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyrelis-mint/10 to-transparent rounded-bl-full" />
                        
                        <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <motion.div 
                      className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0"
                      whileHover={{ scale: 1.05, rotate: -3 }}
                    >
                                    <Image 
                                        src="https://i.postimg.cc/MHyS7KRY/AO4A9978_MATTHIEU_V_20X30.jpg" 
                                        alt="Matthieu Vallet" 
                        width={112}
                        height={112}
                        className="w-full h-full object-cover" 
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Matthieu Vallet
                      </h3>
                      <p className="text-cyrelis-mint font-semibold flex items-center gap-2 text-lg">
                        <BrainCircuit className="w-5 h-5" /> 
                        Directeur Général / Fondateur
                      </p>
                                </div>
                            </div>
                            
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="w-8 h-8 text-cyrelis-mint/40 flex-shrink-0" />
                      <p className="text-lg text-slate-700 leading-relaxed italic">
                        "Une bonne sécurité doit être invisible. Elle protège efficacement sans perturber le quotidien de l'entreprise."
                      </p>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      En tant que <strong className="text-slate-800">Directeur Général</strong>, Matthieu assure la relation client et le pilotage stratégique. 
                      Il analyse vos besoins, coordonne les projets et garantit la qualité de l'accompagnement à chaque étape.
                    </p>
                  </div>

                            <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white border border-slate-200 text-slate-700 px-4 py-2 hover:bg-slate-50">
                      <Heart className="w-3 h-3 mr-1.5" /> Relation client
                    </Badge>
                    <Badge className="bg-white border border-slate-200 text-slate-700 px-4 py-2 hover:bg-slate-50">
                      <GraduationCap className="w-3 h-3 mr-1.5" /> Formation
                    </Badge>
                    <Badge className="bg-white border border-slate-200 text-slate-700 px-4 py-2 hover:bg-slate-50">
                      <Target className="w-3 h-3 mr-1.5" /> Conseil
                    </Badge>
                            </div>
                        </div>
                    </div>
            </motion.div>

            {/* === CARTE ETHAN === */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyrelis-blue/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full bg-gradient-to-br from-cyrelis-blue via-cyrelis-blue to-slate-900 text-white rounded-[2rem] p-8 md:p-10 border border-slate-800 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyrelis-blue/20">
                {/* Effet de grille */}
                <div className="absolute inset-0 opacity-5">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                        <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <motion.div 
                      className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl flex-shrink-0"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                    >
                                    <Image 
                                        src="https://i.postimg.cc/4NQGnyXv/RD049.jpg" 
                                        alt="Ethan Mathieu" 
                        width={112}
                        height={112}
                        className="w-full h-full object-cover" 
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                        Ethan Mathieu
                      </h3>
                      <p className="text-cyrelis-mint font-semibold flex items-center gap-2 text-lg">
                        <Cog className="w-5 h-5" /> 
                        Co-Fondateur & Directeur Technique
                      </p>
                                </div>
                            </div>
                            
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="w-8 h-8 text-cyrelis-mint/40 flex-shrink-0" />
                      <p className="text-lg text-slate-200 leading-relaxed italic">
                        "L'excellence technique, c'est anticiper les problèmes avant qu'ils n'arrivent. Une infrastructure bien conçue est une infrastructure sereine."
                      </p>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      En tant que <strong className="text-white">Directeur Technique</strong>, Ethan conçoit et déploie l'ensemble de l'infrastructure de sécurité. 
                      Il assure la configuration des outils, l'automatisation des processus et la maintenance continue des systèmes.
                    </p>
                  </div>

                            <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 border border-white/20 text-slate-200 px-4 py-2 hover:bg-white/20">
                      <Cog className="w-3 h-3 mr-1.5" /> Infrastructure
                    </Badge>
                    <Badge className="bg-white/10 border border-white/20 text-slate-200 px-4 py-2 hover:bg-white/20">
                      <Sparkles className="w-3 h-3 mr-1.5" /> Automatisation
                    </Badge>
                    <Badge className="bg-white/10 border border-white/20 text-slate-200 px-4 py-2 hover:bg-white/20">
                      <Lock className="w-3 h-3 mr-1.5" /> Sécurité
                    </Badge>
                            </div>
                        </div>
                    </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TIMELINE - Notre Trajectoire */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Notre histoire</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              La genèse de <span className="text-cyrelis-mint">Cyrélis</span>
            </motion.h2>
          </motion.div>

          {/* Timeline verticale premium */}
          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyrelis-blue via-cyrelis-mint to-cyrelis-blue md:-translate-x-1/2" />
            
            <div className="space-y-16">
              
              {/* Étape 1 - L'Observation */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center"
              >
                <div className="hidden md:block w-1/2 pr-12 text-right">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
                  >
                    <span className="text-sm font-bold text-cyrelis-blue uppercase tracking-wider">Début 2025</span>
                    <h3 className="font-heading font-bold text-2xl text-slate-900 mt-2 mb-3">Le constat initial</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Fort de plusieurs années dans le conseil et la gestion de projet, Matthieu identifie un besoin critique : 
                      les <strong className="text-slate-800">TPE manquent de solutions de sécurité adaptées</strong> à leur taille et à leurs moyens.
                    </p>
                  </motion.div>
                </div>
                
                {/* Point central */}
                <div className="absolute left-8 md:left-1/2 w-16 h-16 -translate-x-1/2 flex items-center justify-center z-10">
                  <motion.div 
                    className="w-14 h-14 bg-cyrelis-blue rounded-full flex items-center justify-center shadow-lg shadow-cyrelis-blue/30"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                
                <div className="md:hidden pl-24">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg"
                  >
                    <span className="text-sm font-bold text-cyrelis-blue uppercase tracking-wider">Début 2025</span>
                    <h3 className="font-heading font-bold text-xl text-slate-900 mt-2 mb-3">Le constat initial</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Matthieu identifie un besoin crucial : les TPE manquent de solutions de sécurité accessibles et adaptées.
                    </p>
                  </motion.div>
                    </div>
                
                <div className="hidden md:block w-1/2" />
              </motion.div>

              {/* Étape 2 - L'Association */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center"
              >
                <div className="hidden md:block w-1/2" />
                
                {/* Point central */}
                <div className="absolute left-8 md:left-1/2 w-16 h-16 -translate-x-1/2 flex items-center justify-center z-10">
                  <motion.div 
                    className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users className="w-6 h-6 text-cyrelis-mint" />
                  </motion.div>
                    </div>
                
                <div className="hidden md:block w-1/2 pl-12">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
                  >
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Printemps 2025</span>
                    <h3 className="font-heading font-bold text-2xl text-slate-900 mt-2 mb-3">L'association des compétences</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Ethan, expert en infrastructure et automatisation, rejoint le projet. Leur complémentarité 
                      <strong className="text-slate-800"> permet de construire une offre complète</strong> : 
                      accompagnement client et excellence technique réunis.
                    </p>
                  </motion.div>
                </div>
                
                <div className="md:hidden pl-24">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg"
                  >
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Printemps 2025</span>
                    <h3 className="font-heading font-bold text-xl text-slate-900 mt-2 mb-3">L'association des compétences</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Ethan rejoint le projet et apporte son expertise technique pour structurer l'offre.
                    </p>
                  </motion.div>
                    </div>
              </motion.div>

              {/* Étape 3 - La création */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center"
              >
                <div className="hidden md:block w-1/2 pr-12 text-right">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-cyrelis-blue to-slate-900 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 inline-block"
                  >
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <span className="text-sm font-bold text-cyrelis-mint uppercase tracking-wider">Mai 2025</span>
                      <Badge className="bg-cyrelis-mint text-cyrelis-blue text-xs font-bold px-2 py-0.5">
                        CRÉATION
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-white mt-2 mb-3">Cyrélis est fondée</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Création officielle de la société. Une structure dédiée à la 
                      <strong className="text-white"> cybersécurité des TPE et indépendants</strong>, 
                      avec une offre claire et un accompagnement personnalisé.
                    </p>
                  </motion.div>
                </div>
                
                {/* Point central */}
                <div className="absolute left-8 md:left-1/2 w-16 h-16 -translate-x-1/2 flex items-center justify-center z-10">
                  <motion.div 
                    className="w-14 h-14 bg-cyrelis-mint rounded-full flex items-center justify-center shadow-lg shadow-cyrelis-mint/30"
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      boxShadow: [
                        "0 10px 15px -3px rgba(45, 212, 191, 0.3)",
                        "0 10px 25px -3px rgba(45, 212, 191, 0.5)",
                        "0 10px 15px -3px rgba(45, 212, 191, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Handshake className="w-6 h-6 text-cyrelis-blue" />
                  </motion.div>
                    </div>
                
                <div className="md:hidden pl-24">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-cyrelis-blue to-slate-900 text-white p-6 rounded-2xl shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-cyrelis-mint uppercase tracking-wider">Mai 2025</span>
                      <Badge className="bg-cyrelis-mint text-cyrelis-blue text-xs font-bold px-2 py-0.5">
                        CRÉATION
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white mt-2 mb-3">Cyrélis est fondée</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      Création officielle de Cyrélis, dédiée à la cybersécurité des TPE.
                    </p>
                  </motion.div>
                </div>
                
                <div className="hidden md:block w-1/2" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* VALEURS - Ce que nous défendons */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <FloatingShapes variant="light" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
              <span className="text-sm font-semibold text-cyrelis-mint uppercase tracking-wider">Nos engagements</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              Nos <span className="text-cyrelis-blue">valeurs</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Trois principes fondamentaux qui guident notre approche et chacune de nos décisions.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Pilier 1 - Souveraineté */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="group text-center p-10 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 hover:border-cyrelis-mint/50 hover:shadow-2xl transition-all duration-500"
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-cyrelis-blue to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">Souveraineté des données</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Vos informations sensibles vous appartiennent exclusivement. Grâce au chiffrement "Zero-Knowledge", 
                <strong className="text-slate-800"> même nos équipes n'y ont pas accès</strong>. Vos données restent vôtres.
              </p>
            </motion.div>

            {/* Pilier 2 - Innovation */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="group text-center p-10 bg-gradient-to-b from-cyrelis-mint/10 to-white rounded-3xl border border-cyrelis-mint/30 hover:shadow-2xl transition-all duration-500"
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-cyrelis-mint to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                <BrainCircuit className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">Innovation au service de la simplicité</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Nous avons développé un <strong className="text-slate-800">Agent IA Cyrélis</strong> dédié à la cybersécurité. 
                Il vous accompagne, répond à vos questions et simplifie chaque étape de votre protection.
              </p>
            </motion.div>

            {/* Pilier 3 - Proximité */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="group text-center p-10 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 hover:border-cyrelis-blue/50 hover:shadow-2xl transition-all duration-500"
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-cyrelis-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                <Phone className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">Proximité et réactivité</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Un interlocuteur dédié, disponible et réactif. 
                <strong className="text-slate-800"> Matthieu ou Ethan prennent directement vos appels</strong> — sans attente, sans intermédiaire.
              </p>
            </motion.div>
          </motion.div>
         </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-cyrelis-blue via-cyrelis-blue to-slate-900 relative overflow-hidden">
        {/* Effet de grille */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2 
              className="font-heading text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Prêt à sécuriser votre activité ?
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Configurez votre protection en quelques clics. Prix transparents, accompagnement humain.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/simulateur">
                <Button className="h-14 px-10 bg-cyrelis-mint text-cyrelis-blue font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl text-lg rounded-xl">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Configurer mon offre
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-14 px-10 border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 text-lg rounded-xl">
                  <Phone className="mr-2 w-5 h-5" />
                  Nous contacter
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
