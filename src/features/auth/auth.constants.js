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
