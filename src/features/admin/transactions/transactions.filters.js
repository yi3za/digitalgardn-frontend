import { TRANSACTION_TYPE } from "@/features/account/portefeuille/portefeuille.constants";

// Config des filtres pour la page de gestion des transactions admin
export const buildAdminTransactionsFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "type",
    type: "select",
    allLabel: t("admin:transactions.filters.type_label"),
    options: Object.values(TRANSACTION_TYPE).map((v) => ({
      value: v,
      label: t(`profil:portefeuille.transactions.types.${v}`),
    })),
  },
];
