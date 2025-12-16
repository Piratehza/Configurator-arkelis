import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail, verifyEmailConfig } from "@/lib/email";

// POST - Tester l'envoi d'email (admin uniquement)
export async function POST(request: NextRequest) {
  // Vérifier que c'est un admin
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const testEmail = body.email || session.user.email;

    if (!testEmail) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Vérifier la configuration SMTP
    const configOk = await verifyEmailConfig();
    
    if (!configOk) {
      return NextResponse.json({
        success: false,
        error: "Configuration SMTP incomplète ou invalide",
        hint: "Vérifie les variables SMTP_USER et SMTP_PASSWORD dans .env",
      }, { status: 500 });
    }

    // Envoyer un email de test
    const sent = await sendEmail({
      to: testEmail,
      subject: "🧪 Test SMTP Cyrélis - Ça fonctionne !",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="color: #0f172a;">✅ Test réussi !</h1>
          <p>Si tu reçois cet email, la configuration SMTP est correcte.</p>
          <p style="color: #64748b; font-size: 14px;">
            Envoyé depuis : ${process.env.SMTP_USER}<br>
            Date : ${new Date().toLocaleString("fr-FR")}
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 12px;">
            © ${new Date().getFullYear()} Cyrélis
          </p>
        </div>
      `,
    });

    if (sent) {
      return NextResponse.json({
        success: true,
        message: `Email de test envoyé à ${testEmail}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Échec de l'envoi",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur test email:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }, { status: 500 });
  }
}

// GET - Vérifier la configuration email
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSmtpUser = !!process.env.SMTP_USER;
  const hasSmtpPassword = !!process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT || "587";

  // Déterminer le mode
  const mode = hasResend ? "resend" : (hasSmtpUser && hasSmtpPassword) ? "smtp" : "none";

  // Tester la connexion
  let connectionOk = false;
  if (hasResend || (hasSmtpUser && hasSmtpPassword)) {
    connectionOk = await verifyEmailConfig();
  }

  return NextResponse.json({
    configured: hasResend || (hasSmtpUser && hasSmtpPassword),
    connectionOk,
    mode,
    config: {
      // Resend
      resendConfigured: hasResend,
      resendKey: hasResend ? `re_...${process.env.RESEND_API_KEY?.slice(-4)}` : null,
      // SMTP
      host: smtpHost,
      port: smtpPort,
      user: hasSmtpUser ? `${process.env.SMTP_USER?.substring(0, 3)}...` : null,
      passwordSet: hasSmtpPassword,
      // Common
      fromEmail: process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      fromName: process.env.EMAIL_FROM_NAME || process.env.SMTP_FROM_NAME || "Cyrélis",
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER,
    },
  });
}

