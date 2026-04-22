import { ScrollArea, ScrollBar } from "@/components/ui";
import { CategoryItem } from "./CategoryItem";

/**
 * Grille des categories : scroll (horizontal) ou grid
 */
export function CategoriesGrid({
  categories = [],
  linkTo = "/categories",
  variant = "scroll",
}) {

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryItem key={category.id} item={category} linkTo={linkTo} />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea>
      <div className="flex gap-4 mb-8">
        {categories.map((category) => (
          <CategoryItem key={category.id} item={category} linkTo={linkTo} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
