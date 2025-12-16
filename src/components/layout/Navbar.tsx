"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, User, Shield, ChevronDown, LayoutDashboard, Users, Settings } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "loading";
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO CYRÉLIS avec IMAGE */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image
                src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                alt="Logo Cyrélis"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-heading text-xl font-semibold text-cyrelis-blue tracking-tight group-hover:text-slate-900 transition-colors">
              Cyrélis
            </span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-cyrelis-blue transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/simulateur"
              className="text-sm font-medium text-slate-600 hover:text-cyrelis-blue transition-colors"
            >
              Simulateur
            </Link>
            <Link
              href="/a-propos"
              className="text-sm font-medium text-slate-600 hover:text-cyrelis-blue transition-colors"
            >
              Notre histoire
            </Link>
          </div>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="h-9 w-24 bg-slate-200 animate-pulse rounded" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* BOUTON ADMIN */}
                {isAdmin && (
                  <Link href="/admin">
                    <Button className="h-9 bg-amber-500 text-white hover:bg-amber-600 font-medium px-4 transition-all flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
                      Admin
                    </Button>
                  </Link>
                )}

                {/* BOUTON ESPACE CLIENT */}
                {!isAdmin && (
                  <Link href="/espace-client">
                    <Button
                      variant="outline"
                      className="h-9 border-cyrelis-blue text-cyrelis-blue hover:bg-cyrelis-blue hover:text-white font-medium px-4 transition-all"
                    >
                      Mon Espace
                    </Button>
                  </Link>
                )}

                {/* MENU UTILISATEUR */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <div
                      className={`h-7 w-7 rounded flex items-center justify-center ${
                        isAdmin ? "bg-amber-500" : "bg-cyrelis-blue"
                      }`}
                    >
                      {isAdmin ? (
                        <Shield className="h-4 w-4 text-white" strokeWidth={1.5} />
                      ) : (
                        <User className="h-4 w-4 text-cyrelis-mint" strokeWidth={1.5} />
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-slate-200 rounded-lg py-2 z-50 overflow-hidden"
                    >
                      {/* Entête utilisateur */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded flex items-center justify-center ${
                              isAdmin ? "bg-amber-500" : "bg-cyrelis-blue"
                            }`}
                          >
                            {isAdmin ? (
                              <Shield className="h-5 w-5 text-white" strokeWidth={1.5} />
                            ) : (
                              <User className="h-5 w-5 text-cyrelis-mint" strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {session.user.name || "Utilisateur"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${
                              isAdmin
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-cyrelis-mint/20 text-cyrelis-blue border border-cyrelis-mint/30"
                            }`}
                          >
                            {isAdmin ? (
                              <>
                                <Shield className="h-3 w-3" strokeWidth={1.5} />
                                Administrateur
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3" strokeWidth={1.5} />
                                Client
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        {isAdmin ? (
                          <>
                            <Link
                              href="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                              Dashboard
                            </Link>
                            <Link
                              href="/admin/clients"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                            >
                              <Users className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                              Gérer les clients
                            </Link>
                            <Link
                              href="/admin/settings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                            >
                              <Settings className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                              Paramètres
                            </Link>
                          </>
                        ) : (
                          <Link
                            href="/espace-client"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <User className="h-4 w-4 text-cyrelis-blue" strokeWidth={1.5} />
                            Mon Espace Client
                          </Link>
                        )}
                      </div>

                      {/* Déconnexion */}
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ redirect: true, callbackUrl: window.location.origin + "/" });
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.5} />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button className="h-9 bg-cyrelis-blue text-white hover:bg-slate-800 font-medium px-5 transition-all">
                  Se connecter
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-slate-200 py-4 space-y-2"
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/simulateur"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded transition-colors"
            >
              Simulateur
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded transition-colors"
            >
              Notre histoire
            </Link>

            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded flex items-center justify-center ${
                        isAdmin ? "bg-amber-500" : "bg-cyrelis-blue"
                      }`}
                    >
                      {isAdmin ? (
                        <Shield className="h-5 w-5 text-white" strokeWidth={1.5} />
                      ) : (
                        <User className="h-5 w-5 text-cyrelis-mint" strokeWidth={1.5} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {session.user.name || "Utilisateur"}
                      </p>
                      <p className="text-xs text-slate-500">{session.user.email}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <>
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded transition-colors font-medium"
                      >
                        <LayoutDashboard className="h-5 w-5" strokeWidth={1.5} />
                        Dashboard Admin
                      </Link>
                      <Link
                        href="/admin/clients"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded transition-colors"
                      >
                        <Users className="h-5 w-5" strokeWidth={1.5} />
                        Gérer les clients
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/espace-client"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-cyrelis-blue bg-cyrelis-mint/10 hover:bg-cyrelis-mint/20 rounded transition-colors font-medium"
                    >
                      <User className="h-5 w-5" strokeWidth={1.5} />
                      Mon Espace Client
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ redirect: true, callbackUrl: window.location.origin + "/" });
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <LogOut className="h-5 w-5" strokeWidth={1.5} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-cyrelis-blue text-white text-center font-medium rounded"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
