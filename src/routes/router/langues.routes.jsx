import { LanguesPage } from "@/pages/langues/LanguesPage";

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
  ],
};
