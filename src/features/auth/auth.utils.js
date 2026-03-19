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

/**
 * Generalement utilise avec createAsyncThunk (Redux Toolkit)
 *
 * getActionName : extrait le nom de l'action d'un type d'action Redux (ex: "auth/login/pending" => "login")
 * isPending : verifie si une action Redux correspond a l'etat "pending"
 * isFulfilled : verifie si une action Redux correspond a l'etat "fulfilled"
 * isRejected : verifie si une action Redux correspond a l'etat "rejected"
 */
export const getActionName = (type) => type.split("/")[1];
export const isPending = (type, prefix = "auth") =>
  type.startsWith(`${prefix}/`) && type.endsWith("/pending");
export const isFulfilled = (type, prefix = "auth") =>
  type.startsWith(`${prefix}/`) && type.endsWith("/fulfilled");
export const isRejected = (type, prefix = "auth") =>
  type.startsWith(`${prefix}/`) && type.endsWith("/rejected");
