import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche un element du catalogue avec un lien de navigation
 */
export function CompetenceItem({ item, linkTo = "/competences" }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Fonction pour naviguer vers la page de competence
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
