import { TransactionsPage } from "@/pages/transactions/TransactionsPage";

/**
 * Definit la route des transactions pour tout utilisateur authentifie
 *
 * transactions : page des operations du portefeuille
 */
export const transactionsRoutes = {
  path: "transactions",
  children: [
    {
      index: true,
      element: <TransactionsPage />,
    },
  ],
};
