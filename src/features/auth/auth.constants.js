/**
 * Enumeration des differents etats possibles de l'authentification
 *
 * IDLE : etat initial, aucune action en cours
 * LOADING : requete d'authentification en cours
 * AUTHENTICATED : utilisateur authentifie avec succes
 * UNAUTHENTICATED : utilisateur non authentifie ou deconnecte
 */
export const AUTH_STATUS = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
};
