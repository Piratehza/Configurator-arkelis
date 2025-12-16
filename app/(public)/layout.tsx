import { Navbar } from "../../src/components/layout/Navbar";
import { Footer } from "../../src/components/layout/Footer";

// En mode "coming soon", on n'affiche PAS la navbar ni le footer
const SHOW_COMING_SOON = process.env.SHOW_COMING_SOON === "true";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Page "En construction" = rien d'autre que le contenu
  if (SHOW_COMING_SOON) {
    return <>{children}</>;
  }

  // Site complet = navbar + contenu + footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}


