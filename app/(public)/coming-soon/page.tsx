"use client";

import { motion } from "framer-motion";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1e3a5f] to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background subtil */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon points="25,0 50,14.4 50,43.4 25,57.8 0,43.4 0,14.4" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2dd4bf]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <img 
            src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
            alt="Cyrélis"
            className="h-32 w-32 md:h-40 md:w-40 mx-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Nom */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-[#2dd4bf]">CY</span>
          <span className="text-white">RÉ</span>
          <span className="text-[#2dd4bf]">LIS</span>
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-300 mb-12 font-light max-w-md mx-auto"
        >
          Nous rendons la cybersécurité{" "}
          <span className="text-[#2dd4bf] font-medium">résiliente</span> et{" "}
          <span className="text-white font-medium">lisible</span>.
        </motion.p>

        {/* Badge "En construction" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-500 text-sm"
        >
          Site en construction
        </motion.div>
      </div>
    </main>
  );
}
