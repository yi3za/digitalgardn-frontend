/**
 * Normalise la reponse d'erreur HTTP provenant du backend
 *
 * Objet d'erreur normalise contenant :
 * - code : code d'erreur (categorie)
 * - details : details des erreurs
 *
 * Utilise NETWORK_ERROR si response est absente (probleme reseau)
 */
export const normalizeError = (response) => {
  const { data: { code, details } = {} } = response ?? {
    data: { code: "NETWORK_ERROR" },
  };
  return { code, details };
};
