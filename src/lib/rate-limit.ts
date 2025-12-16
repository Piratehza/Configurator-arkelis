/**
 * Rate Limiting - Protection contre les attaques par force brute
 * 
 * Implémentation en mémoire (pour une seule instance)
 * En production multi-instances, utiliser Redis ou équivalent
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Store en mémoire (reset au redémarrage)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration par type d'action
const RATE_LIMITS = {
  // Login: 5 tentatives par 15 minutes, puis blocage 30 minutes
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  // Mot de passe oublié: 3 requêtes par heure
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 heure
    blockDurationMs: 60 * 60 * 1000, // 1 heure
  },
  // Reset password: 5 tentatives par heure
  resetPassword: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
  },
  // 2FA: 5 tentatives par 10 minutes
  twoFactor: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
  },
  // API générale: 100 requêtes par minute
  api: {
    maxAttempts: 100,
    windowMs: 60 * 1000,
    blockDurationMs: 60 * 1000,
  },
  // Contact form: 5 messages par heure
  contact: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
  },
} as const;

type RateLimitAction = keyof typeof RATE_LIMITS;

/**
 * Génère une clé unique pour le rate limiting
 */
function getKey(action: RateLimitAction, identifier: string): string {
  return `${action}:${identifier}`;
}

/**
 * Nettoie les entrées expirées (appelé périodiquement)
 */
function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    const config = RATE_LIMITS[key.split(':')[0] as RateLimitAction];
    if (!config) continue;
    
    // Supprimer si la fenêtre est passée et pas de blocage actif
    if (now - entry.firstAttempt > config.windowMs && (!entry.blockedUntil || now > entry.blockedUntil)) {
      rateLimitStore.delete(key);
    }
  }
}

// Nettoyage automatique toutes les 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpired, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // secondes avant reset
  blocked: boolean;
  blockedFor?: number; // secondes de blocage restantes
}

/**
 * Vérifie et incrémente le compteur de rate limiting
 * @param action Type d'action à limiter
 * @param identifier Identifiant unique (IP, email, userId)
 * @returns Résultat du rate limiting
 */
export function checkRateLimit(
  action: RateLimitAction,
  identifier: string
): RateLimitResult {
  const config = RATE_LIMITS[action];
  const key = getKey(action, identifier);
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // Vérifier si bloqué
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const blockedFor = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetIn: blockedFor,
      blocked: true,
      blockedFor,
    };
  }

  // Réinitialiser si la fenêtre est passée
  if (!entry || now - entry.firstAttempt > config.windowMs) {
    entry = { count: 0, firstAttempt: now };
  }

  // Incrémenter le compteur
  entry.count++;
  
  // Vérifier si limite atteinte
  if (entry.count > config.maxAttempts) {
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(key, entry);
    
    const blockedFor = Math.ceil(config.blockDurationMs / 1000);
    return {
      success: false,
      remaining: 0,
      resetIn: blockedFor,
      blocked: true,
      blockedFor,
    };
  }

  rateLimitStore.set(key, entry);

  const remaining = config.maxAttempts - entry.count;
  const resetIn = Math.ceil((entry.firstAttempt + config.windowMs - now) / 1000);

  return {
    success: true,
    remaining,
    resetIn,
    blocked: false,
  };
}

/**
 * Réinitialise le compteur pour un identifiant (après succès)
 */
export function resetRateLimit(action: RateLimitAction, identifier: string): void {
  const key = getKey(action, identifier);
  rateLimitStore.delete(key);
}

/**
 * Vérifie si un identifiant est actuellement bloqué
 */
export function isBlocked(action: RateLimitAction, identifier: string): boolean {
  const key = getKey(action, identifier);
  const entry = rateLimitStore.get(key);
  
  if (!entry?.blockedUntil) return false;
  
  return Date.now() < entry.blockedUntil;
}

/**
 * Helper pour extraire l'IP d'une requête Next.js
 */
export function getClientIP(request: Request): string {
  // Headers standards de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback
  return 'unknown';
}

/**
 * Crée une réponse d'erreur de rate limiting
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetIn.toString(),
    'Retry-After': (result.blockedFor || result.resetIn).toString(),
  });

  return new Response(
    JSON.stringify({
      error: 'Trop de tentatives',
      message: result.blocked
        ? `Vous avez été temporairement bloqué. Réessayez dans ${result.blockedFor} secondes.`
        : `Limite atteinte. Réessayez dans ${result.resetIn} secondes.`,
      retryAfter: result.blockedFor || result.resetIn,
    }),
    {
      status: 429,
      headers,
    }
  );
}

