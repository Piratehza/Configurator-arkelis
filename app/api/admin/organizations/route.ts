import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Liste toutes les organisations
export async function GET() {
  try {
    const session = await auth();
    console.log("Session:", JSON.stringify(session, null, 2));
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const organizations = await prisma.organization.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: `Erreur: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle organisation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("POST - Session user:", session?.user?.id, session?.user?.role);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    console.log("POST - Body received:", body);
    
    const { name, siret, address, city, postalCode, contactEmail, contactPhone } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Le nom de l'organisation est requis" },
        { status: 400 }
      );
    }

    // Créer le slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    // Convertir les chaînes vides en null
    const cleanString = (value: string | null | undefined): string | null => {
      if (!value || value.trim() === "") return null;
      return value.trim();
    };

    console.log("POST - Creating organization with slug:", slug);

    const organization = await prisma.organization.create({
      data: {
        name: name.trim(),
        slug,
        siret: cleanString(siret),
        address: cleanString(address),
        city: cleanString(city),
        postalCode: cleanString(postalCode),
        contactEmail: cleanString(contactEmail),
        contactPhone: cleanString(contactPhone),
        activeOffer: "NONE",
        offerStatus: "PENDING",
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    console.log("POST - Organization created:", organization.id);

    // Log d'audit - wrapped in try/catch to not fail the main operation
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "ORGANIZATION_CREATED",
          entity: "Organization",
          entityId: organization.id,
          newData: {
            name: organization.name,
            siret: organization.siret,
          },
        },
      });
    } catch (auditError) {
      console.error("Audit log error (non-blocking):", auditError);
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error creating organization:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error("Error stack:", errorStack);
    return NextResponse.json(
      { error: `Erreur: ${errorMessage}` },
      { status: 500 }
    );
  }
}

