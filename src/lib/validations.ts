/**
 * Schémas de validation Zod
 * 
 * SÉCURITÉ : Toutes les entrées utilisateur DOIVENT être validées
 * côté serveur avant toute opération sur la base de données.
 */

import { z } from "zod";

// ============================================
// REGEX DE VALIDATION
// ============================================

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const SIRET_REGEX = /^\d{14}$/;
const SIREN_REGEX = /^\d{9}$/;

// ============================================
// MESSAGES D'ERREUR PERSONNALISÉS
// ============================================

const ERRORS = {
  email: {
    required: "L'email est requis",
    invalid: "L'email n'est pas valide",
  },
  password: {
    required: "Le mot de passe est requis",
    min: "Le mot de passe doit contenir au moins 8 caractères",
    weak: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
  },
  name: {
    required: "Le nom est requis",
    min: "Le nom doit contenir au moins 2 caractères",
    max: "Le nom ne peut pas dépasser 100 caractères",
  },
  company: {
    required: "Le nom de l'entreprise est requis",
    min: "Le nom doit contenir au moins 2 caractères",
  },
  phone: {
    invalid: "Le numéro de téléphone n'est pas valide",
  },
  siret: {
    invalid: "Le SIRET doit contenir exactement 14 chiffres",
  },
};

// ============================================
// SCHÉMAS DE BASE (RÉUTILISABLES)
// ============================================

export const emailSchema = z
  .string({ error: ERRORS.email.required })
  .min(1, { message: ERRORS.email.required })
  .email({ message: ERRORS.email.invalid })
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string({ error: ERRORS.password.required })
  .min(8, { message: ERRORS.password.min });

export const strongPasswordSchema = z
  .string({ error: ERRORS.password.required })
  .min(8, { message: ERRORS.password.min })
  .regex(PASSWORD_REGEX, { message: ERRORS.password.weak });

export const nameSchema = z
  .string({ error: ERRORS.name.required })
  .min(2, { message: ERRORS.name.min })
  .max(100, { message: ERRORS.name.max })
  .trim();

export const companySchema = z
  .string({ error: ERRORS.company.required })
  .min(2, { message: ERRORS.company.min })
  .trim();

export const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, { message: ERRORS.phone.invalid })
  .optional()
  .or(z.literal(""));

export const siretSchema = z
  .string()
  .regex(SIRET_REGEX, { message: ERRORS.siret.invalid })
  .optional()
  .or(z.literal(""));

// ============================================
// SCHÉMAS AUTHENTIFICATION
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: ERRORS.password.required }),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    company: companySchema.optional().or(z.literal("")),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// ============================================
// SCHÉMAS ADMIN - CRÉATION UTILISATEUR
// ============================================

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  password: z.string().min(8, { message: ERRORS.password.min }),
  role: z.enum(["ADMIN", "CLIENT"]).default("CLIENT"),
});

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  company: companySchema.optional(),
  siret: siretSchema,
  address: z.string().max(500).optional(),
  role: z.enum(["ADMIN", "CLIENT", "PROSPECT"]).optional(),
});

// ============================================
// SCHÉMAS OFFRES / PRODUITS
// ============================================

export const createOfferSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["CORE", "ADDON", "SERVICE"]),
  priceMonthly: z.number().min(0),
  priceAnnual: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const updateOfferSchema = createOfferSchema.partial();

// ============================================
// SCHÉMAS ABONNEMENT
// ============================================

export const createSubscriptionSchema = z.object({
  userId: z.string().cuid(),
  offerId: z.string().cuid(),
  quantity: z.number().int().min(1).max(9999),
  billing: z.enum(["MONTHLY", "ANNUAL"]).default("MONTHLY"),
});

// ============================================
// SCHÉMAS CONTACT / SUPPORT
// ============================================

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema.optional(),
  phone: phoneSchema,
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(5000),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(10000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  category: z.enum(["TECHNICAL", "BILLING", "GENERAL", "FEATURE"]).default("GENERAL"),
});

// ============================================
// SCHÉMAS SIMULATEUR (Modèle LEGO BUILD/RUN)
// ============================================

export const simulatorSchema = z.object({
  users: z
    .number()
    .int({ message: "Le nombre d'utilisateurs doit être un entier" })
    .min(1, { message: "Minimum 1 utilisateur requis" })
    .max(500, { message: "Maximum 500 utilisateurs" }),
  offerType: z.enum(["AUTONOMY", "PARTNER"] as const),
  hasIA: z.boolean().default(false),
  selectedExtras: z.array(
    z.enum([
      "mfa_hardened",
      "audit_deep",
      "sso_config",
      "ldap_sync",
      "migration",
    ] as const)
  ).default([]),
});

// Schéma pour la validation côté API du devis
export const quoteRequestSchema = z.object({
  users: z.number().int().min(1).max(500),
  offerType: z.enum(["AUTONOMY", "PARTNER"]),
  hasIA: z.boolean(),
  selectedExtras: z.array(z.string()),
  // Informations contact
  contactName: nameSchema,
  contactEmail: emailSchema,
  companyName: companySchema.optional(),
  phone: phoneSchema,
  message: z.string().max(2000).optional(),
});

// ============================================
// HELPERS DE VALIDATION
// ============================================

/**
 * Valide et nettoie une entrée utilisateur
 * @throws ZodError si la validation échoue
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Valide sans lever d'exception
 * @returns { success: boolean, data?: T, error?: ZodError }
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Extrait les messages d'erreur d'un ZodError
 */
export function getErrorMessages(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

// ============================================
// SANITIZATION
// ============================================

/**
 * Nettoie une chaîne pour éviter les injections
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Supprime < et >
    .slice(0, 10000); // Limite la longueur
}

/**
 * Nettoie un objet récursivement
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return sanitized;
}

// Types exportés
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SimulatorInput = z.infer<typeof simulatorSchema>;

