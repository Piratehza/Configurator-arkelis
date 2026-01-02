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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cyrelis.fr';

export const metadata: Metadata = {
  title: {
    default: "Cyrélis | Cybersécurité Résiliente et Lisible pour TPE",
    template: "%s | Cyrélis",
  },
  description: "Cyrélis rend la cybersécurité accessible aux TPE et indépendants. Gestion de mots de passe Bitwarden, protection endpoints SentinelOne, supervision NinjaOne. Partenaire officiel.",
  keywords: [
    "cybersécurité TPE",
    "sécurité informatique PME",
    "Bitwarden partenaire",
    "SentinelOne France",
    "NinjaOne MSP",
    "gestionnaire mots de passe entreprise",
    "protection endpoints",
    "MSP cybersécurité France",
  ],
  authors: [{ name: "Cyrélis", url: baseUrl }],
  creator: "Cyrélis",
  publisher: "Cyrélis",
  
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: process.env.NODE_ENV === 'production',
    googleBot: {
      index: process.env.NODE_ENV === 'production',
      follow: process.env.NODE_ENV === 'production',
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "Cyrélis",
    title: "Cyrélis | Cybersécurité Résiliente et Lisible",
    description: "Nous rendons la cybersécurité accessible aux TPE et indépendants. Bitwarden, SentinelOne, NinjaOne.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Cyrélis - Cybersécurité pour TPE",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cyrélis | Cybersécurité Résiliente et Lisible",
    description: "Nous rendons la cybersécurité accessible aux TPE et indépendants.",
    images: [`${baseUrl}/og-image.png`],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
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
