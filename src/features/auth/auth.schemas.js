import { z } from "zod";

/**
 * Schema de validation pour le formulaire de login
 * Utilisation de Zod pour valider les champs avec des cles de traduction
 */
export const loginSchema = z.object({
  email: z
    .string("validation.string")
    .trim()
    .min(1, "validation.required")
    .email("validation.email")
    .max(255, "validation.max.string")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "validation.regex",
    ),
  password: z.string().min(8, "validation.min.string"),
});

/**
 * Schema de validation pour le formulaire de register
 * Utilisation de Zod pour valider les champs avec des cles de traduction
 */
export const registerSchema = z
  .object({
    name: z
      .string("validation.string")
      .trim()
      .min(1, "validation.required")
      .max(255, "validation.max.string"),
    username: z
      .string("validation.string")
      .trim()
      .min(1, "validation.required")
      .min(3, "validation.min.string")
      .max(30, "validation.max.string")
      .regex(/^[a-zA-Z0-9_-]+$/, "validation.alpha_dash"),
    email: z
      .string("validation.string")
      .trim()
      .min(1, "validation.required")
      .email("validation.email")
      .max(255, "validation.max.string")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "validation.regex",
      ),
    password: z
      .string("validation.string")
      .min(8, "validation.min.string")
      .min(1, "validation.required"),
    password_confirmation: z
      .string("validation.string")
      .min(1, "validation.required"),
    role: z.enum(["freelance", "client"], { message: "validation.in" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "validation.confirmed",
    path: ["password_confirmation"],
  });
