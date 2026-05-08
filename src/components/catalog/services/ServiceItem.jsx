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
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Composant qui affiche un service individuel dans le catalogue
 */
export function ServiceItem({ item }) {
  // Hook de navigation pour redirections
  const navigate = useNavigate();
  const { isAdmin, services: servicesBasePath } = useNavigationPaths();
  // Hook de traduction pour les textes statiques du composant
  const { t } = useTranslation(["dashboard", "catalog"]);
  // Etat local pour gerer le hover sur le service
  const [hovred, setHovered] = useState(false);
  // Fonction de gestion du clic sur le service pour redirection vers la page de details
  const handleClick = () => {
    navigate(`${servicesBasePath}/${item.slug}`);
  };

  return (
    <Item className="p-0 overflow-hidden cursor-pointer">
      <ItemHeader
        className="relative min-h-60 max-h-60 rounded overflow-hidden"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={item?.fichierPrincipale?.chemin_url}
          alt={item?.titre}
          title={item?.titre}
          className="min-w-full min-h-60"
        />
        {isAdmin && (
          <Badge
            variant={serviceStatusBadgeVariantByStatut?.[item.statut]}
            className="absolute top-3 right-3"
          >
            {t(serviceStatusTextKeyByStatut?.[item.statut])}
          </Badge>
        )}
      </ItemHeader>
      <ItemContent className="break-all gap-2">
        <AvatarIdentity user={item?.user} />
        <ItemTitle
          onClick={handleClick}
          className={`line-clamp-1 hover:underline ${hovred ? "underline" : ""}`}
        >
          {item?.titre}
        </ItemTitle>
        <ItemDescription
          onClick={handleClick}
          className={`hover:underline ${hovred ? "underline" : ""}`}
        >
          {item?.description}
        </ItemDescription>
        <div className="flex items-center gap-2 font-medium">
          <Star size={15} className="text-yellow-500 fill-yellow-500" />
          <span>{item?.note_moyenne || 0}</span>
          <span className="text-gray-500">
            ({item?.nombre_avis || 0} {t("catalog:serviceShow.reviews")})
          </span>
          <span className="text-gray-500">
            {item?.ventes || 0} {t("catalog:serviceShow.sales")}
          </span>
        </div>
        <p className="font-bold">{`${item?.prix_base} ${t("catalog:serviceShow.priceSuffix")}`}</p>
      </ItemContent>
    </Item>
  );
}
