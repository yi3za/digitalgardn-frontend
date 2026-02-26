import { AUTH_CODES } from "./auth.constants";

/**
 * Normalise la reponse d'erreur HTTP provenant du backend
 *
 * Objet d'erreur normalise contenant :
 * - code : code d'erreur (categorie)
 * - message : message general
 * - details : details des erreurs
 * - status : code HTTP
 *
 * Utilise NETWORK_ERROR si response est absente (probleme reseau)
 */
export const normalizeError = (response) => {
  const { status, data: { code, details } = {} } = response ?? {
    data: { code: AUTH_CODES.NETWORK_ERROR },
  };
  const message = code; //Le message represente le code i18n pour traduction (implementation future)
  return { code, message, details, status };
};
