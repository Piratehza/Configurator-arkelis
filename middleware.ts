import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware utilisant la configuration sans Prisma (compatible Edge)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Matcher toutes les routes sauf assets statiques
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
