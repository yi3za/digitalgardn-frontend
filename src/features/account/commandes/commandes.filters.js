import { COMMANDE_STATUS } from "./commandes.status";

// Config des filtres pour la page des commandes (espace client)
export const buildCommandesFiltersConfig = (t) => [
  {
    key: "statut",
    type: "select",
    allLabel: t("commandes:status.all"),
    options: Object.values(COMMANDE_STATUS).map((v) => ({
      value: v,
      label: t(`commandes:status.${v}`),
    })),
  },
];
