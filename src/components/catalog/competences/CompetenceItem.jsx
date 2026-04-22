import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche une competence individuelle
 */
export function CompetenceItem({ item, linkTo = "/competences" }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Navigation vers la page competence
  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };

  return (
    <Item
      className="min-w-50 cursor-pointer overflow-hidden"
      variant="outline"
      onClick={handleClick}
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
