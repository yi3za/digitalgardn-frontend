import { RecentList } from "@/components/shared/RecentList";
import { Item, ItemContent, ItemActions, Badge } from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import {
  ACCOUNT_STATUS_BADGE_VARIANT,
  AUTH_ROLE_BADGE_VARIANT,
} from "@/features/auth/auth.constants";

// Liste des derniers utilisateurs inscrits (dashboard admin)
export function AdminRecentUsersList({ t, users = [] }) {
  return (
    <RecentList
      t={t}
      titleKey="admin:dashboard.activite.users.title"
      descriptionKey="admin:dashboard.activite.users.description"
      viewAllKey="admin:dashboard.activite.users.viewAll"
      emptyKey="admin:dashboard.activite.users.empty"
      linkTo="/admin/users"
      items={users}
      renderItem={(user) => (
        <Item key={user.id} variant="muted" size="sm">
          <ItemContent>
            <AvatarIdentity user={user} />
          </ItemContent>
          <ItemActions>
            <Badge variant={AUTH_ROLE_BADGE_VARIANT[user.role]}>
              {t(`admin:users.roles.${user.role}`)}
            </Badge>
            <Badge variant={ACCOUNT_STATUS_BADGE_VARIANT[user.status]}>
              {t(`admin:users.statuses.${user.status}`)}
            </Badge>
          </ItemActions>
        </Item>
      )}
    />
  );
}
