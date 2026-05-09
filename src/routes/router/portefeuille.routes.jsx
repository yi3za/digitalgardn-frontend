import { PortefeuillePage } from "@/pages/portefeuille/PortefeuillePage";
import { TransactionsPage } from "@/pages/portefeuille/TransactionsPage";

/**
 * Definit la route du portefeuille pour tout utilisateur authentifie
 */
export const portefeuilleRoutes = {
  path: "portefeuille",
  children: [
    {
      index: true,
      element: <PortefeuillePage />,
    },
    {
      path: "transactions",
      element: <TransactionsPage />,
    },
  ],
};
