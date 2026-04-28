import { CommandesPage } from "@/pages/commandes/commandesPage";
import { CommandesShowPage } from "@/pages/commandes/CommandesShowPage";

/**
 * Definit la route des commandes pour tout utilisateur authentifie
 *
 * commandes : page des commandes disponibles
 */
export const commandesRoutes = {
  path: "commandes",
  children: [
    {
      index: true,
      element: <CommandesPage />,
    },
    {
      path: ":id",
      element: <CommandesShowPage />,
    },
  ],
};
