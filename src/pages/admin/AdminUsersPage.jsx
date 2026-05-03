import { useTranslation } from "react-i18next";
import {
  useAdminUsers,
  useUpdateAdminUserStatus,
} from "@/features/admin/users/users.query";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  CardContent,
  Badge,
  DataLoading,
  DataError,
  DataEmpty,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import {
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_BADGE_VARIANT,
  AUTH_ROLE_BADGE_VARIANT,
} from "@/features/auth/auth.constants";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";

/**
 * Page de gestion des utilisateurs (espace admin)
 */
export function AdminUsersPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Requete de recuperation des utilisateurs
  const {
    data: users,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAdminUsers();
  const mutation = useUpdateAdminUserStatus();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Fonction de gestion du changement de statut d'un utilisateur (actif, inactif, banni)
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await mutation.mutateAsync({ userId, status: newStatus });
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      toast.error(t(`codes:${error?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:users.title")}
        description={t("admin:users.description")}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <CardContent className="flex flex-1">
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && users.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && users.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {["user", "role", "status", "joined", "actions"].map((col) => (
                  <TableHead key={col}>
                    {t(`admin:users.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <AvatarIdentity user={user} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={AUTH_ROLE_BADGE_VARIANT[user.role]}>
                      {t(`admin:users.roles.${user.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACCOUNT_STATUS_BADGE_VARIANT[user.status]}>
                      {t(`admin:users.statuses.${user.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 [&_button]:flex-1">
                      {user.status !== ACCOUNT_STATUS.ACTIF && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(user.id, ACCOUNT_STATUS.ACTIF)
                          }
                        >
                          {t("admin:users.actions.set_actif")}
                        </Button>
                      )}
                      {user.status !== ACCOUNT_STATUS.INACTIF && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(user.id, ACCOUNT_STATUS.INACTIF)
                          }
                        >
                          {t("admin:users.actions.set_inactif")}
                        </Button>
                      )}
                      {user.status !== ACCOUNT_STATUS.BANNI && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusChange(user.id, ACCOUNT_STATUS.BANNI)
                          }
                        >
                          {t("admin:users.actions.set_banni")}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
