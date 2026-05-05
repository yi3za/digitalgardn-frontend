import { COMMANDE_STATUS } from "@/features/account/commandes/commandes.status";

// Config des filtres pour la page de gestion des commandes admin
export const buildAdminCommandesFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    allLabel: t("admin:commandes.filters.statut_label"),
    options: Object.values(COMMANDE_STATUS).map((v) => ({
      value: v,
      label: t(`admin:commandes.statuts.${v}`),
    })),
  },
];
