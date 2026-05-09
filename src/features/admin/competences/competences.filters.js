import { COMPETENCES_STATUS } from "./competences.status";

// Config des filtres pour la page de gestion des competences admin
export const buildAdminCompetencesFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    allLabel: t("admin:competences.filters.statut_label"),
    options: Object.values(COMPETENCES_STATUS).map((v) => ({
      value: v,
      label: t(`admin:competences.statuts.${v}`),
    })),
  },
];
