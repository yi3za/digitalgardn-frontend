import { TRANSACTION_TYPE } from "./portefeuille.constants";

// Config des filtres pour la page des transactions (espace client)
export const buildTransactionsFiltersConfig = (t) => [
  {
    key: "type",
    type: "select",
    allLabel: t("profil:portefeuille.transactions.type"),
    options: Object.values(TRANSACTION_TYPE).map((v) => ({
      value: v,
      label: t(`profil:portefeuille.transactions.types.${v}`),
    })),
  },
];
