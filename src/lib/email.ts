/**
 * Service d'envoi d'emails
 * 
 * Supporte 2 modes :
 * 1. Resend (recommandé) - API moderne et simple
 * 2. SMTP classique (nodemailer) - Pour serveurs SMTP compatibles
 * 
 * Configuration Resend (.env) :
 * - RESEND_API_KEY=re_xxxxx
 * - EMAIL_FROM=noreply@votredomaine.com
 * - EMAIL_FROM_NAME=Cyrélis
 * 
 * Configuration SMTP (.env) :
 * - SMTP_HOST=smtp.example.com
 * - SMTP_PORT=587
 * - SMTP_USER=user
 * - SMTP_PASSWORD=password
 */

import nodemailer from "nodemailer";

// Détecter le mode d'envoi
const useResend = !!process.env.RESEND_API_KEY;
const useSmtp = !!process.env.SMTP_USER && !!process.env.SMTP_PASSWORD;

// Configuration SMTP (fallback)
const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// Créer le transporteur SMTP
const transporter = useSmtp ? nodemailer.createTransport(smtpConfig) : null;

// Vérifier la configuration au démarrage
export async function verifyEmailConfig(): Promise<boolean> {
  if (useResend) {
    console.log("✅ Mode Resend activé");
    return true;
  }
  
  if (!useSmtp) {
    console.warn("⚠️ Aucune configuration email - emails désactivés");
    return false;
  }
  
  try {
    await transporter?.verify();
    console.log("✅ Connexion SMTP vérifiée");
    return true;
  } catch (error) {
    console.error("❌ Erreur connexion SMTP:", error);
    return false;
  }
}

// Interface pour les options d'email
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Fonction principale d'envoi
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "noreply@cyrelis.fr";
  const fromName = process.env.EMAIL_FROM_NAME || process.env.SMTP_FROM_NAME || "Cyrélis";

  // Mode Resend (prioritaire)
  if (useResend) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Email envoyé via Resend:", data.id);
        return true;
      } else {
        const error = await response.json();
        console.error("❌ Erreur Resend:", error);
        return false;
      }
    } catch (error) {
      console.error("❌ Erreur envoi Resend:", error);
      return false;
    }
  }

  // Mode SMTP
  if (useSmtp && transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log("✅ Email envoyé via SMTP:", info.messageId);
      return true;
    } catch (error) {
      console.error("❌ Erreur envoi SMTP:", error);
      return false;
    }
  }

  // Aucune configuration
  console.warn("⚠️ Email non configuré, message non envoyé:", options.subject);
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Email simulé:");
    console.log("   To:", options.to);
    console.log("   Subject:", options.subject);
  }
  return false;
}

// ============================================
// TEMPLATES D'EMAILS
// ============================================

