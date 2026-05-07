import { Badge } from "@/components/ui";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { Link } from "react-router-dom";

/**
 * Composant qui affiche une langue individuelle
 */
export function LangueItem({ item }) {
  // Hook pour les chemins de navigation
  const { langues: languesBasePath } = useNavigationPaths();

  return (
    <Badge variant="secondary" asChild>
      <Link to={`${languesBasePath}/${item.id}`}>{item.nom}</Link>
    </Badge>
  );
}
