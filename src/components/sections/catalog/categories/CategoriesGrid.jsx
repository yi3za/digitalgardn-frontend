import { ScrollArea, ScrollBar } from "@/components/ui";
import { CategoryItem } from "./CategoryItem";

/**
 * Grille horizontale des categories pour la page d'accueil
 */
export function CategoriesGrid({ categories = [], linkTo = "/categories" }) {
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
