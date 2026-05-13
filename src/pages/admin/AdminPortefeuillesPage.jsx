import { useTranslation } from "react-i18next";
import { TableSkeleton } from "@/components/skeletons";
import { useAdminPortefeuilles } from "@/features/admin/portefeuilles/portefeuilles.query";
import { buildAdminPortefeuillesFiltersConfig } from "@/features/admin/portefeuilles/portefeuilles.filters";
import { formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { useUrlFilters } from "@/hooks/useUrlFilters";

// Colonnes du tableau des portefeuilles
const COLUMNS = ["user", "disponible", "en_attente", "total", "devise"];

/**
 * Page de gestion des portefeuilles (espace admin)
 */
export function AdminPortefeuillesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters();
  // Requete de recuperation des portefeuilles
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminPortefeuilles({ ...filters, page });
  const portefeuilles = data?.items ?? [];
  const meta = data?.meta;
  // Code d'erreur ou valeur par defaut
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:portefeuilles.title")}
        description={t("admin:portefeuilles.description")}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={buildAdminPortefeuillesFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
        />
        {isLoading && (
          <DataLoading
            skeleton={TableSkeleton}
            skeletonProps={{ columns: 5 }}
          />
        )}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && portefeuilles.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && portefeuilles.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead key={col}>
                    {t(`admin:portefeuilles.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {portefeuilles.map((portefeuille) => {
                const isOwner = portefeuille.user?.is_platform_owner === true;
                return (
                  <TableRow
                    key={portefeuille.id}
                    className={
                      isOwner ? "bg-muted/50 font-semibold" : undefined
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarIdentity user={portefeuille.user} />
                        {isOwner && (
                          <Badge variant="warning">
                            {t("admin:portefeuilles.platform")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(portefeuille.solde_disponible)} {CURRENCY}
                    </TableCell>
                    <TableCell>
                      {formatPrice(portefeuille.solde_en_attente)} {CURRENCY}
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatPrice(portefeuille.solde_total)} {CURRENCY}
                    </TableCell>
                    <TableCell>{portefeuille.devise}</TableCell>
                  </TableRow>
                );
              })}
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
