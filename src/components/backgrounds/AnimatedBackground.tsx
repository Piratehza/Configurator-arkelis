"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Grille de points animée - Style "Cyber Defense"
 */
export function GridBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Grille de points */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Lignes de scan horizontales */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 100px,
            rgba(45, 212, 191, 0.1) 100px,
            rgba(45, 212, 191, 0.1) 102px
          )`,
        }}
        animate={{ y: [0, 100] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/**
 * Formes géométriques flottantes
 */
export function FloatingShapes({ variant = "light" }: { variant?: "light" | "dark" }) {
  const shapes = [
    { size: 300, x: "10%", y: "20%", delay: 0, duration: 20 },
    { size: 200, x: "80%", y: "60%", delay: 2, duration: 25 },
    { size: 150, x: "60%", y: "10%", delay: 4, duration: 18 },
    { size: 250, x: "30%", y: "70%", delay: 1, duration: 22 },
  ];

  const baseColor = variant === "dark" ? "rgba(45, 212, 191, 0.05)" : "rgba(15, 23, 42, 0.02)";
  const accentColor = variant === "dark" ? "rgba(45, 212, 191, 0.08)" : "rgba(45, 212, 191, 0.05)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: i % 2 === 0 ? baseColor : accentColor,
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Lignes diagonales animées - Style "Tech"
 */
export function DiagonalLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.015]">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            #0f172a 40px,
            #0f172a 41px
          )`,
        }}
        animate={{ x: [0, 80] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/**
 * Gradient animé de fond
 */
export function AnimatedGradient({ 
  className = "",
  variant = "mint" 
}: { 
  className?: string;
  variant?: "mint" | "blue" | "mixed";
}) {
  const gradients = {
    mint: "from-cyrelis-mint/10 via-transparent to-transparent",
    blue: "from-cyrelis-blue/5 via-transparent to-transparent",
    mixed: "from-cyrelis-mint/10 via-cyrelis-blue/5 to-transparent",
  };

  return (
    <motion.div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className={`absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-radial ${gradients[variant]} blur-3xl rounded-full`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-radial ${gradients[variant]} blur-3xl rounded-full`}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/**
 * Effet de particules cyber
 */
export function CyberParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyrelis-mint/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Fond hexagonal - Style "Bouclier"
 */
export function HexagonBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id="hexagons"
            width="50"
            height="43.4"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2)"
          >
            <polygon
              points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
              fill="none"
              stroke="#0f172a"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
}

/**
 * Composition complète pour le hero
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <GridBackground />
      <FloatingShapes variant="light" />
      <AnimatedGradient variant="mixed" />
    </div>
  );
}

/**
 * Composition pour sections sombres
 */
export function DarkSectionBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <GridBackground className="opacity-50" />
      <FloatingShapes variant="dark" />
      <CyberParticles />
    </div>
  );
}

