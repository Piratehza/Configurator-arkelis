import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "Cyrélis <noreply@cyrelis.fr>";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email Templates
export const emailTemplates = {
  welcomeClient: (name: string) => ({
    subject: "Bienvenue chez Cyrélis 🛡️",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center; }
            .header h1 { color: #5eead4; margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 16px 16px; }
            .button { display: inline-block; background: #5eead4; color: #1e3a5f; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .highlight { background: #f0fdfa; border-left: 4px solid #5eead4; padding: 16px; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cyrélis</h1>
              <p style="color: #94a3b8; margin-top: 8px;">Cybersécurité Résiliente et Lisible</p>
            </div>
            <div class="content">
              <h2>Bienvenue ${name} ! 👋</h2>
              <p>Votre compte Cyrélis a été créé avec succès. Vous faites maintenant partie d'une communauté d'indépendants et TPE qui prennent leur sécurité au sérieux.</p>
              
              <div class="highlight">
                <strong>Prochaines étapes :</strong>
                <ul>
                  <li>Accédez à votre espace client</li>
                  <li>Configurez votre abonnement</li>
                  <li>Recevez vos accès Bitwarden</li>
                </ul>
              </div>

              <a href="${process.env.NEXTAUTH_URL}/espace-client" class="button">
                Accéder à mon espace
              </a>

              <p>Une question ? Répondez simplement à cet email.</p>
              <p>À très vite,<br><strong>Matthieu & Ethan</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cyrélis. Tous droits réservés.</p>
              <p>Cet email a été envoyé depuis une adresse automatique.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  subscriptionCreated: (name: string, total: number) => ({
    subject: "Votre abonnement Cyrélis est actif ✅",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center; }
            .header h1 { color: #5eead4; margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 16px 16px; }
            .button { display: inline-block; background: #5eead4; color: #1e3a5f; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .amount-box { background: #f0fdfa; padding: 24px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .amount { font-size: 36px; font-weight: bold; color: #1e3a5f; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Cyrélis</h1>
            </div>
            <div class="content">
              <h2>Félicitations ${name} !</h2>
              <p>Votre abonnement Cyrélis est maintenant actif. Votre protection commence dès aujourd'hui.</p>
              
              <div class="amount-box">
                <p style="margin: 0; color: #64748b;">Montant mensuel</p>
                <p class="amount">${total.toFixed(2)}€</p>
              </div>

              <p>Nous allons vous contacter dans les 24h pour procéder à l'installation de vos services.</p>

              <a href="${process.env.NEXTAUTH_URL}/espace-client/abonnement" class="button">
                Voir mon abonnement
              </a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cyrélis. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  licenseAdded: (name: string, productName: string, quantity: number, newTotal: number) => ({
    subject: `${quantity} licence(s) ajoutée(s) à votre abonnement`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center; }
            .header h1 { color: #5eead4; margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 16px 16px; }
            .highlight { background: #f0fdfa; border-left: 4px solid #5eead4; padding: 16px; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cyrélis</h1>
            </div>
            <div class="content">
              <h2>Modification de votre abonnement</h2>
              <p>Bonjour ${name},</p>
              <p>Vous venez d'ajouter <strong>${quantity} licence(s) ${productName}</strong> à votre abonnement.</p>
              
              <div class="highlight">
                <strong>Nouveau total mensuel :</strong> ${newTotal.toFixed(2)}€/mois
              </div>

              <p>Le montant sera proraté sur votre prochaine facture.</p>
              <p>Merci de votre confiance,<br><strong>L'équipe Cyrélis</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cyrélis. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  adminNotification: (title: string, message: string, actionUrl?: string) => ({
    subject: `[Admin] ${title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e293b; padding: 20px; border-radius: 12px 12px 0 0; }
            .header h1 { color: #f8fafc; margin: 0; font-size: 18px; }
            .content { background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #1e3a5f; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Notification Admin Cyrélis</h1>
            </div>
            <div class="content">
              <h2>${title}</h2>
              <p>${message}</p>
              ${actionUrl ? `<a href="${process.env.NEXTAUTH_URL}${actionUrl}" class="button">Voir les détails</a>` : ""}
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

