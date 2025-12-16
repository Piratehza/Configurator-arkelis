import { redirect } from "next/navigation";
import HomeContent from "./home-content";
import ComingSoonPage from "./coming-soon/page";

// Cette variable contrôle si on affiche "En construction" ou le site complet
// En PRODUCTION : mettre true → affiche "En construction"
// En STAGING/DEV : mettre false → affiche le site complet
const SHOW_COMING_SOON = process.env.SHOW_COMING_SOON === "true";

export default function HomePage() {
  // Si on est en mode "coming soon", afficher la page de construction
  if (SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  // Sinon, afficher le site complet
  return <HomeContent />;
}
