import codes from "./codes.json";
import auth from "./auth.json";

/**
 * Ce fichier regroupe toutes les traductions pour la langue française
 */
export const fr = {
  translation: {
    ...codes,
    ...auth,
  },
};