// Header commun à tous les emails - Design Cyber-Defense Premium
const emailHeader = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Cyrélis</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: light; }
    body { 
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif; 
      line-height: 1.7; 
      color: #1e293b; 
      margin: 0; 
      padding: 0; 
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      -webkit-font-smoothing: antialiased;
    }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 580px; margin: 0 auto; }
    .header { 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
      padding: 32px 40px; 
      border-radius: 16px 16px 0 0;
      text-align: center;
    }
    .logo-container { display: inline-block; }
    .logo-text { 
      font-size: 32px; 
      font-weight: 800; 
      color: #ffffff; 
      letter-spacing: -0.5px;
      margin: 0;
    }
    .logo-accent { color: #2dd4bf; }
    .logo-tagline {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-top: 8px;
    }
    .card { 
      background: #ffffff; 
      padding: 40px; 
      border-radius: 0 0 16px 16px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }
    .icon-badge {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 28px;
    }
    h1 { 
      font-size: 22px; 
      color: #0f172a; 
      margin: 0 0 8px;
      font-weight: 700;
      text-align: center;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      margin: 0 0 32px;
    }
    p { margin: 0 0 16px; color: #475569; font-size: 15px; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { 
      display: inline-block; 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
      color: #ffffff !important; 
      text-decoration: none; 
      padding: 16px 40px; 
      border-radius: 10px; 
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 4px 14px 0 rgba(15,23,42,0.3);
      transition: transform 0.2s;
    }
    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fef3c7;
      color: #92400e;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin: 24px 0;
    }
    .highlight { 
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 20px; 
      border-radius: 12px; 
      border-left: 4px solid #2dd4bf; 
      margin: 24px 0; 
    }
    .highlight p { margin: 0; color: #065f46; }
    .warning {
      background: #fef2f2;
      padding: 16px 20px;
      border-radius: 12px;
      border-left: 4px solid #ef4444;
      margin: 24px 0;
    }
    .warning p { margin: 0; color: #991b1b; font-size: 13px; }
    .info-box { background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0; }
    .info-row { display: flex; margin-bottom: 12px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-label { font-weight: 600; color: #0f172a; min-width: 120px; font-size: 13px; }
    .info-value { color: #64748b; font-size: 13px; }
    .divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
    .link-fallback {
      background: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      margin-top: 24px;
      word-break: break-all;
    }
    .link-fallback p { font-size: 12px; color: #64748b; margin: 0 0 8px; }
    .link-fallback a { color: #0f172a; font-size: 12px; font-family: monospace; }
    .footer { 
      text-align: center; 
      padding: 32px 40px;
      color: #94a3b8; 
      font-size: 13px;
    }
    .footer-links { margin-bottom: 16px; }
    .footer-links a { color: #64748b; text-decoration: none; margin: 0 12px; }
    .footer-brand { 
      font-size: 11px; 
      text-transform: uppercase; 
      letter-spacing: 2px;
      color: #cbd5e1;
    }
    .social-links { margin: 16px 0; }
    .social-links a { 
      display: inline-block; 
      width: 32px; 
      height: 32px; 
      background: #f1f5f9; 
      border-radius: 8px; 
      margin: 0 4px;
      line-height: 32px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <p class="logo-text">Cyr<span class="logo-accent">é</span>lis</p>
          <p class="logo-tagline">Cybersécurité • Résilience • Lisibilité</p>
        </div>
      </div>
      <div class="card">
`;

const emailFooter = `
      </div>
      <div class="footer">
        <p class="footer-brand">Protection managée pour TPE/PME</p>
        <p style="margin-top: 16px;">© ${new Date().getFullYear()} Cyrélis. Tous droits réservés.</p>
        <p style="font-size: 11px; color: #cbd5e1; margin-top: 8px;">
          Cet email a été envoyé depuis un système automatisé sécurisé.<br>
          Ne partagez jamais vos codes de sécurité avec qui que ce soit.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================
// EMAILS SPÉCIFIQUES
// ============================================

/**
 * Email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string
): Promise<boolean> {
  const html = `
${emailHeader}
        <div class="icon-badge">🔐</div>
        <h1>Réinitialisation de mot de passe</h1>
        <p class="subtitle">Une demande a été effectuée pour votre compte</p>
        
        <p>Bonjour${userName ? ` <strong>${userName}</strong>` : ""},</p>
        <p>Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte Cyrélis.</p>
        
        <div class="button-container">
          <a href="${resetUrl}" class="button">🔑 Créer un nouveau mot de passe</a>
        </div>
        
        <div class="highlight">
          <p><strong>⏱️ Validité limitée</strong><br>
          Ce lien sécurisé expire dans <strong>1 heure</strong> pour votre protection.</p>
        </div>
        
        <div class="warning">
          <p><strong>⚠️ Vous n'êtes pas à l'origine de cette demande ?</strong><br>
          Ignorez simplement cet email. Votre mot de passe actuel reste inchangé et votre compte est en sécurité.</p>
        </div>
        
        <div class="divider"></div>
        
        <div class="link-fallback">
          <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <a href="${resetUrl}">${resetUrl}</a>
        </div>
${emailFooter}
  `;

  const text = `
Réinitialisation de votre mot de passe

Bonjour${userName ? ` ${userName}` : ""},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur ce lien pour définir un nouveau mot de passe :
${resetUrl}

Ce lien expire dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

---
Cyrélis - Cybersécurité • Résilience • Lisibilité
  `;

  return sendEmail({
    to,
    subject: "🔐 Réinitialisation de votre mot de passe - Cyrélis",
    html,
    text,
  });
}

/**
 * Email de confirmation de contact
 */
export async function sendContactConfirmationEmail(
  to: string,
  name: string
): Promise<boolean> {
  const html = `
${emailHeader}
      <h1>Merci pour votre message !</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons bien reçu votre demande de contact et nous vous en remercions.</p>
      
      <div class="highlight">
        <p style="margin: 0;">Notre équipe vous répondra dans les <strong>24 à 48 heures ouvrées</strong>.</p>
      </div>
      
      <p>En attendant, n'hésitez pas à consulter notre <a href="${process.env.NEXTAUTH_URL || "https://cyrelis.fr"}/simulateur" style="color: #2dd4bf;">simulateur de tarifs</a> pour estimer votre projet.</p>
      
      <p>À très bientôt !</p>
      <p><strong>L'équipe Cyrélis</strong></p>
${emailFooter}
  `;

  return sendEmail({
    to,
    subject: "✅ Nous avons bien reçu votre message - Cyrélis",
    html,
  });
}

/**
 * Email de notification pour l'équipe (nouveau contact)
 */
export async function sendContactNotificationEmail(
  contactData: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    source?: string;
  }
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.warn("⚠️ Pas d'email admin configuré pour les notifications");
    return false;
  }

  const html = `
${emailHeader}
      <h1>🔔 Nouveau contact reçu</h1>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Nom :</span>
          <span class="info-value">${contactData.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email :</span>
          <span class="info-value"><a href="mailto:${contactData.email}" style="color: #2dd4bf;">${contactData.email}</a></span>
        </div>
        ${contactData.company ? `
        <div class="info-row">
          <span class="info-label">Entreprise :</span>
          <span class="info-value">${contactData.company}</span>
        </div>
        ` : ""}
        ${contactData.phone ? `
        <div class="info-row">
          <span class="info-label">Téléphone :</span>
          <span class="info-value"><a href="tel:${contactData.phone}" style="color: #2dd4bf;">${contactData.phone}</a></span>
        </div>
        ` : ""}
        ${contactData.source ? `
        <div class="info-row">
          <span class="info-label">Source :</span>
          <span class="info-value">${contactData.source}</span>
        </div>
        ` : ""}
      </div>
      
      <h2 style="font-size: 18px; margin-top: 30px;">Message :</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
${contactData.message}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${contactData.email}?subject=Re: Votre demande - Cyrélis" class="button">
          Répondre à ${contactData.name}
        </a>
      </div>
${emailFooter}
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 Nouveau contact : ${contactData.name}${contactData.company ? ` (${contactData.company})` : ""}`,
    html,
  });
}

/**
 * Email de demande de devis
 */
export async function sendQuoteRequestEmail(
  quoteData: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    users: number;
    offerType: string;
    buildTotal: number;
    runMonthly: number;
    extras?: string[];
    message?: string;
  }
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) return false;

  const html = `
${emailHeader}
      <h1>📋 Nouvelle demande de devis</h1>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Contact :</span>
          <span class="info-value">${quoteData.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email :</span>
          <span class="info-value"><a href="mailto:${quoteData.email}" style="color: #2dd4bf;">${quoteData.email}</a></span>
        </div>
        ${quoteData.company ? `
        <div class="info-row">
          <span class="info-label">Entreprise :</span>
          <span class="info-value">${quoteData.company}</span>
        </div>
        ` : ""}
        ${quoteData.phone ? `
        <div class="info-row">
          <span class="info-label">Téléphone :</span>
          <span class="info-value">${quoteData.phone}</span>
        </div>
        ` : ""}
      </div>
      
      <h2 style="font-size: 18px; margin-top: 30px;">Configuration demandée :</h2>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Utilisateurs :</span>
          <span class="info-value"><strong>${quoteData.users}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Offre :</span>
          <span class="info-value">${quoteData.offerType}</span>
        </div>
        ${quoteData.extras && quoteData.extras.length > 0 ? `
        <div class="info-row">
          <span class="info-label">Options :</span>
          <span class="info-value">${quoteData.extras.join(", ")}</span>
        </div>
        ` : ""}
      </div>
      
      <div style="display: flex; gap: 20px; margin: 30px 0;">
        <div style="flex: 1; background: #0f172a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">BUILD (One-Shot)</p>
          <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700;">${quoteData.buildTotal.toLocaleString("fr-FR")} €</p>
        </div>
        <div style="flex: 1; background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #059669; font-size: 12px;">RUN (Mensuel)</p>
          <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #059669;">${quoteData.runMonthly.toLocaleString("fr-FR")} €</p>
        </div>
      </div>
      
      ${quoteData.message ? `
      <h2 style="font-size: 18px; margin-top: 30px;">Message :</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
${quoteData.message}
      </div>
      ` : ""}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${quoteData.email}?subject=Votre devis Cyrélis - ${quoteData.users} utilisateurs" class="button">
          Envoyer le devis
        </a>
      </div>
${emailFooter}
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📋 Demande de devis : ${quoteData.name} - ${quoteData.users} utilisateurs`,
    html,
  });
}

/**
 * Email de bienvenue après création de compte
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  loginUrl?: string
): Promise<boolean> {
  const url = loginUrl || `${process.env.NEXTAUTH_URL || "https://cyrelis.fr"}/login`;
  
  const html = `
${emailHeader}
      <h1>Bienvenue chez Cyrélis ! 🎉</h1>
      <p>Bonjour ${name},</p>
      <p>Votre compte a été créé avec succès. Vous pouvez maintenant accéder à votre espace client.</p>
      
      <div style="text-align: center;">
        <a href="${url}" class="button">Accéder à mon espace</a>
      </div>
      
      <div class="highlight">
        <p style="margin: 0 0 8px;"><strong>🔐 Sécurité recommandée</strong></p>
        <p style="margin: 0;">Nous vous recommandons d'activer l'authentification à deux facteurs (2FA) pour sécuriser votre compte.</p>
      </div>
      
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>À bientôt !<br><strong>L'équipe Cyrélis</strong></p>
${emailFooter}
  `;

  return sendEmail({
    to,
    subject: "🎉 Bienvenue chez Cyrélis !",
    html,
  });
}

/**
 * Email de notification 2FA réinitialisée
 */
export async function send2FAResetNotificationEmail(
  to: string,
  name: string
): Promise<boolean> {
  const html = `
${emailHeader}
      <h1>Authentification 2FA réinitialisée</h1>
      <p>Bonjour ${name},</p>
      <p>Votre authentification à deux facteurs (2FA) a été réinitialisée par un administrateur.</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>⚠️ Action requise</strong></p>
        <p style="margin: 8px 0 0;">Lors de votre prochaine connexion, vous devrez reconfigurer votre 2FA pour sécuriser votre compte.</p>
      </div>
      
      <p>Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement notre équipe.</p>
      
      <p>Cordialement,<br><strong>L'équipe Cyrélis</strong></p>
${emailFooter}
  `;

  return sendEmail({
    to,
    subject: "🔐 Votre 2FA a été réinitialisée - Cyrélis",
    html,
  });
}
