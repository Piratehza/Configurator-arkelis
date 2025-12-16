import type { NextAuthConfig } from "next-auth";

// Configuration de base pour NextAuth (sans Prisma)
// Utilisée par le middleware Edge
export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
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

      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isClientRoute = nextUrl.pathname.startsWith("/espace-client");
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      // Si déjà connecté et sur page de login/register, rediriger
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL(userRole === "ADMIN" ? "/admin" : "/espace-client", nextUrl));
      }

      // Route admin : vérifier connexion + rôle ADMIN
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/espace-client", nextUrl));
        }
        return true;
      }

      // Route espace client : vérifier connexion
      if (isClientRoute) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CLIENT" | "PROSPECT";
      }
      return session;
    },
  },
  providers: [], // Providers ajoutés dans auth.ts
};

