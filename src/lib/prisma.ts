import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Configuration de la connexion PostgreSQL
const connectionString = process.env.DATABASE_URL!;

// Pool de connexions pg
const pool = new Pool({ connectionString });

// Adaptateur Prisma pour pg
const adapter = new PrismaPg(pool);

// PrismaClient avec adaptateur (Prisma 7+)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
