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
  // Non cliquable si la categorie ou son parent est inactif
  const isClickable =
    categorie?.est_active &&
    (!categorie?.parent || categorie?.parent?.est_active);

  // Contenu commun entre les deux etats
  const content = (
    <>
      <ItemMedia variant="image">
        <img src={categorie?.icone_url} alt={categorie?.nom} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-medium">{categorie?.nom}</ItemTitle>
        <ItemDescription>{categorie?.slug}</ItemDescription>
      </ItemContent>
    </>
  );

  return (
    <Item
      size="sm"
      className={`p-0 flex-nowrap [a]:hover:bg-transparent ${
        isClickable ? "[&:hover_*]:underline" : "cursor-no-drop"
      }`}
      asChild={isClickable}
    >
      {isClickable ? (
        <Link to={`${categoriesBasePath}/${categorie?.slug}`}>{content}</Link>
      ) : (
        content
      )}
    </Item>
  );
}
