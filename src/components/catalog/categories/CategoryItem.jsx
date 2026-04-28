import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche une categorie individuelle
 */
export function CategoryItem({ item, linkTo = "/categories" }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Navigation vers la page categorie
  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };

  return (
    <Item
      asChild
      className="min-w-50 cursor-pointer overflow-hidden"
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
