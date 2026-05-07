import { LanguesPage } from "@/pages/langues/LanguesPage";
import { LangueShowPage } from "@/pages/langues/LangueShowPage";

/**
 * Routes publiques liees aux langues
 */
export const languesRoutes = {
  path: "langues",
  children: [
    {
      index: true,
      element: <LanguesPage />,
    },
    {
      path: ":slug",
      element: <LangueShowPage />,
    },
  ],
};
