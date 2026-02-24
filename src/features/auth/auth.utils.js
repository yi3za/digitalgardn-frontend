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
  const { status, data, statusText } = response ?? {};
  switch (status) {
    case 422:
      return {
        type: AUTH_ERROR_TYPES.VALIDATION,
        message: statusText,
        errors: data?.errors,
        status,
      };
    case 401:
    case 403:
    case 419:
      return {
        type: AUTH_ERROR_TYPES.AUTH,
        message: statusText,
        errors: null,
        status,
      };
    case 404:
      return {
        type: AUTH_ERROR_TYPES.NOT_FOUND,
        message: statusText,
        errors: null,
        status,
      };
    default:
      return {
        type: AUTH_ERROR_TYPES.SERVER,
        message: statusText ?? "Something went wrong",
        errors: null,
        status: status ?? null,
      };
  }
};
