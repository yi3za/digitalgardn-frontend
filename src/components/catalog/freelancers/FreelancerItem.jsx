import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Badge,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import { Link } from "react-router-dom";
import { Star, BriefcaseBusiness } from "lucide-react";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { useTranslation } from "react-i18next";

/**
 * Carte individuelle d'un freelance pour la section home
 */
export function FreelancerItem({ freelancer }) {
  // Hooks pour les chemins de navigation et la traduction
  const { freelancers: freelancersBasePath } = useNavigationPaths();
  const { t } = useTranslation(["catalog", "common"]);

  return (
    <Item variant="outline" className="gap-3">
      <Avatar className="size-12">
        <AvatarImage src={freelancer?.avatar_url} alt={freelancer?.name} />
        <AvatarFallback>{freelancer?.name?.charAt(0) ?? "F"}</AvatarFallback>
      </Avatar>
      <ItemContent>
        <ItemTitle>{freelancer?.name}</ItemTitle>
        <ItemDescription>@{freelancer?.username}</ItemDescription>
        <ItemActions className="mt-1 flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
            {freelancer?.note_moyenne ?? 0}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <BriefcaseBusiness className="size-3.5" />
            {t("catalog:freelancers.servicesCount", {
              count: freelancer?.services_count ?? 0,
            })}
          </Badge>
          <Badge variant="outline">
            {t("catalog:freelancers.reviewsCount", {
              count: freelancer?.total_avis ?? 0,
            })}
          </Badge>
        </ItemActions>
      </ItemContent>
      <ItemActions className="self-start">
        <Button asChild variant="link" size="sm">
          <Link to={`${freelancersBasePath}/${freelancer?.username}`}>
            {t("common:actions.view")}
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}
