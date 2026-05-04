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
 * Composant compact pour afficher un service (image + titre + description)
 */
export function ServiceMiniCard({ service }) {
  // Base path selon le contexte (public ou admin)
  const { services: servicesBasePath } = useNavigationPaths();

  return (
    <Item
      size="sm"
      className="p-0 flex-nowrap [&:hover_*]:underline [a]:hover:bg-transparent"
      asChild
    >
      <Link to={`${servicesBasePath}/${service.slug}`}>
        <ItemMedia variant="image">
          <img
            src={service?.fichierPrincipale?.chemin_url}
            alt={service?.titre}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{service?.titre}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            {service?.description}
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
