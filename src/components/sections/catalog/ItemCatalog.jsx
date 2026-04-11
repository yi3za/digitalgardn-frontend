import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche un element du catalogue avec un lien de navigation
 */
export function ItemCatalog({ linkTo, item }) {
  // Hook de navigation
  const navigate = useNavigate();

  return (
    <Item
      className="min-w-50 cursor-pointer"
      variant="outline"
      onClick={() => navigate(`${linkTo}/${item.slug}`)}
    >
      <ItemMedia>
        <img
          src="http://localhost:8000/storage/avatars/default.webp"
          width={50}
          height={50}
          alt={item.nom}
          title={item.nom}
          className="rounded"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.slug}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
