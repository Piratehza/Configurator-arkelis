"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  HelpCircle,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  User,
  Shield,
  Settings
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Vue d'ensemble", href: "/espace-client", icon: LayoutDashboard },
  { name: "Mon abonnement", href: "/espace-client/abonnement", icon: CreditCard },
  { name: "Documents", href: "/espace-client/documents", icon: FileText },
  { name: "Support", href: "/espace-client/support", icon: HelpCircle },
];

const accountNavigation = [
  { name: "Mon profil", href: "/espace-client/profil", icon: User },
  { name: "Sécurité", href: "/espace-client/securite", icon: Shield },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                <Image
                  src="https://i.postimg.cc/NMBBGpDL/Gemini-Generated-Image-9zcx399zcx399zcx.png"
                  alt="Logo Cyrélis"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading text-xl font-bold text-cyrelis-blue">Cyrélis</span>
                <p className="text-xs text-slate-500">Espace Client</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyrelis-blue flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {session?.user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/espace-client" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyrelis-mint/20 text-cyrelis-blue"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-cyrelis-mint" : ""}`} />
                  {item.name}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-cyrelis-mint" />}
                </Link>
              );
            })}
          </nav>

          {/* Account section */}
          <div className="p-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase mb-2 px-4">Mon compte</p>
            <div className="space-y-1">
              {accountNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-cyrelis-mint/20 text-cyrelis-blue"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-cyrelis-mint" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: window.location.origin + "/" })}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="font-heading text-lg font-bold text-slate-900 lg:hidden">
                Espace Client
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyrelis-mint rounded-full" />
              </button>

              {/* Help */}
              <Link href="/espace-client/support" className="hidden md:flex items-center gap-2 text-sm text-slate-600 hover:text-cyrelis-blue">
                <HelpCircle className="w-4 h-4" />
                Besoin d'aide ?
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


