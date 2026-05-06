import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Composant qui affiche une competence individuelle
 */
export function CompetenceItem({ item }) {
  // Hook de navigation
  const navigate = useNavigate();
  const { competences: competencesBasePath } = useNavigationPaths();
  // Navigation vers la page competence
  const handleClick = () => {
    navigate(`${competencesBasePath}/${item.slug}`);
  };

  return (
    <Item
      asChild
      className="p-2 min-w-50 cursor-pointer overflow-hidden"
      variant="outline"
    >
      <button onClick={handleClick}>
        <ItemMedia className="w-12 h-12">
          <img
            src={item.icone_url}
            alt={item.nom}
            title={item.nom}
            className="rounded h-full w-full"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{item.nom}</ItemTitle>
        </ItemContent>
      </button>
    </Item>
  );
}
