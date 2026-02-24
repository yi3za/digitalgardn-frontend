/**
 * Enumeration des differents etats possibles de l'authentification
 *
 * IDLE : etat initial, aucune action en cours
 * LOADING : requete d'authentification en cours
 * AUTHENTICATED : utilisateur authentifie avec succes
 * UNAUTHENTICATED : utilisateur non authentifie ou deconnecte
 */
export const AUTH_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

/**
 * Types d'erreurs possibles lors des operations d'authentification
 *
 * VALIDATION : erreurs liees a la validation des donnees
 * AUTH : erreurs d'authentification
 * SERVER : erreurs internes du serveur
 */
export const AUTH_ERROR_TYPES = {
  VALIDATION: "validation",
  AUTH: "auth",
  SERVER: "server",
};
