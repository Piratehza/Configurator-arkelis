import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
  source: z.string().optional(), // D'où vient le contact (simulateur, page contact, etc.)
});

// POST - Envoyer un message de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Sauvegarder le contact en base de données (optionnel mais recommandé)
    let contactRecord = null;
    try {
      contactRecord = await prisma.contact.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          company: data.company || null,
          phone: data.phone || null,
          message: data.message,
          source: data.source || "website",
          status: "NEW",
        },
      });
    } catch (dbError) {
      // Si la table Contact n'existe pas, on continue quand même
      console.warn("⚠️ Impossible de sauvegarder le contact en DB:", dbError);
    }

    // Envoyer l'email de confirmation au client
    const confirmationSent = await sendContactConfirmationEmail(
      data.email,
      data.name
    );

    // Envoyer la notification à l'équipe
    const notificationSent = await sendContactNotificationEmail({
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      message: data.message,
      source: data.source,
    });

    // Log pour debug
    console.log("📧 Contact reçu:", {
      name: data.name,
      email: data.email,
      confirmationSent,
      notificationSent,
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

// GET - Récupérer les contacts (admin uniquement)
export async function GET(request: NextRequest) {
  // Vérification admin à ajouter si nécessaire
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const contacts = await prisma.contact.findMany({
      where: status ? { status: status as "NEW" | "READ" | "REPLIED" | "ARCHIVED" } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ contacts });
  } catch {
    // Si la table n'existe pas
    return NextResponse.json({ contacts: [], message: "Table Contact non disponible" });
  }
}

