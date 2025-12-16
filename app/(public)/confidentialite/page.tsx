"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Mail, Trash2 } from "lucide-react";

export default function ConfidentialitePage() {
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
                <Shield className="w-6 h-6 text-cyrelis-mint" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Politique de Confidentialité
              </h1>
            </div>
            <p className="text-slate-300">
              Comment nous protégeons vos données personnelles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Introduction
              </h2>
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Chez <strong>Cyrélis</strong>, la protection de vos données personnelles est une priorité. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
                  vos informations lorsque vous utilisez notre plateforme.
                </p>
                <p>
                  <strong>Responsable du traitement :</strong><br />
                  Vallet Matthieu - Cyrélis<br />
                  Rue de Lambersart, 59350 Saint-André-lez-Lille, France<br />
                  SIRET : 945 200 129 00035
                </p>
              </div>
            </motion.div>

            {/* Données collectées */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Données collectées
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>Nous collectons les données suivantes :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Données d'identification :</strong> nom, prénom, adresse email professionnelle</li>
                  <li><strong>Données d'entreprise :</strong> nom de l'entreprise, SIRET, adresse du siège</li>
                  <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages visitées</li>
                  <li><strong>Données de facturation :</strong> adresse de facturation, historique des transactions</li>
                </ul>
              </div>
            </motion.div>

            {/* Finalités */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Utilisation des données
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Créer et gérer votre compte client</li>
                  <li>Fournir les services de cybersécurité souscrits</li>
                  <li>Établir les factures et gérer les paiements</li>
                  <li>Vous envoyer des communications relatives à votre abonnement</li>
                  <li>Améliorer nos services et votre expérience utilisateur</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </div>
            </motion.div>

            {/* Base légale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Base légale du traitement
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>Le traitement de vos données repose sur :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>L'exécution du contrat :</strong> pour fournir les services souscrits</li>
                  <li><strong>L'obligation légale :</strong> conservation des factures, déclarations fiscales</li>
                  <li><strong>L'intérêt légitime :</strong> amélioration des services, sécurité de la plateforme</li>
                  <li><strong>Le consentement :</strong> pour les communications marketing (si applicable)</li>
                </ul>
              </div>
            </motion.div>

            {/* Sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Sécurité des données
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Chiffrement des données en transit (TLS/SSL)</li>
                  <li>Chiffrement des mots de passe (bcrypt)</li>
                  <li>Authentification sécurisée avec tokens JWT</li>
                  <li>Hébergement sur des serveurs sécurisés (Vercel, Supabase)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Journalisation des accès et des modifications</li>
                </ul>
              </div>
            </motion.div>

            {/* Conservation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Durée de conservation
              </h2>
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Données de compte :</strong> pendant la durée de la relation commerciale + 3 ans</li>
                  <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                  <li><strong>Données de connexion :</strong> 1 an</li>
                  <li><strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </motion.div>

            {/* Droits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-red-100">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Vos droits
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                </ul>
                <p className="pt-4">
                  Pour exercer ces droits, contactez-nous à :{" "}
                  <a href="mailto:contact@cyrelis.fr" className="text-cyrelis-blue hover:underline font-medium">
                    contact@cyrelis.fr
                  </a>
                </p>
                <p>
                  Vous pouvez également introduire une réclamation auprès de la CNIL :{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-cyrelis-blue hover:underline">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-cyrelis-blue/5 to-cyrelis-mint/5 rounded-2xl p-8 border border-cyrelis-mint/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-cyrelis-blue" />
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Contact DPO
                </h2>
              </div>
              <p className="text-slate-700 text-sm">
                Pour toute question concernant vos données personnelles :<br />
                <a href="mailto:contact@cyrelis.fr" className="text-cyrelis-blue hover:underline font-medium">
                  contact@cyrelis.fr
                </a>
              </p>
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
