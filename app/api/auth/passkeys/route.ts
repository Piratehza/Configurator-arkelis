import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPasskeys, deletePasskey } from "@/lib/passkeys";

// GET - Liste les passkeys de l'utilisateur connecté
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const passkeys = await getUserPasskeys(session.user.id);

    return NextResponse.json({ passkeys });
  } catch (error) {
    console.error("Erreur liste passkeys:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des passkeys" },
      { status: 500 }
    );
  }
}

// DELETE - Supprime une passkey
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const passkeyId = searchParams.get("id");

    if (!passkeyId) {
      return NextResponse.json(
        { error: "ID de passkey requis" },
        { status: 400 }
      );
    }

    const success = await deletePasskey(session.user.id, passkeyId);

    if (!success) {
      return NextResponse.json(
        { error: "Passkey non trouvée ou non autorisé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Passkey supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression passkey:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

