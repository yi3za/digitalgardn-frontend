import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemDescription,
  Badge,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  serviceStatusBadgeVariantByStatut,
  serviceStatusTextKeyByStatut,
} from "@/features/freelance/catalog/services/services.status";

/**
 * Composant qui affiche un service individuel dans le catalogue
 */
export function ServiceItem({ item, linkTo = "/services", dashboard = false }) {
  // Hook de navigation pour redirections
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques du composant
  const { t } = useTranslation(["dashboard"]);
  // Fonction de gestion du clic sur le service pour redirection vers la page de details
  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };

  return (
    <Item
      className="hover:shadow transition-shadow overflow-hidden flex-nowrap flex-col"
      variant="outline"
    >
      <ItemHeader
        className="relative min-h-60 max-h-60 cursor-pointer rounded overflow-hidden min-w-full"
        onClick={handleClick}
      >
        <img
          src={item?.fichierPrincipale?.chemin_url}
          alt={item?.titre}
          title={item?.titre}
          className="w-full h-full object-cover"
        />
        {dashboard && (
          <Badge
            variant={serviceStatusBadgeVariantByStatut?.[item.statut]}
            className="absolute top-3 right-3"
          >
            {t(serviceStatusTextKeyByStatut?.[item.statut])}
          </Badge>
        )}
      </ItemHeader>
      <ItemContent className="break-all">
        <ItemTitle className="line-clamp-1">{item?.titre}</ItemTitle>
        <ItemDescription>{item?.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
