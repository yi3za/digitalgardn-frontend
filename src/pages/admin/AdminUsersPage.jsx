import { useTranslation } from "react-i18next";
import {
  useAdminUsers,
  useUpdateAdminUserStatus,
} from "@/features/admin/admin.query";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  DataLoading,
  DataError,
  DataEmpty,
  Button,
} from "@/components/ui";
import { ACCOUNT_STATUS, AUTH_ROLE } from "@/features/auth/auth.constants";

// Variants de badge par statut utilisateur
const USER_STATUS_VARIANT = {
  [ACCOUNT_STATUS.ACTIF]: "default",
  [ACCOUNT_STATUS.INACTIF]: "secondary",
  [ACCOUNT_STATUS.BANNI]: "destructive",
};

// Variants de badge par role
const ROLE_VARIANT = {
  [AUTH_ROLE.ADMIN]: "default",
  [AUTH_ROLE.FREELANCE]: "secondary",
  [AUTH_ROLE.CLIENT]: "outline",
};

/**
 * Page de gestion des utilisateurs (espace admin)
 */
export function AdminUsersPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes"]);
  // Requete de recuperation des utilisateurs
  const { data, isLoading, isError, error, refetch } = useAdminUsers();
  const mutation = useUpdateAdminUserStatus();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Extraction des utilisateurs et de la pagination de la reponse de la requete
  const users = data?.users ?? [];
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
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:users.title")}</CardTitle>
        <CardDescription>{t("admin:users.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {isLoading && <DataLoading />}
        {isError && <DataError errorCode={code} onRetry={refetch} />}
        {!isLoading && !isError && users.length === 0 && <DataEmpty />}
        {!isLoading && !isError && users.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {["user", "role", "status", "joined", "actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                      >
                        {t(`admin:users.columns.${col}`)}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_VARIANT[user.role] ?? "outline"}>
                        {t(`admin:users.roles.${user.role}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          USER_STATUS_VARIANT[user.status] ?? "secondary"
                        }
                      >
                        {t(`admin:users.statuses.${user.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {user.status !== "actif" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(user.id, "actif")}
                          >
                            {t("admin:users.actions.set_actif")}
                          </Button>
                        )}
                        {user.status !== "inactif" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(user.id, "inactif")
                            }
                          >
                            {t("admin:users.actions.set_inactif")}
                          </Button>
                        )}
                        {user.status !== "banni" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(user.id, "banni")}
                          >
                            {t("admin:users.actions.set_banni")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
