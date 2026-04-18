import { CompetencesPage } from "@/pages/competences/CompetencesPage";
import { CompetenceShowPage } from "@/pages/competences/CompetenceShowPage";

/**
 * Routes publiques liees aux competences
 */
export const competencesRoutes = {
  path: "competences",
  children: [
    {
      index: true,
      element: <CompetencesPage />,
    },
    {
      path: ":slug",
      element: <CompetenceShowPage />,
    },
  ],
};
