import { competencesField } from "@/features/auth/auth.schemas";
import { z } from "zod";

/**
 * Champs reutilisables pour les services
 */
const serviceTitreField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .max(255, "validation.max.string");
const serviceDescriptionField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .min(150, "validation.min.string")
  .max(600, "validation.max.string");
const servicePrixBaseField = z.coerce
  .number({ invalid_type_error: "validation.numeric" })
  .min(1, "validation.min.numeric");
const serviceDelaiLivraisonField = z.coerce
  .number({ invalid_type_error: "validation.integer" })
  .min(1, "validation.min.numeric")
  .int("validation.integer");
const serviceRevisionsField = z.coerce
  .number({ invalid_type_error: "validation.integer" })
  .min(0, "validation.min.numeric")
  .int("validation.integer")
  .nullable()
  .optional();
const categorieId = z
  .number({ invalid_type_error: "validation.integer" })
  .int("validation.integer")
  .positive("validation.integer");
const categoriesField = z
  .array(categorieId, {
    required_error: "validation.required",
    invalid_type_error: "validation.array",
  })
  .min(1, "validation.required")
  .max(5, "validation.max.array")
  .refine((items) => new Set(items).size === items.length, {
    message: "validation.distinct",
  });
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const existingFichierField = z.object({
  type: z.literal("existing"),
  id: z.number({ invalid_type_error: "validation.integer" }).positive(),
  url: z.string("validation.string").min(1, "validation.required"),
});
const newFichierField = z.object({
  type: z.literal("new"),
  file: z
    .instanceof(File, { message: "validation.image" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "validation.max.file")
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "validation.mimes"),
});
const fichiersField = z
  .array(
    z.discriminatedUnion("type", [existingFichierField, newFichierField]),
    {
      required_error: "validation.required",
      invalid_type_error: "validation.array",
    },
  )
  .min(1, "validation.required")
  .max(10, "validation.max.array");

/**
 * Schema de validation pour les services freelance, utilise pour la creation et la mise a jour des services
 */
const serviceShema = z.object({
  titre: serviceTitreField,
  description: serviceDescriptionField,
  prix_base: servicePrixBaseField,
  delai_livraison: serviceDelaiLivraisonField,
  revisions: serviceRevisionsField,
  fichiers: fichiersField,
  competences: competencesField,
  categories: categoriesField,
});
/**
 * Schema de validation pour la creation d'un service freelance
 */
export const storeServiceSchema = serviceShema;
/**
 * Schema de validation pour la mise a jour d'un service freelance
 */
export const updateServiceSchema = serviceShema;
