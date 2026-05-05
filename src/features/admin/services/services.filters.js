import { SERVICE_STATUS } from "@/features/freelance/catalog/services/services.status";

// Config des filtres pour la page de gestion des services admin
export const buildAdminServicesFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    allLabel: t("admin:services.filters.statut_label"),
    options: Object.values(SERVICE_STATUS).map((v) => ({
      value: v,
      label: t(`admin:services.statuts.${v}`),
    })),
  },
];
