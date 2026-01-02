"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                alt="Logo Cyrélis"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className={`font-heading text-xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-slate-900" : "text-white"
            }`}>
              Cyrélis
            </span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: "/", label: "Accueil" },
              { href: "/simulateur", label: "Configurateur" },
              { href: "/a-propos", label: "Notre histoire" },
              { href: "/collecte-donnees", label: "Collecte données" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  scrolled 
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA BUTTON */}
          <div className="hidden md:flex items-center">
            <Link href="/simulateur">
              <Button 
                className={`h-11 font-semibold px-6 rounded-xl transition-all flex items-center gap-2 ${
                  scrolled 
                    ? "bg-slate-900 text-white hover:bg-slate-800" 
                    : "bg-white text-slate-900 hover:bg-white/90"
                }`}
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-colors ${
              scrolled 
                ? "hover:bg-slate-100 text-slate-900" 
                : "hover:bg-white/10 text-white"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden py-4 space-y-1 border-t ${
              scrolled ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900/95 backdrop-blur-xl"
            }`}
          >
            {[
              { href: "/", label: "Accueil" },
              { href: "/simulateur", label: "Configurateur" },
              { href: "/a-propos", label: "Notre histoire" },
              { href: "/collecte-donnees", label: "Collecte données" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  scrolled 
                    ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-200/20">
              <Link
                href="/simulateur"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyrelis-mint text-slate-900 font-semibold rounded-xl"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
