import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// GET - Impersonate un utilisateur (Admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Vérifier que l'utilisateur actuel est admin
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  const { userId } = await params;

  try {
    // Récupérer l'utilisateur cible
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, company: true },
    });

    if (!targetUser) {
      return NextResponse.redirect(new URL("/admin?error=user_not_found", _request.url));
    }

    // Empêcher l'impersonation d'un autre admin
    if (targetUser.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin?error=cannot_impersonate_admin", _request.url));
    }

    // Log d'audit pour l'impersonation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_IMPERSONATE",
        entity: "User",
        entityId: targetUser.id,
        newData: {
          impersonatedUser: targetUser.email,
          impersonatedCompany: targetUser.company,
        },
      },
    });

    // Stocker l'ID admin original dans un cookie sécurisé
    const cookieStore = await cookies();
    cookieStore.set("impersonating_from", session.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 heure max
      path: "/",
    });

    cookieStore.set("impersonating_user", targetUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    // Rediriger vers l'espace client avec un paramètre
    return NextResponse.redirect(
      new URL(`/espace-client?impersonating=${encodeURIComponent(targetUser.company || targetUser.name || targetUser.email)}`, _request.url)
    );
  } catch (error) {
    console.error("Impersonation error:", error);
    return NextResponse.redirect(new URL("/admin?error=impersonation_failed", _request.url));
  }
}

