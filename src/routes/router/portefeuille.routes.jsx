import { PortefeuillePage } from "@/pages/portefeuille/PortefeuillePage";

/**
 * Definit la route du portefeuille pour tout utilisateur authentifie
 *
 * transactions : page des operations du portefeuille
 */
export const portefeuilleRoutes = {
  path: "transactions",
  children: [
    {
      index: true,
      element: <PortefeuillePage />,
    },
  ],
};
