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
 * Composant compact pour afficher une competence (icone + nom + slug)
 */
export function CompetenceMiniCard({ competence }) {
  // Base path selon le contexte (public ou admin)
  const { competences: competencesBasePath } = useNavigationPaths();
  // Non cliquable si la competence ou son parent est inactif
  const isClickable =
    competence?.est_active &&
    (!competence?.parent || competence?.parent?.est_active);

  // Contenu commun entre les deux etats
  const content = (
    <>
      <ItemMedia variant="image">
        <img src={competence?.icone_url} alt={competence?.nom} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-medium">{competence?.nom}</ItemTitle>
        <ItemDescription>{competence?.slug}</ItemDescription>
      </ItemContent>
    </>
  );

  return (
    <Item
      size="sm"
      className={`flex-nowrap [a]:hover:bg-transparent ${
        isClickable ? "[&:hover_*]:underline" : "cursor-no-drop"
      }`}
      asChild={isClickable}
    >
      {isClickable ? (
        <Link to={`${competencesBasePath}/${competence?.slug}`}>{content}</Link>
      ) : (
        content
      )}
    </Item>
  );
}
