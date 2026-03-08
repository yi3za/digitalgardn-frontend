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
