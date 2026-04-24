/**
 * Configuration partagee des statuts de service pour eviter la duplication entre composants.
 */

export const SERVICE_STATUS = {
  BROUILLON: "brouillon",
  EN_ATTENTE_APPROBATION: "en_attente_approbation",
  PUBLIE: "publie",
  EN_PAUSE: "en_pause",
  REJETE: "rejete",
};

export const serviceStatusBadgeVariantByStatut = {
  publie: "default",
  en_attente_approbation: "outline",
  en_pause: "secondary",
  brouillon: "secondary",
  rejete: "destructive",
};

export const serviceStatusTextKeyByStatut = {
  publie: "dashboard:services.show.status.published",
  brouillon: "dashboard:services.show.status.draft",
  en_pause: "dashboard:services.show.status.paused",
  en_attente_approbation: "dashboard:services.show.status.pending",
  rejete: "dashboard:services.show.status.rejected",
};

export const serviceStatusActionByStatut = {
  brouillon: {
    nextStatut: "en_attente_approbation",
    labelKey: "dashboard:services.show.actions.submitForApproval",
  },
  rejete: {
    nextStatut: "en_attente_approbation",
    labelKey: "dashboard:services.show.actions.submitForApproval",
  },
  en_pause: {
    nextStatut: "en_attente_approbation",
    labelKey: "dashboard:services.show.actions.requestRepublish",
  },
  publie: {
    nextStatut: "en_pause",
    labelKey: "dashboard:services.show.actions.pause",
  },
  en_attente_approbation: {
    nextStatut: "en_pause",
    labelKey: "dashboard:services.show.actions.stopReview",
  },
};
