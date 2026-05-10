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
 * Liste des derniers avis laisses sur la plateforme
 */
export function AdminRecentAvisList({ t, avis = [], ...queryState }) {
  return (
    <RecentList
      t={t}
      titleKey="admin:dashboard.activite.avis.title"
      descriptionKey="admin:dashboard.activite.avis.description"
      viewAllKey="admin:dashboard.activite.avis.viewAll"
      emptyKey="admin:dashboard.activite.avis.empty"
      linkTo="/admin/avis"
      items={avis}
      {...queryState}
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
              {item.commentaire || t("admin:avis.no_comment")}
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
