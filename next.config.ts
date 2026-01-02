import type { NextConfig } from "next";

/**
 * Configuration Next.js avec sécurité renforcée
 * Headers HTTP stricts pour protection contre les attaques courantes
 */

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://i.postimg.cc https://*.supabase.co https://images.unsplash.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  // Empêche le navigateur de deviner le type MIME
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Empêche le clickjacking (iframe malveillante)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Active le filtre XSS du navigateur
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Force HTTPS pendant 2 ans
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Contrôle les informations envoyées lors de navigation
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Empêche les fonctionnalités sensibles
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  // Optimisations de build
  poweredByHeader: false, // Cache "X-Powered-By: Next.js"

  // Permettre les requêtes cross-origin en dev depuis n'importe quelle IP locale
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.20.10.4:3000",
    "http://176.10.20.4:3000",
    "http://192.168.1.*:3000",
  ],
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Headers de sécurité pour toutes les routes
  async headers() {
    return [
      {
        // Appliquer à toutes les routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Headers spécifiques pour les API
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

  // Redirections de sécurité
  async redirects() {
    return [
      // Forcer la suppression des trailing slashes
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
