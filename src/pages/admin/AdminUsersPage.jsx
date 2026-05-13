import { useTranslation } from "react-i18next";
import { TableSkeleton } from "@/components/skeletons";
import {
  useAdminUsers,
  useUpdateAdminUserStatus,
} from "@/features/admin/users/users.query";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
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
import { buildAdminUsersFiltersConfig } from "@/features/admin/users/users.filters";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useState } from "react";

// Configuration des actions de changement de statut d'un utilisateur
const STATUS_ACTIONS = [
  { status: ACCOUNT_STATUS.ACTIF, label: "set_actif", variant: "outline" },
  { status: ACCOUNT_STATUS.INACTIF, label: "set_inactif", variant: "outline" },
  { status: ACCOUNT_STATUS.BANNI, label: "set_banni", variant: "destructive" },
];

// Fonction utilitaire pour formater le nombre de jours d'inactivite d'un utilisateur
const formatInactiveDays = (t, days) => {
  // Si les jours d'inactivite sont null ou undefined, considerer que l'utilisateur n'a jamais ete actif
  if (days === null || days === undefined) {
    return t("admin:users.activity.never");
  }
  const inactiveDays = Math.trunc(Number(days));
  // Si l'utilisateur est inactif depuis 0 jour, afficher "Aujourd'hui"
  if (inactiveDays === 0) {
    return t("admin:users.activity.today");
  }
  // Sinon, afficher le nombre de jours d'inactivite avec la traduction appropriee (singulier/pluriel)
  return t(
    inactiveDays === 1
      ? "admin:users.activity.day"
      : "admin:users.activity.days",
    { count: inactiveDays },
  );
};

/**
 * Page de gestion des utilisateurs (espace admin)
 */
export function AdminUsersPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["search", "role", "status", "sort"],
  });
  // Etat local pour suivre les mises a jour de statut en cours
  const [updateStatusIsPending, setUpdateStatusIsPending] = useState({});
  // Requete de recuperation des utilisateurs
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminUsers({ ...filters, page });
  const users = data?.items ?? [];
  const meta = data?.meta;
  const updateAdminUserStatus = useUpdateAdminUserStatus();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Fonction de gestion du changement de statut d'un utilisateur (actif, inactif, banni)
  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdateStatusIsPending((prev) => ({ ...prev, [userId]: true }));
      await updateAdminUserStatus.mutateAsync({ userId, status: newStatus });
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      toast.error(t(`codes:${error?.response?.data?.code ?? "NETWORK_ERROR"}`));
    } finally {
      setUpdateStatusIsPending((prev) => ({ ...prev, [userId]: false }));
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
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={buildAdminUsersFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
        />
        {isLoading && (
          <DataLoading
            skeleton={TableSkeleton}
            skeletonProps={{ columns: 7 }}
          />
        )}
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
                {[
                  "user",
                  "role",
                  "status",
                  "last_activity",
                  "inactive_days",
                  "joined",
                  "actions",
                ].map((col) => (
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
                  <TableCell>
                    {user.derniere_activite
                      ? formatDateTime(user.derniere_activite)
                      : t("admin:users.activity.never")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.jours_inactif > 7 ? "destructive" : "secondary"
                      }
                    >
                      {formatInactiveDays(t, user.jours_inactif)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 [&_button]:flex-1">
                      {STATUS_ACTIONS.map(
                        (action) =>
                          user.status !== action.status && (
                            <Button
                              key={action.status}
                              size="sm"
                              variant={action.variant}
                              disabled={updateStatusIsPending?.[user.id]}
                              onClick={() =>
                                handleStatusChange(user.id, action.status)
                              }
                            >
                              {t(`admin:users.actions.${action.label}`)}
                            </Button>
                          ),
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && !isError && (
          <PaginationBar
            currentPage={meta?.current_page ?? 1}
            lastPage={meta?.last_page ?? 1}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
