import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemDescription,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche un service individuel dans le catalogue
 */
export function ServiceItem({ item, linkTo = "/services" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };

  return (
    <Item
      className="cursor-pointer hover:shadow transition-shadow overflow-hidden"
      variant="outline"
      onClick={handleClick}
    >
      <ItemHeader className="h-50">
        <img
          src={
            // item?.fichier_principale?.chemin ||
            "http://localhost:8000/storage/avatars/default.webp"
          }
          alt={item?.titre}
          title={item?.titre}
          className="w-full h-full rounded"
        />
      </ItemHeader>
      <ItemContent>
        <ItemTitle>{item?.titre}</ItemTitle>
        <ItemDescription>{item?.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
