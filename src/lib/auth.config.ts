import type { NextAuthConfig } from "next-auth";

// Configuration NextAuth compatible Edge Runtime (sans Prisma)
// Utilisée par le middleware pour vérifier l'authentification

export const authConfig: NextAuthConfig = {
  trustHost: true, // Permet de fonctionner sur n'importe quel domaine/IP
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const twoFactorEnabled = auth?.user?.twoFactorEnabled;
      const twoFactorVerified = auth?.user?.twoFactorVerified;

      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isClientRoute = nextUrl.pathname.startsWith("/espace-client");
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
      const isApiRoute = nextUrl.pathname.startsWith("/api");
      const isTwoFactorPage = nextUrl.pathname === "/verify-2fa";
      const isForgotPassword = nextUrl.pathname.startsWith("/forgot-password");
      const isResetPassword = nextUrl.pathname.startsWith("/reset-password");

      // Ne pas bloquer les routes API
      if (isApiRoute) {
        return true;
      }

      // Permettre les pages de récupération de mot de passe
      if (isForgotPassword || isResetPassword) {
        return true;
      }

      // Si connecté mais 2FA en attente
      if (isLoggedIn && twoFactorEnabled && !twoFactorVerified) {
        // Permettre l'accès à la page de vérification 2FA
        if (isTwoFactorPage) {
          return true;
        }
        // Rediriger vers la vérification 2FA
        if (!isTwoFactorPage) {
          return Response.redirect(new URL("/verify-2fa", nextUrl));
        }
      }

      // Si connecté et sur page auth, rediriger
      if (isLoggedIn && isAuthRoute) {
        const redirectUrl = userRole === "ADMIN" ? "/admin" : "/espace-client";
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }

      // Empêcher l'accès à la page 2FA si pas besoin
      if (isTwoFactorPage) {
        if (!isLoggedIn || !twoFactorEnabled || twoFactorVerified) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        return true;
      }

      // Routes admin: vérifier le rôle
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/espace-client", nextUrl));
        }
        return true;
      }

      // Routes client: vérifier la connexion
      if (isClientRoute) {
        return isLoggedIn;
      }

      // Toutes les autres routes sont publiques
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = ((user as { role?: string }).role ?? "CLIENT") as "ADMIN" | "CLIENT" | "PROSPECT";
        token.twoFactorEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;
        token.userType = (user as { userType?: string }).userType ?? "CLIENT";
        // Si 2FA activé, non vérifié par défaut
        token.twoFactorVerified = !(user as { twoFactorEnabled?: boolean }).twoFactorEnabled;
      }
      
      // Mise à jour du token
      if (trigger === "update" && session) {
        if (session.twoFactorVerified !== undefined) {
          token.twoFactorVerified = session.twoFactorVerified;
        }
        if (session.name !== undefined) {
          token.name = session.name;
        }
      }
      
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CLIENT" | "PROSPECT";
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.twoFactorVerified = token.twoFactorVerified as boolean;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },
  providers: [], // Les providers sont définis dans auth.ts
};
