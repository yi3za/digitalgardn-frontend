import { RecentList } from "@/components/shared/RecentList";
import {
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";
import { formatDateTime } from "@/lib/utils";
import { Star } from "lucide-react";

/**
 * Liste des derniers avis recus par le freelance
 */
export function DashboardRecentAvis({
  t,
  avis = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  return (
    <RecentList
      t={t}
      titleKey="dashboard:recentAvis.title"
      descriptionKey="dashboard:recentAvis.description"
      viewAllKey="common:actions.viewAll"
      emptyKey="common:states.empty"
      linkTo="/dashboard/avis"
      items={avis}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      error={error}
      refetch={refetch}
      renderItem={(item) => (
        <Item key={item.id} variant="muted" size="sm">
          <ItemContent>
            <ItemTitle className="w-full justify-between">
              <AvatarIdentity user={item.client} />
              <Badge variant="warning">
                <Star className="fill-yellow-500 text-yellow-500" />
                {item.note}
              </Badge>
            </ItemTitle>
            {item.service && <ServiceMiniCard service={item.service} />}
            <ItemDescription className="line-clamp-2">
              {item.commentaire || t("dashboard:avis.no_comment")}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="self-start text-xs text-muted-foreground">
            {formatDateTime(item.created_at)}
          </ItemActions>
        </Item>
      )}
    />
  );
}
