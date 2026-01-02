import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware simplifié - Site vitrine sans authentification
export function middleware(request: NextRequest) {
  // Pas de logique d'auth nécessaire pour un site vitrine
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Ne matcher que les routes API pour éviter le traitement inutile
    '/api/:path*',
  ],
};
