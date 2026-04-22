import { PortefeuillePage } from "@/pages/portefeuille/PortefeuillePage";
import { TransactionsPage } from "@/pages/portefeuille/TransactionsPage";

/**
 * Definit la route du portefeuille pour tout utilisateur authentifie
 *
 * portefeuille : page des operations du portefeuille
 * transactions : page de l'historique complet des transactions du portefeuille
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
