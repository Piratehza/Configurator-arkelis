"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, Euro, Clock, AlertTriangle, Scale } from "lucide-react";

export default function CGVPage() {
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
                <FileText className="w-6 h-6 text-cyrelis-mint" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Conditions Générales de Vente
              </h1>
            </div>
            <p className="text-slate-300">
              Conditions applicables aux services Cyrélis
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            {/* Préambule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Article 1 - Préambule
              </h2>
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations 
                  de services conclues entre :
                </p>
                <p>
                  <strong>Le Prestataire :</strong><br />
                  Vallet Matthieu - Cyrélis<br />
                  Entrepreneur individuel - SIRET : 945 200 129 00035<br />
                  Rue de Lambersart, 59350 Saint-André-lez-Lille, France
                </p>
                <p>
                  <strong>Et le Client :</strong><br />
                  Toute personne morale ou physique ayant souscrit un abonnement aux services Cyrélis.
                </p>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Article 2 - Services proposés
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>Cyrélis propose des services de cybersécurité managés (MSP) comprenant :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Protection des postes de travail (EDR/Antivirus)</li>
                  <li>Filtrage DNS et protection web</li>
                  <li>Sauvegarde des données (cloud et locale)</li>
                  <li>Gestion des mots de passe professionnels</li>
                  <li>Supervision et monitoring 24/7</li>
                  <li>Support technique et accompagnement</li>
                </ul>
                <p>
                  Le détail des services inclus dans chaque formule est disponible sur le site 
                  cyrelis.fr et dans le devis personnalisé remis au Client.
                </p>
              </div>
            </motion.div>

            {/* Tarifs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Article 3 - Tarifs et facturation
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  <strong>3.1 Tarification</strong><br />
                  Les tarifs sont exprimés en euros hors taxes (HT). La TVA applicable (20%) est ajoutée 
                  au montant HT. Les prix sont calculés selon le nombre d'utilisateurs/postes protégés 
                  et la formule choisie.
                </p>
                <p>
                  <strong>3.2 Facturation</strong><br />
                  La facturation est mensuelle, à terme échu. Les factures sont émises le 1er de chaque 
                  mois pour le mois écoulé et envoyées par email.
                </p>
                <p>
                  <strong>3.3 Paiement</strong><br />
                  Le règlement s'effectue par prélèvement automatique ou virement bancaire dans un délai 
                  de 30 jours à compter de la date de facture. Tout retard de paiement entraîne des 
                  pénalités de retard au taux légal en vigueur.
                </p>
              </div>
            </motion.div>

            {/* Durée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Article 4 - Durée et résiliation
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  <strong>4.1 Durée</strong><br />
                  L'abonnement est conclu pour une durée minimale de 12 mois à compter de la date 
                  de mise en service. Au-delà, le contrat se poursuit par tacite reconduction pour 
                  des périodes successives de 12 mois.
                </p>
                <p>
                  <strong>4.2 Résiliation</strong><br />
                  Le Client peut résilier son abonnement par lettre recommandée avec accusé de réception, 
                  moyennant un préavis de 3 mois avant la date anniversaire du contrat.
                </p>
                <p>
                  <strong>4.3 Résiliation anticipée</strong><br />
                  En cas de résiliation avant le terme de la période d'engagement, le Client reste 
                  redevable des mensualités restant dues jusqu'à la fin de la période minimale.
                </p>
              </div>
            </motion.div>

            {/* Responsabilité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Article 5 - Responsabilité
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  <strong>5.1 Obligations de moyens</strong><br />
                  Cyrélis s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la 
                  protection des systèmes du Client. Il s'agit d'une obligation de moyens et non 
                  de résultat.
                </p>
                <p>
                  <strong>5.2 Limitation de responsabilité</strong><br />
                  La responsabilité de Cyrélis est limitée au montant des sommes effectivement 
                  perçues au titre du contrat sur les 12 derniers mois. Cyrélis ne saurait être 
                  tenu responsable des dommages indirects, pertes de données ou préjudices 
                  consécutifs à une cyberattaque.
                </p>
                <p>
                  <strong>5.3 Force majeure</strong><br />
                  Cyrélis ne saurait être tenu responsable de l'inexécution de ses obligations 
                  en cas de force majeure telle que définie par la jurisprudence française.
                </p>
              </div>
            </motion.div>

            {/* Données */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">
                Article 6 - Propriété des données
              </h2>
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Le Client reste propriétaire de l'ensemble de ses données. À la fin du contrat, 
                  Cyrélis s'engage à restituer ou supprimer les données du Client dans un délai 
                  de 30 jours, selon le choix du Client.
                </p>
                <p>
                  Les données personnelles sont traitées conformément à notre Politique de 
                  Confidentialité et au RGPD.
                </p>
              </div>
            </motion.div>

            {/* Droit applicable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-red-100">
                  <Scale className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Article 7 - Droit applicable et litiges
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  Les présentes CGV sont régies par le droit français. En cas de litige, les parties 
                  s'efforceront de trouver une solution amiable.
                </p>
                <p>
                  À défaut d'accord amiable dans un délai de 30 jours, le litige sera soumis aux 
                  tribunaux compétents de Lille (France).
                </p>
              </div>
            </motion.div>

            {/* Liens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-cyrelis-blue/5 to-cyrelis-mint/5 rounded-2xl p-8 border border-cyrelis-mint/20"
            >
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
                Documents associés
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/mentions-legales" 
                  className="px-4 py-2 bg-white rounded-xl text-cyrelis-blue font-medium hover:bg-cyrelis-mint/10 transition-colors border border-slate-200"
                >
                  Mentions légales
                </Link>
                <Link 
                  href="/confidentialite" 
                  className="px-4 py-2 bg-white rounded-xl text-cyrelis-blue font-medium hover:bg-cyrelis-mint/10 transition-colors border border-slate-200"
                >
                  Politique de confidentialité
                </Link>
              </div>
            </motion.div>

            {/* Date */}
            <p className="text-center text-sm text-slate-500">
              Dernière mise à jour : 16 décembre 2025
            </p>

          </div>
        </div>
      </section>
    </main>
  );
}
