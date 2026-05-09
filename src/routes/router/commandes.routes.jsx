import { CommandesPage } from "@/pages/commandes/commandesPage";

/**
 * Definit la route des commandes pour tout utilisateur authentifie
 */
export const commandesRoutes = {
  path: "commandes",
  children: [
    {
      index: true,
      element: <CommandesPage />,
    },
  ],
};
