import { z } from "zod";

// Schema de validation pour les langues en admin
export const langueSchema = z.object({
  nom: z
    .string()
    .min(1, "validation:validation.required")
    .max(255, "validation:validation.max.string"),
});
