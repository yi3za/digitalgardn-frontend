import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { Link } from "react-router-dom";

/**
 * Composant compact pour afficher une categorie (icone + nom + slug)
 */
export function CategorieMiniCard({ categorie }) {
  // Base path selon le contexte (public ou admin)
  const { categories: categoriesBasePath } = useNavigationPaths();

  // Contenu commun entre les deux etats
  const content = (
    <>
      <ItemMedia variant="image">
        <img src={categorie?.icone_url} alt={categorie?.nom} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-medium">{categorie?.nom}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          {categorie?.description}
        </ItemDescription>
      </ItemContent>
    </>
  );

  return (
    <Item
      size="sm"
      className="p-0 flex-nowrap [a]:hover:bg-transparent [&:hover_*]:underline"
      asChild={true}
    >
      <Link to={`${categoriesBasePath}/${categorie?.slug}`}>{content}</Link>
    </Item>
  );
}
