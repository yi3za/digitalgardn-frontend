import { Link } from "react-router-dom";
import { Badge } from "../ui";

/**
 * Composant pour afficher une liste de badges de competences.
 * Utilise le contexte de navigation pour generer les liens corrects (public ou admin).
 */
export function SkillBadges({ items, BadgeVariant, title, path }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {(items ?? []).map((item) => (
          <Badge key={`competence-${item.id}`} variant={BadgeVariant}>
            {path && item.slug ? (
              <Link to={`${path}/${item.slug}`}>{item.nom}</Link>
            ) : (
              item.nom
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
