import { z } from "zod";

// Schema de validation pour les categories en admin (slug auto-genere cote backend)
export const categorieSchema = z.object({
  nom: z
    .string()
    .min(1, "validation:validation.required")
    .max(100, "validation:validation.max.string"),
  description: z
    .string()
    .max(500, "validation:validation.max.string")
    .optional()
    .or(z.literal("")),
  parent_id: z.coerce.number().nullable().optional(),
  ordre: z.coerce
    .number()
    .int()
    .min(0, "validation:validation.min.numeric")
    .optional(),
  est_active: z.boolean().default(true),
});
