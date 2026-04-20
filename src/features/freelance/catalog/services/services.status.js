/**
 * Configuration partagee des statuts de service pour eviter la duplication entre composants.
 */

export const serviceStatusBadgeVariantByStatut = {
  publie: "default",
  en_attente_approbation: "outline",
  en_pause: "secondary",
  brouillon: "secondary",
  rejete: "destructive",
};

export const serviceStatusTextKeyByStatut = {
  publie: "services.show.status.published",
  brouillon: "services.show.status.draft",
  en_pause: "services.show.status.paused",
  en_attente_approbation: "services.show.status.pending",
  rejete: "services.show.status.rejected",
};

export const serviceStatusActionByStatut = {
  brouillon: {
    nextStatut: "en_attente_approbation",
    labelKey: "services.show.actions.submitForApproval",
  },
  rejete: {
    nextStatut: "en_attente_approbation",
    labelKey: "services.show.actions.submitForApproval",
  },
  en_pause: {
    nextStatut: "en_attente_approbation",
    labelKey: "services.show.actions.requestRepublish",
  },
  publie: {
    nextStatut: "en_pause",
    labelKey: "services.show.actions.pause",
  },
  en_attente_approbation: {
    nextStatut: "en_pause",
    labelKey: "services.show.actions.stopReview",
  },
};

// Fonction utilitaire pour determiner la variante du badge a afficher en fonction du statut du service
export const getServiceStatusBadgeVariant = (
  statut,
  fallbackVariant = "secondary",
) => serviceStatusBadgeVariantByStatut?.[statut] ?? fallbackVariant;

// Fonction utilitaire pour determiner le texte a afficher en fonction du statut du service
export const getServiceStatusTextKey = (
  statut,
  fallbackKey = "services.show.status.draft",
) => serviceStatusTextKeyByStatut?.[statut] ?? fallbackKey;
