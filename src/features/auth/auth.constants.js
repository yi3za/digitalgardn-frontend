/**
 * Enumeration des differents etats possibles de l'authentification
 *
 * IDLE : etat initial, aucune action en cours
 * AUTHENTICATED : utilisateur authentifie avec succes
 * UNAUTHENTICATED : utilisateur non authentifie ou deconnecte
 */
export const AUTH_STATUS = {
  IDLE: "IDLE",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
};

/**
 * Enumeration des differents statuts possibles du compte utilisateur
 *
 * ACTIF : compte actif et fonctionnel
 * INACTIF : compte desactive
 * BANNI : compte banni
 */
export const ACCOUNT_STATUS = {
  ACTIF: "actif",
  INACTIF: "inactif",
  BANNI: "banni",
};

/**
 * Enumeration des roles utilisateur
 *
 * ADMIN : acces complet (gestion globale)
 * FREELANCE : prestataire de services
 * CLIENT : utilisateur qui demande des services
 */
export const AUTH_ROLE = {
  ADMIN: "admin",
  FREELANCE: "freelance",
  CLIENT: "client",
};
