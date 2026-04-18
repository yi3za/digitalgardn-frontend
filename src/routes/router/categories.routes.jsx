import { CategoriesPage } from "@/pages/categories/CategoriesPage";
import { CategoryShowPage } from "@/pages/categories/CategoryShowPage";

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
      element: <CategoryShowPage />,
    },
  ],
};
