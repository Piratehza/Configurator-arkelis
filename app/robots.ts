import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cyrelis.fr';
  const isProduction = process.env.APP_ENV === 'production';

  // En staging/dev, on bloque les robots
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // En production, on autorise l'indexation
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/espace-client/',
          '/api/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-2fa',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

