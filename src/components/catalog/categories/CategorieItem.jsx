import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Composant qui affiche une categorie individuelle
 */
export function CategorieItem({ item }) {
  // Hook de navigation
  const navigate = useNavigate();
  const { categories: categoriesBasePath } = useNavigationPaths();
  // Navigation vers la page categorie
  const handleClick = () => {
    navigate(`${categoriesBasePath}/${item.slug}`);
  };

  return (
    <Item
      asChild
      className="p-2 min-w-50 cursor-pointer overflow-hidden"
      variant="outline"
    >
      <button onClick={handleClick}>
        <ItemMedia>
          <img
            src={item.icone_url}
            width={50}
            height={50}
            alt={item.nom}
            title={item.nom}
            className="rounded"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{item.nom}</ItemTitle>
        </ItemContent>
      </button>
    </Item>
  );
}
