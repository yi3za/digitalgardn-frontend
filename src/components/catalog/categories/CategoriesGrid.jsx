import { ScrollArea, ScrollBar } from "@/components/ui";
import { CategorieItem } from "./CategorieItem";

/**
 * Grille des categories : scroll (horizontal) ou grid
 */
export function CategoriesGrid({ categories = [], variant = "scroll" }) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((categorie) => (
          <CategorieItem key={categorie.id} item={categorie} />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea>
      <div className="flex gap-4 mb-8">
        {categories.map((categorie) => (
          <CategorieItem key={categorie.id} item={categorie} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
