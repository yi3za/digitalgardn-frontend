import { z } from "zod";

// Note (1-5)
const noteField = z
  .number("validation.numeric")
  .int("validation.numeric")
  .min(1, "validation.min.numeric")
  .max(5, "validation.max.numeric");

// Commentaire optionnel (20-500 caracteres)
const commentaireField = z
  .union([
    z
      .string("validation.string")
      .trim()
      .min(20, "validation.min.string")
      .max(500, "validation.max.string"),
    z.literal(""),
    z.undefined(),
  ])
  .optional();

// Schema pour creer un avis
export const storeAvisSchema = z.object({
  note: noteField,
  commentaire: commentaireField,
});
