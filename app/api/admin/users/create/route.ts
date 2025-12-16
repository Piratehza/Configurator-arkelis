import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schéma de validation
const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  userType: z.enum(["INTERNAL", "CLIENT"]).default("CLIENT"),
  // Organisation - soit existante, soit nouvelle
  organizationId: z.string().optional(),
  newOrganization: z.object({
    name: z.string().min(1, "Le nom de l'organisation est requis"),
    siret: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    postalCode: z.string().optional().or(z.literal("")),
    contactEmail: z.string().email("Email de contact invalide").optional().or(z.literal("")),
    contactPhone: z.string().optional().or(z.literal("")),
  }).optional(),
});

// POST - Créer un nouvel utilisateur (client ou interne)
export async function POST(request: NextRequest) {
  // Vérifier que l'utilisateur est admin
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Gérer l'organisation
    let organizationId = validatedData.organizationId;
    let organizationName = "";

    // Si nouvelle organisation à créer
    if (validatedData.newOrganization && !organizationId) {
      // Créer le slug à partir du nom
      const slug = validatedData.newOrganization.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now().toString(36);

      const newOrg = await prisma.organization.create({
        data: {
          name: validatedData.newOrganization.name,
          slug: slug,
          siret: validatedData.newOrganization.siret || null,
          address: validatedData.newOrganization.address || null,
          city: validatedData.newOrganization.city || null,
          postalCode: validatedData.newOrganization.postalCode || null,
          contactEmail: validatedData.newOrganization.contactEmail || validatedData.email,
          contactPhone: validatedData.newOrganization.contactPhone || null,
          activeOffer: "NONE",
          offerStatus: "PENDING",
        },
      });

      organizationId = newOrg.id;
      organizationName = newOrg.name;

      // Log d'audit pour la création d'organisation
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "ORGANIZATION_CREATED",
          entity: "Organization",
          entityId: newOrg.id,
          newData: {
            name: newOrg.name,
            siret: newOrg.siret,
          },
        },
      });
    } else if (organizationId) {
      // Récupérer le nom de l'organisation existante
      const existingOrg = await prisma.organization.findUnique({
        where: { id: organizationId },
      });
      organizationName = existingOrg?.name || "";
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        userType: validatedData.userType,
        role: validatedData.userType === "INTERNAL" ? "ADMIN" : "CLIENT",
        organizationId: organizationId || null,
        // Champs legacy pour compatibilité
        company: organizationName,
        // 2FA requis pour les utilisateurs internes
        twoFactorEnabled: false,
      },
      include: {
        organization: true,
      },
    });

    // Log d'audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_CREATED_BY_ADMIN",
        entity: "User",
        entityId: user.id,
        newData: {
          name: user.name,
          email: user.email,
          userType: user.userType,
          role: user.role,
          organizationId: user.organizationId,
        },
      },
    });

    // Créer une notification pour l'admin
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "SYSTEM_ALERT",
        title: validatedData.userType === "INTERNAL" ? "Nouveau membre interne" : "Nouveau client créé",
        message: `Le compte de ${user.name}${organizationName ? ` (${organizationName})` : ""} a été créé avec succès.`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création" },
      { status: 500 }
    );
  }
}
