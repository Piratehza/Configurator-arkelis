/**
 * Configuration des variables d'environnement
 * 
 * Ce fichier centralise et valide les variables d'environnement
 * avec des valeurs par défaut pour le développement.
 */

// Environnement actuel
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';
export const IS_STAGING = process.env.VERCEL_ENV === 'preview' || process.env.APP_ENV === 'staging';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// ============================================
// BASE URL
// ============================================
function getBaseUrl(): string {
  // En production, utiliser l'URL configurée
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Sur Vercel, utiliser l'URL automatique
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Par défaut, localhost
  return 'http://localhost:3000';
}

export const BASE_URL = getBaseUrl();

// ============================================
// WEBAUTHN / PASSKEYS
// ============================================
function getWebAuthnRpId(): string {
  // En production, utiliser le domaine configuré
  if (process.env.WEBAUTHN_RP_ID) {
    return process.env.WEBAUTHN_RP_ID;
  }
  
  // Extraire le hostname de l'URL de base
  try {
    const url = new URL(BASE_URL);
    // Pour localhost, retourner 'localhost'
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return 'localhost';
    }
    // Pour les autres, retourner le hostname
    return url.hostname;
  } catch {
    return 'localhost';
  }
}

export const WEBAUTHN_RP_ID = getWebAuthnRpId();
export const WEBAUTHN_RP_NAME = 'Cyrélis';

// ============================================
// SÉCURITÉ
// ============================================
export const TOTP_ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY;
export const TOTP_ENCRYPTION_ENABLED = !!TOTP_ENCRYPTION_KEY && TOTP_ENCRYPTION_KEY.length >= 32;

// Avertissement si pas de clé de chiffrement en production
if (IS_PRODUCTION && !TOTP_ENCRYPTION_ENABLED) {
  console.warn('⚠️ TOTP_ENCRYPTION_KEY non définie ou trop courte. Les secrets 2FA ne seront pas chiffrés.');
}

// ============================================
// EMAILS
// ============================================
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@cyrelis.fr',
  fromName: process.env.EMAIL_FROM_NAME || 'Cyrélis',
  adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@cyrelis.fr',
  
  // Resend
  resendApiKey: process.env.RESEND_API_KEY,
  
  // SMTP (fallback)
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
};

export const EMAIL_SERVICE_ENABLED = !!(EMAIL_CONFIG.resendApiKey || EMAIL_CONFIG.smtp.host);

// ============================================
// RATE LIMITING
// ============================================
export const RATE_LIMIT_CONFIG = {
  login: {
    maxAttempts: IS_DEVELOPMENT ? 100 : 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  forgotPassword: {
    maxAttempts: IS_DEVELOPMENT ? 100 : 3,
    windowMs: 60 * 60 * 1000, // 1 heure
    blockDurationMs: 60 * 60 * 1000,
  },
  twoFactor: {
    maxAttempts: IS_DEVELOPMENT ? 100 : 5,
    windowMs: 10 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
  },
};

// ============================================
// VALIDATION AU DÉMARRAGE
// ============================================
export function validateEnv(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Vérifications production
  if (IS_PRODUCTION) {
    if (!process.env.NEXTAUTH_SECRET) {
      warnings.push('NEXTAUTH_SECRET est requis en production');
    }
    if (!TOTP_ENCRYPTION_ENABLED) {
      warnings.push('TOTP_ENCRYPTION_KEY devrait être définie pour chiffrer les secrets 2FA');
    }
    if (!EMAIL_SERVICE_ENABLED) {
      warnings.push('Aucun service email configuré (RESEND_API_KEY ou SMTP)');
    }
    if (!process.env.WEBAUTHN_RP_ID) {
      warnings.push('WEBAUTHN_RP_ID devrait être définie pour les Passkeys');
    }
  }
  
  // Vérifications staging
  if (IS_STAGING) {
    if (!EMAIL_SERVICE_ENABLED) {
      warnings.push('Service email non configuré en staging');
    }
  }
  
  return { valid: warnings.length === 0, warnings };
}

// Log des avertissements au démarrage (côté serveur uniquement)
if (typeof window === 'undefined') {
  const { warnings } = validateEnv();
  if (warnings.length > 0) {
    console.log('');
    console.log('⚠️  Avertissements de configuration :');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }
}

