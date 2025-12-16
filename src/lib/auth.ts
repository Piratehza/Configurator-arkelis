import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

// Liste des emails admin (depuis .env)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Permet de fonctionner sur n'importe quel domaine
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            image: true,
            twoFactorEnabled: true,
            userType: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Retourner les infos avec le statut 2FA
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          twoFactorEnabled: user.twoFactorEnabled,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user as { role?: UserRole }).role ?? "CLIENT";
        token.twoFactorEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;
        token.userType = (user as { userType?: string }).userType ?? "CLIENT";
        // Si 2FA est activé, marquer comme non vérifié
        token.twoFactorVerified = !(user as { twoFactorEnabled?: boolean }).twoFactorEnabled;
      }
      
      // Permettre la mise à jour du token via updateSession
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
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.twoFactorVerified = token.twoFactorVerified as boolean;
        session.user.userType = token.userType as string;
      }
      return session;
    },
    async signIn({ user }) {
      // Log de connexion pour audit
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_LOGIN",
            entity: "User",
            entityId: user.id,
          },
        });
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Assigner le rôle ADMIN si l'email est dans la liste
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
});
