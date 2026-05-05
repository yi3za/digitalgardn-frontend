import { SERVICE_STATUS } from "./services.status";

// Correspondance statut → cle i18n dashboard
const STATUS_KEY = {
  [SERVICE_STATUS.EN_ATTENTE_APPROBATION]: "pending",
  [SERVICE_STATUS.PUBLIE]: "published",
  [SERVICE_STATUS.EN_PAUSE]: "paused",
  [SERVICE_STATUS.BROUILLON]: "draft",
};

// Config des filtres pour la page des services du freelance connecte
export const buildMyServicesFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    allLabel: t("dashboard:services.show.status.label"),
    options: Object.values(SERVICE_STATUS).map((v) => ({
      value: v,
      label: t(`dashboard:services.show.status.${STATUS_KEY[v] ?? "rejected"}`),
    })),
  },
];
