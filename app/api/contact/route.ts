import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { 
  sendContactConfirmationEmail, 
  sendContactNotificationEmail 
} from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  source: z.string().optional(),
});

// POST - Envoyer un message de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    console.log("📧 Traitement demande de contact:", {
      name: data.name,
      email: data.email,
      source: data.source,
    });

    // Envoyer l'email de confirmation au client
    console.log("📤 Envoi confirmation au client...");
    const confirmationSent = await sendContactConfirmationEmail(
      data.email,
      data.name
    );
    console.log("📤 Confirmation client:", confirmationSent ? "✅ OK" : "❌ ÉCHEC");

    // Envoyer la notification à l'équipe Cyrélis
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    console.log("📤 Envoi notification à l'équipe:", adminEmail || "NON CONFIGURÉ");
    
    const notificationSent = await sendContactNotificationEmail({
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      message: data.message,
      source: data.source,
    });
    console.log("📤 Notification équipe:", notificationSent ? "✅ OK" : "❌ ÉCHEC");

    // Résumé
    console.log("📧 Résultat final:", {
      confirmationSent,
      notificationSent,
      adminEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.",
      emailSent: confirmationSent || notificationSent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: error.issues.map(e => e.message) 
        },
        { status: 400 }
      );
    }

    console.error("Erreur contact:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
