"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Building2, FileText, Scale, Mail, MapPin } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-cyrelis-gray pt-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-cyrelis-blue to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-cyrelis-mint hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/10">
                <Scale className="w-6 h-6 text-cyrelis-mint" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Mentions Légales
              </h1>
            </div>
            <p className="text-slate-300">
              Informations légales relatives au site cyrelis.fr
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            {/* Éditeur du site */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyrelis-blue/10">
                  <Building2 className="w-5 h-5 text-cyrelis-blue" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Éditeur du site
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nom commercial</p>
                    <p className="font-bold text-cyrelis-blue text-lg">Cyrélis</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Dénomination</p>
                    <p className="font-medium text-slate-900">Vallet Matthieu</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Forme juridique</p>
                    <p className="text-slate-700">Entrepreneur individuel</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date d'immatriculation au RNE</p>
                    <p className="text-slate-700">14/12/2025</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">SIREN</p>
                    <p className="font-mono text-slate-900">945 200 129</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">SIRET (établissement principal)</p>
                    <p className="font-mono text-slate-900">945 200 129 00035</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Code APE</p>
                    <p className="text-slate-700">6202A - Conseil en systèmes et logiciels informatiques</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Siège social</p>
                    <p className="text-slate-700">
                      Rue de Lambersart<br />
                      59350 Saint-André-lez-Lille<br />
                      FRANCE
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Directeur de la publication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Directeur de la publication
                </h2>
              </div>

              <p className="text-slate-700">
                <strong>Matthieu Vallet</strong><br />
                En qualité d'entrepreneur individuel
              </p>
            </motion.div>

            {/* Hébergement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Hébergement
                </h2>
              </div>

              <div className="space-y-2 text-slate-700">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789</p>
                <p>États-Unis</p>
                <p className="pt-2">
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-cyrelis-blue hover:underline">
                    https://vercel.com
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Contact
                </h2>
              </div>

              <div className="space-y-3 text-slate-700">
                <p>
                  Pour toute question relative au site ou à vos données personnelles :
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href="mailto:contact@cyrelis.fr" className="text-cyrelis-blue hover:underline font-medium">
                    contact@cyrelis.fr
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Propriété intellectuelle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Propriété intellectuelle
              </h2>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) 
                  est protégé par le droit d'auteur et le droit des marques.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                  des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans 
                  l'autorisation écrite préalable de Cyrélis.
                </p>
                <p>
                  Toute exploitation non autorisée du site ou de l'un des éléments qu'il contient sera 
                  considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions 
                  des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
                </p>
              </div>
            </motion.div>

            {/* Limitation de responsabilité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Limitation de responsabilité
              </h2>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Cyrélis ne pourra être tenu responsable des dommages directs et indirects causés au 
                  matériel de l'utilisateur, lors de l'accès au site, résultant de l'utilisation d'un 
                  matériel ne répondant pas aux spécifications techniques requises.
                </p>
                <p>
                  Cyrélis ne pourra également être tenu responsable des dommages indirects consécutifs 
                  à l'utilisation du site.
                </p>
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site 
                  est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des 
                  omissions ou des lacunes.
                </p>
              </div>
            </motion.div>

            {/* Liens vers autres pages légales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-cyrelis-blue/5 to-cyrelis-mint/5 rounded-2xl p-8 border border-cyrelis-mint/20"
            >
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
                Documents complémentaires
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/confidentialite" 
                  className="px-4 py-2 bg-white rounded-xl text-cyrelis-blue font-medium hover:bg-cyrelis-mint/10 transition-colors border border-slate-200"
                >
                  Politique de confidentialité
                </Link>
                <Link 
                  href="/cgv" 
                  className="px-4 py-2 bg-white rounded-xl text-cyrelis-blue font-medium hover:bg-cyrelis-mint/10 transition-colors border border-slate-200"
                >
                  Conditions Générales de Vente
                </Link>
              </div>
            </motion.div>

            {/* Date de mise à jour */}
            <p className="text-center text-sm text-slate-500">
              Dernière mise à jour : 16 décembre 2025
            </p>

          </div>
        </div>
      </section>
    </main>
  );
}
