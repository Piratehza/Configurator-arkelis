import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Configuration des polices
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXTAUTH_URL || 'https://cyrelis.fr';

export const metadata: Metadata = {
  // Métadonnées de base
  title: {
    default: "Cyrélis | Cybersécurité Résiliente et Lisible pour TPE",
    template: "%s | Cyrélis",
  },
  description: "Cyrélis rend la cybersécurité accessible aux TPE et indépendants. Gestion de mots de passe Bitwarden, authentification MFA, sauvegardes sécurisées. Partenaire officiel Bitwarden.",
  keywords: [
    "cybersécurité TPE",
    "sécurité informatique PME",
    "Bitwarden partenaire",
    "gestionnaire mots de passe entreprise",
    "MFA authentification",
    "sécurité données TPE",
    "MSP cybersécurité France",
    "protection données entreprise",
  ],
  authors: [{ name: "Cyrélis", url: baseUrl }],
  creator: "Cyrélis",
  publisher: "Cyrélis",
  
  // Configuration robots (complète le fichier robots.ts)
  robots: {
    index: process.env.APP_ENV === 'production',
    follow: process.env.APP_ENV === 'production',
    googleBot: {
      index: process.env.APP_ENV === 'production',
      follow: process.env.APP_ENV === 'production',
    },
  },

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "Cyrélis",
    title: "Cyrélis | Cybersécurité Résiliente et Lisible",
    description: "Nous rendons la cybersécurité accessible aux TPE et indépendants. Bitwarden, MFA, sauvegardes sécurisées.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Cyrélis - Cybersécurité pour TPE",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Cyrélis | Cybersécurité Résiliente et Lisible",
    description: "Nous rendons la cybersécurité accessible aux TPE et indépendants.",
    images: [`${baseUrl}/og-image.png`],
  },

  // Icônes
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Manifest PWA (optionnel)
  manifest: "/site.webmanifest",

  // Métadonnées supplémentaires
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  
  // Vérification Google Search Console (à remplir)
  // verification: {
  //   google: "votre-code-verification",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
