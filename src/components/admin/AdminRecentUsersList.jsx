import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
  ItemGroup,
  Item,
  ItemContent,
  ItemActions,
  Button,
  Badge,
  ScrollArea,
  Spinner,
} from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import {
  ACCOUNT_STATUS_BADGE_VARIANT,
  AUTH_ROLE_BADGE_VARIANT,
} from "@/features/auth/auth.constants";

/**
 * Liste des derniers utilisateurs inscrits (dashboard admin)
 */
export function AdminRecentUsersList({
  t,
  users = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {t("admin:dashboard.activite.users.title")}
          {isFetching && <Spinner className="inline ml-2" />}
        </CardTitle>
        <CardDescription>
          {t("admin:dashboard.activite.users.description")}
        </CardDescription>
        <CardAction>
          <Button variant="link" size="sm" asChild>
            <Link to="/admin/users">
              {t("admin:dashboard.activite.users.viewAll")}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && users.length === 0 && (
          <DataEmpty description={t("admin:dashboard.activite.users.empty")} />
        )}
        {!isLoading && !isError && users.length > 0 && (
          <ScrollArea className="h-80">
            <ItemGroup className="gap-3">
              {users.map((user) => (
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
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
