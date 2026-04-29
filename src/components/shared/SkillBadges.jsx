import { Link } from "react-router-dom";
import { Badge } from "../ui";

/**
 * Composant pour afficher une liste de badges
 */
export function SkillBadges({ items, BadgeVariant, title }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {(items ?? []).map((item) => (
          <Badge key={`category-${item.id}`} variant={BadgeVariant}>
            <Link to={`/categories/${item.slug}`}>{item.nom}</Link>
          </Badge>
        ))}
      </div>
    </div>
  );
}
