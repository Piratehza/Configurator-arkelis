import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyrelis-blue text-slate-400 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* MARQUE */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white tracking-tight font-heading">
              Cyrélis
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Parce que nous rendons la <br/>
              <span className="text-cyrelis-mint font-medium">Cybersécurité Résiliente et Lisible.</span>
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-cyrelis-mint bg-cyrelis-mint/10 px-3 py-1 rounded-full w-fit">
              <ShieldCheck className="h-3 w-3" />
              <span>Systèmes Opérationnels</span>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider font-heading">Explorer</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/offres" className="hover:text-cyrelis-mint transition-colors">Le Socle</Link></li>
              <li><Link href="/simulateur" className="hover:text-cyrelis-mint transition-colors">Simulateur</Link></li>
              <li><Link href="/a-propos" className="hover:text-cyrelis-mint transition-colors">Notre Histoire</Link></li>
            </ul>
          </div>

          {/* LÉGAL */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider font-heading">Légal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">Conditions Générales (CGV)</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider font-heading">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cyrelis-mint" />
                <a href="mailto:contact@cyrelis.fr" className="hover:text-white transition-colors">contact@cyrelis.fr</a>
              </li>
              <li className="text-slate-500">
                Lundi - Vendredi<br/>
                09h00 - 18h00
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT BAR */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>&copy; {currentYear} Cyrélis. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             <span>Matthieu Vallet EI</span>
             <span>SIRET 945 200 129 00035</span>
             <span>59350 Saint-André-lez-Lille</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
