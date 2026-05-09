import { CATEGORIES_STATUS } from "./categories.status";

// Config des filtres pour la page de gestion des categories admin
export const buildAdminCategoriesFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    allLabel: t("admin:categories.filters.statut_label"),
    options: Object.values(CATEGORIES_STATUS).map((v) => ({
      value: v,
      label: t(`admin:categories.statuts.${v}`),
    })),
  },
];
