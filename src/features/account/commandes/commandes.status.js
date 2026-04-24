/**
 * Configuration partagee des statuts de commande pour eviter la duplication entre composants.
 */

export const COMMANDE_STATUS = {
  EN_ATTENTE: "en_attente",
  EN_COURS: "en_cours",
  LIVREE: "livree",
  EN_REVISION: "en_revision",
  TERMINEE: "terminee",
  ANNULEE: "annulee",
};

export const commandeStatusBadgeVariantByStatut = {
  en_attente: "link",
  en_cours: "ghost",
  livree: "secondary",
  en_revision: "secondary",
  terminee: "default",
  annulee: "destructive",
};

export const commandeStatusTextKeyByStatut = {
  en_attente: "commandes:status.en_attente",
  en_cours: "commandes:status.en_cours",
  livree: "commandes:status.livree",
  en_revision: "commandes:status.en_revision",
  terminee: "commandes:status.terminee",
  annulee: "commandes:status.annulee",
};
