"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Lock,
  AlertTriangle,
  Euro,
  Building2,
  Zap,
  HeadphonesIcon,
  Fingerprint,
  Server,
  RotateCcw,
  Sparkles,
  Target,
  Clock,
  Wrench,
  RefreshCcw,
  Users,
  BookOpen,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  HeroBackground,
  GridBackground,
  FloatingShapes,
  AnimatedGradient,
} from "@/components/backgrounds/AnimatedBackground";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  },
};

// Types pour les données API
interface Offer {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  priceType: string;
  basePrice: number;
  pricePerUser: number;
  setupFee: number | null;
  offerType: string;
  restrictedToSlug: string | null;
  quota: string | null;
  category: string | null;
  isPopular: boolean;
  features: string[];
}

interface PricingConfig {
  buildBaseFee: number;
  buildPerUserFee: number;
  vatRate: number;
  minUsers: number;
  maxUsers: number;
}

interface PricingData {
  subscriptions: Offer[];
  addons: Offer[];
  oneShots: Offer[];
  config: PricingConfig;
}

export default function Home() {
  // État pour les données dynamiques
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch("/api/public/pricing");
        if (res.ok) {
          const data = await res.json();
          setPricingData(data);
        }
      } catch (error) {
        console.error("Erreur chargement tarifs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  // Valeurs par défaut pendant le chargement
  const buildFee = pricingData?.config.buildBaseFee ?? 490;
  const buildPerUser = pricingData?.config.buildPerUserFee ?? 15;
  
  // Trouver les offres spécifiques
  const autonomyOffer = pricingData?.subscriptions.find(o => o.slug === "autonomy" || o.slug === "autonomie");
  const partnerOffer = pricingData?.subscriptions.find(o => o.slug === "partner" || o.slug === "partenaire");
  const iaModule = pricingData?.addons.find(o => o.slug === "ia_security" || o.slug === "ia-security" || o.slug.includes("ia"));
  
  const autonomyPrice = autonomyOffer?.pricePerUser ?? 6;
  const partnerPrice = partnerOffer?.pricePerUser ?? 12;
  const iaPrice = iaModule?.pricePerUser ?? 3;
  const iaQuota = iaModule?.quota ?? "30 requêtes/user/mois";
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen bg-white pt-20 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Acronyme CY-RE-LIS IMPACTANT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-slate-950 via-cyrelis-blue to-slate-900 overflow-hidden">
        {/* Background futuriste */}
        <div className="absolute inset-0">
          {/* Grille hexagonale/tech */}
          <div className="absolute inset-0 opacity-[0.07]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                  <polygon 
                    points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" 
                    fill="none" 
                    stroke="rgba(45, 212, 191, 0.5)" 
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
          
          {/* Lignes de connexion animées */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <motion.path 
                d="M0,300 Q250,200 500,300 T1000,300"
                stroke="url(#gradient1)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path 
                d="M0,350 Q250,450 500,350 T1000,350"
                stroke="url(#gradient2)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Points lumineux statiques */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyrelis-mint rounded-full"
                style={{
                  left: `${5 + (i * 3.1) % 90}%`,
                  top: `${10 + (i * 2.7) % 80}%`,
                }}
                animate={{
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/50" />
          
          {/* Glow effects */}
          <motion.div 
            className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyrelis-mint/8 rounded-full blur-[120px]"
            animate={{ opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyrelis-blue/15 rounded-full blur-[100px]"
            animate={{ opacity: [0.4, 0.6, 0.4], x: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </div>
        
        <motion.div 
          className="container mx-auto px-4 max-w-6xl relative z-10 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Logo Cyrélis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute -inset-4 bg-cyrelis-mint/20 rounded-3xl blur-2xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <img 
                src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                alt="Logo Cyrélis"
                className="relative h-24 w-24 md:h-32 md:w-32 mx-auto rounded-3xl shadow-2xl shadow-cyrelis-mint/30 border-2 border-white/10 object-contain"
              />
            </div>
          </motion.div>

          {/* ACRONYME CY-RE-LIS - GRAND FORMAT */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center items-end gap-2 md:gap-4 mb-6"
            >
              {/* CY */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                className="relative group"
              >
                <motion.span 
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-heading text-white tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  style={{ textShadow: '0 0 60px rgba(45, 212, 191, 0.3)' }}
                >
                  CY
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-cyrelis-mint to-cyrelis-mint/50 rounded-full"
                />
              </motion.div>

              {/* RÉ */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                className="relative group"
              >
                <motion.span 
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-heading text-cyrelis-mint tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(45, 212, 191, 0.5)',
                      '0 0 60px rgba(45, 212, 191, 0.8)',
                      '0 0 20px rgba(45, 212, 191, 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  RÉ
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-cyrelis-mint/50 via-cyrelis-mint to-cyrelis-mint/50 rounded-full"
                />
              </motion.div>

              {/* LIS */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                className="relative group"
              >
                <motion.span 
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-heading text-white tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  style={{ textShadow: '0 0 60px rgba(45, 212, 191, 0.3)' }}
                >
                  LIS
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-cyrelis-mint/50 to-cyrelis-mint rounded-full"
                />
              </motion.div>
            </motion.div>

            {/* Labels sous l'acronyme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex justify-center gap-8 md:gap-16 lg:gap-24"
            >
              <div className="text-center">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-slate-400 font-medium">Cybersécurité</span>
              </div>
              <div className="text-center">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-cyrelis-mint font-semibold">Résilience</span>
              </div>
              <div className="text-center">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-slate-400 font-medium">Lisibilité</span>
              </div>
            </motion.div>
              </div>

          {/* Slogan */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Nous rendons la cybersécurité{" "}
            <span className="text-cyrelis-mint font-semibold">résiliente</span> et{" "}
            <span className="text-white font-semibold">lisible</span>.
          </motion.p>

          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="inline-flex items-center border border-cyrelis-mint/30 bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium text-white mb-10"
          >
            <motion.span 
              className="w-2 h-2 bg-cyrelis-mint rounded-full mr-3"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Protection managée pour TPE et indépendants
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
              <Link href="/simulateur">
              <Button className="h-16 px-10 bg-cyrelis-mint text-cyrelis-blue font-bold hover:bg-white transition-all duration-300 shadow-xl shadow-cyrelis-mint/30 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 rounded-xl text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Configurer mon offre
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
                <Link href="/a-propos">
              <Button
                className="h-16 px-10 bg-white/10 backdrop-blur-sm border-2 border-cyrelis-mint/50 text-white hover:bg-cyrelis-mint/20 hover:border-cyrelis-mint font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-cyrelis-mint/10"
              >
                Découvrir notre histoire
                <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION STATS - Après le scroll */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-cyrelis-blue text-white p-8 rounded-2xl shadow-xl shadow-cyrelis-blue/20 cursor-default text-center"
            >
              <motion.div 
                className="text-5xl font-bold mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                100%
              </motion.div>
              <div className="text-sm text-slate-300 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Données chiffrées
              </div>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg cursor-default text-center"
            >
              <motion.div 
                className="text-5xl font-bold text-slate-900 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                24/7
              </motion.div>
              <div className="text-sm text-slate-500 flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                Surveillance active
              </div>
            </motion.div>
            
            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg cursor-default text-center"
            >
              <motion.div 
                className="text-5xl font-bold text-slate-900 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                4h
              </motion.div>
              <div className="text-sm text-slate-500 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Temps de réponse
                    </div>
            </motion.div>
            
            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-cyrelis-mint/20 to-cyrelis-mint/5 p-8 rounded-2xl border border-cyrelis-mint/30 cursor-default text-center"
            >
              <motion.div 
                className="text-5xl font-bold text-cyrelis-blue mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {autonomyPrice}€
              </motion.div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                À partir de /user/mois
                    </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION PROBLÈME - Métriques avec animations */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-full mb-6">
                ⚠️ Alerte sécurité
              </span>
            </motion.div>
          <motion.h2 
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6"
            >
              Votre sécurité actuelle vous expose
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Fichiers Excel, post-its, mots de passe réutilisés — ces pratiques
              courantes sont des <strong className="text-red-600">portes ouvertes aux cyberattaques</strong>.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: RotateCcw,
                title: "Perte de temps récurrente",
                desc: "Combien de fois par semaine réinitialisez-vous un mot de passe oublié ?",
                metric: "3x",
                metricLabel: "/semaine",
                color: "orange",
              },
              {
                icon: Euro,
                title: "Coût d'un arrêt",
                desc: "Le coût moyen d'un arrêt d'activité suite à une cyberattaque pour une TPE.",
                metric: "3 000€",
                metricLabel: "/jour",
                color: "red",
              },
              {
                icon: AlertTriangle,
                title: "Risque de fermeture",
                desc: "60% des PME victimes de cyberattaque ferment dans les 6 mois.",
                metric: "60%",
                metricLabel: "",
                color: "red",
              },
            ].map((item, i) => (
                <motion.div 
                  key={i} 
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-100 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <item.icon
                      className={`w-6 h-6 text-${item.color}-500`}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  <div className="text-right">
                    <motion.span 
                      className={`text-3xl font-bold text-${item.color}-500`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    >
                      {item.metric}
                    </motion.span>
                    <span className="text-sm text-slate-400 ml-1">{item.metricLabel}</span>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LE SOCLE — Version améliorée, plus parlante */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <FloatingShapes variant="light" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
              <span className="text-sm font-semibold text-cyrelis-mint uppercase tracking-wider">Notre approche</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              Comment ça marche <span className="text-cyrelis-blue">concrètement</span> ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-2xl mx-auto">
              Deux étapes simples : on installe votre protection <span className="font-semibold text-slate-800">(une seule fois)</span>, puis on la maintient <span className="font-semibold text-slate-800">(chaque mois)</span>.
            </motion.p>
          </motion.div>

          {/* BUILD vs RUN - Design plus clair */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {/* Colonne BUILD */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-cyrelis-mint/10 via-cyrelis-mint/5 to-white p-8 md:p-10 rounded-3xl border-2 border-cyrelis-mint/30"
            >
              <div className="absolute top-6 right-6">
                <span className="px-4 py-1.5 bg-cyrelis-mint text-cyrelis-blue text-xs font-bold rounded-full uppercase tracking-wider">
                  Paiement unique
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white rounded-2xl border border-cyrelis-mint/30 shadow-sm">
                  <Wrench className="w-8 h-8 text-cyrelis-blue" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900">On Installe</h3>
                  <p className="text-sm text-cyrelis-mint font-medium">Phase BUILD</p>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                Nous auditons vos pratiques, déployons vos outils de sécurité et formons votre équipe. <strong className="text-slate-800">C'est la fondation de votre protection.</strong>
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { icon: Target, text: "Audit de vos pratiques actuelles" },
                  { icon: KeyRound, text: "Installation de votre coffre-fort de mots de passe" },
                  { icon: Users, text: "Formation et accompagnement de vos équipes" },
                  { icon: Shield, text: "Configuration de vos règles de sécurité" },
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-3 text-slate-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="p-2 bg-white rounded-lg border border-cyrelis-mint/20">
                      <item.icon className="w-4 h-4 text-cyrelis-mint" />
                    </div>
                    {item.text}
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 border-t border-cyrelis-mint/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{buildFee}€</span>
                  <span className="text-slate-500">+ {buildPerUser}€/utilisateur</span>
                    </div>
                <p className="text-sm text-slate-500 mt-2">Investissement initial, réglé une seule fois</p>
              </div>
            </motion.div>

            {/* Colonne RUN */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-cyrelis-blue via-cyrelis-blue to-slate-900 text-white p-8 md:p-10 rounded-3xl"
            >
              <div className="absolute top-6 right-6">
                <span className="px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
                  Abonnement mensuel
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <RefreshCcw className="w-8 h-8 text-cyrelis-mint" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">On Maintient</h3>
                  <p className="text-sm text-cyrelis-mint font-medium">Phase RUN</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                Nous veillons sur votre sécurité au quotidien. Mises à jour, support, surveillance — <strong className="text-white">vous n'avez plus à y penser.</strong>
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { icon: TrendingUp, text: "Mises à jour de sécurité automatiques" },
                  { icon: Headphones, text: "Support prioritaire par téléphone ou email" },
                  { icon: Target, text: "Surveillance continue de vos accès" },
                  { icon: BookOpen, text: "Rapports mensuels de sécurité" },
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-3 text-slate-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg border border-white/10">
                      <item.icon className="w-4 h-4 text-cyrelis-mint" />
                    </div>
                    {item.text}
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-300">À partir de</span>
                  <span className="text-4xl font-bold text-white">{autonomyPrice}€</span>
                  <span className="text-slate-300">/user/mois</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Sans engagement, ajustable selon vos besoins</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Produit phare : Bitwarden */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center bg-cyrelis-blue/10 text-cyrelis-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Outil principal
                </div>
                <h3 className="font-heading text-3xl font-bold text-slate-900 mb-4">
                  Bitwarden Enterprise
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Le gestionnaire de mots de passe n°1 des entreprises. Vos équipes partagent 
                  leurs accès en toute sécurité, sans post-its ni fichiers Excel.
                </p>
                <ul className="grid grid-cols-2 gap-3">
                  {[
                    "Coffre-fort illimité",
                    "Partage d'équipe sécurisé",
                    "Connexion double facteur",
                    "Compatible tous vos appareils",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-cyrelis-mint flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-cyrelis-mint/20 to-cyrelis-blue/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                    <div className="p-4 bg-cyrelis-blue rounded-xl w-fit mb-4">
                      <KeyRound className="w-12 h-12 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-sm text-slate-500 mb-1">Inclus dans toutes nos offres</div>
                    <div className="text-2xl font-bold text-slate-900">Licence complète</div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>

          {/* CTA */}
            <motion.div 
            initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Link href="/simulateur">
              <Button className="h-14 px-10 bg-cyrelis-blue text-white font-semibold hover:bg-slate-800 rounded-xl shadow-lg shadow-cyrelis-blue/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                Calculer mon tarif personnalisé
                <ChevronRight className="ml-2 h-5 w-5" strokeWidth={2} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FORMULES - Design épuré */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <AnimatedGradient variant="mint" />
        
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
              className="font-heading text-4xl font-bold text-slate-900 mb-4"
            >
              Choisissez votre niveau d'accompagnement
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600">
              Vous préférez gérer vous-même ou être totalement tranquille ?
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Offre Autonomie */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                  {autonomyOffer?.name ?? "Offre Autonomie"}
                </h3>
                <p className="text-slate-500">
                  {autonomyOffer?.shortDesc ?? "Vous gérez, nous maintenons."}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-900">
                    {autonomyPrice}
                  </span>
                  <span className="text-slate-500 text-lg">€/user/mois</span>
                </div>
                 </div>

              <ul className="space-y-4 mb-10">
                {(autonomyOffer?.features ?? [
                  "Licence Bitwarden Enterprise",
                  "Support par ticket (J+2)",
                  "Mises à jour de sécurité",
                  "Documentation complète",
                ]).map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/simulateur" className="block">
                <Button variant="outline" className="w-full h-14 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold rounded-xl text-lg">
                  Choisir Autonomie
                </Button>
              </Link>
            </motion.div>

            {/* Offre Partenaire */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className="relative bg-gradient-to-b from-white to-cyrelis-blue/5 rounded-3xl border-2 border-cyrelis-blue p-10 shadow-xl shadow-cyrelis-blue/10 hover:shadow-2xl hover:shadow-cyrelis-blue/20 transition-all duration-500"
            >
              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 text-sm font-bold bg-cyrelis-blue text-white rounded-full shadow-lg"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Recommandé
              </motion.div>

              <div className="mb-8 pt-4">
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                  {partnerOffer?.name ?? "Offre Partenaire"}
                </h3>
                <p className="text-slate-500">
                  {partnerOffer?.shortDesc ?? "Nous gérons, vous êtes sereins."}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-cyrelis-blue">
                    {partnerPrice}
                  </span>
                  <span className="text-slate-500 text-lg">€/user/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {(partnerOffer?.features ?? [
                  "Licence Bitwarden Enterprise",
                  "Support prioritaire (J+1)",
                  "Gestion complète par Cyrélis",
                  "Rapports mensuels de sécurité",
                  "Accès SSO & LDAP inclus",
                  "Formations utilisateurs",
                ]).map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyrelis-mint mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/simulateur" className="block">
                <Button className="w-full h-14 bg-cyrelis-blue hover:bg-slate-800 font-semibold rounded-xl text-lg shadow-lg shadow-cyrelis-blue/20">
                  Choisir Partenaire
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Module IA en option */}
          {iaModule && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Server className="w-6 h-6 text-cyrelis-mint" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{iaModule.name}</h4>
                    <p className="text-sm text-slate-400">{iaQuota}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-cyrelis-mint">+{iaPrice}€</span>
                  <span className="text-sm text-slate-400 ml-1">/user/mois</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TECHNOLOGIE BITWARDEN */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-gradient-to-r from-cyrelis-blue via-cyrelis-blue to-slate-900 relative overflow-hidden">
        {/* Effet de grille */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '25px 25px',
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
          >
            {/* Texte intro */}
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-6 h-6 text-cyrelis-mint" strokeWidth={1.5} />
              <span className="text-lg font-medium">Notre solution repose sur</span>
            </div>

            {/* Logo Bitwarden */}
            <motion.a 
              href="https://bitwarden.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl px-6 py-3 hover:bg-slate-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="https://i.postimg.cc/MTgXqH4z/vertical-blue-logo.png"
                alt="Bitwarden"
                className="h-10 w-auto"
              />
            </motion.a>

            {/* Séparateur */}
            <div className="hidden md:block w-px h-10 bg-white/20" />

            {/* Badges */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="px-3 py-1.5 bg-cyrelis-mint/20 text-cyrelis-mint rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">N°1 mondial</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs md:text-sm text-white font-medium whitespace-nowrap">Certifié SOC2</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs md:text-sm text-white font-medium whitespace-nowrap">Zero-Knowledge</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ILS NOUS FONT CONFIANCE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
              <span className="text-sm font-semibold text-cyrelis-blue uppercase tracking-wider">
                Ils nous font confiance
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyrelis-mint to-transparent" />
            </div>

            {/* Logos clients */}
            <div className="flex flex-wrap items-center justify-center gap-12">
              {/* Logo Terra */}
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <img 
                  src="https://i.postimg.cc/L4yZ04Nd/Capture-d-e-cran-2025-12-08-a-10-18-18.png"
                  alt="Terra"
                  className="h-12 w-auto object-contain"
                />
              </motion.div>

              {/* Placeholder pour futurs clients */}
              <motion.div 
                className="bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-center h-28 w-44"
                whileHover={{ borderColor: '#2dd4bf' }}
              >
                <span className="text-slate-400 text-sm text-center">Votre entreprise ?</span>
              </motion.div>
          </div>

            <p className="mt-8 text-slate-500 text-sm">
              Rejoignez les entreprises qui ont choisi de sécuriser leur activité avec Cyrélis
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ÉQUIPE - Section humanisée */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <FloatingShapes variant="light" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
           <motion.div
            initial="hidden"
            whileInView="visible"
             viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-10">
              <div className="flex items-center -space-x-4">
                <motion.div 
                  className="w-20 h-20 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-xl relative z-10"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <img
                    src="https://i.postimg.cc/MHyS7KRY/AO4A9978_MATTHIEU_V_20X30.jpg"
                    alt="Matthieu"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="w-20 h-20 rounded-2xl border-4 border-white bg-slate-800 overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img
                    src="https://i.postimg.cc/4NQGnyXv/RD049.jpg"
                    alt="Ethan"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                 </div>
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6"
            >
              Deux experts, <span className="text-cyrelis-mint">vos interlocuteurs directs</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              <strong className="text-slate-800">Matthieu</strong> vous accompagne au quotidien.{" "}
              <strong className="text-slate-800">Ethan</strong> construit votre infrastructure. 
              Pas de chatbot, pas de call center — <span className="text-cyrelis-blue font-semibold">vous nous parlez directement.</span>
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Link href="/a-propos">
                <Button
                  variant="outline"
                  className="h-14 px-8 border-2 border-slate-200 hover:border-slate-300 font-semibold rounded-xl text-lg"
                >
                 Découvrir notre histoire
                  <ChevronRight className="ml-2 h-5 w-5" strokeWidth={2} />
               </Button>
             </Link>
            </motion.div>
           </motion.div>
        </div>
      </section>
    </main>
  );
}
