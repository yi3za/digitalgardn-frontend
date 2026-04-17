import { z } from "zod";

// Validation du contenu d'un message
const messageContentField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .max(5000, "validation.max.string");

// Schema pour l'envoi d'un message
export const storeMessageSchema = z.object({
  content: messageContentField,
});
