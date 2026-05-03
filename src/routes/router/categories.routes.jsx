import { CategoriesPage } from "@/pages/categories/CategoriesPage";
import { CategorieShowPage } from "@/pages/categories/CategorieShowPage";

/**
 * Routes publiques liees aux categories
 */
export const categoriesRoutes = {
  path: "categories",
  children: [
    {
      index: true,
      element: <CategoriesPage />,
    },
    {
      path: ":slug",
      element: <CategorieShowPage />,
    },
  ],
};
