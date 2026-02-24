import { AUTH_ERROR_TYPES } from "./auth.constants";

/**
 * Normalise la reponse d'erreur HTTP provenant du backend
 *
 * - 422 : erreurs de validation des donnees
 * - 401 : utilisateur non authentifie
 * - default : erreur serveur ou erreur inconnue
 *
 * Objet d'erreur normalise contenant :
 * - type : categorie d'erreur
 * - message : message general
 * - errors : details des erreurs (si existants)
 * - status : code HTTP
 */
export const normalizeError = (response) => {
  const { status, data } = response ?? {};
  switch (status) {
    case 422:
      return {
        type: AUTH_ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: data?.errors,
        status,
      };
    case 401:
      return {
        type: AUTH_ERROR_TYPES.AUTH,
        message: "Unauthenticated",
        errors: null,
        status,
      };
    default:
      return {
        type: AUTH_ERROR_TYPES.SERVER,
        message: "Something went wrong",
        errors: null,
        status: status ?? null,
      };
  }
};
