import { useTranslation } from "react-i18next";
import { useAdminCommandes } from "@/features/admin/commandes/commandes.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
import { commandeStatusBadgeVariantByStatut } from "@/features/account/commandes/commandes.status";
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
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";
import { buildAdminCommandesFiltersConfig } from "@/features/admin/commandes/commandes.filters";
import { useUrlFilters } from "@/hooks/useUrlFilters";

/**
 * Page de gestion des commandes (espace admin)
 */
export function AdminCommandesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["search", "statut"],
  });
  // Requete de recuperation des commandes
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminCommandes({ ...filters, page });
  const commandes = data?.items ?? [];
  const meta = data?.meta;
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:commandes.title")}
        description={t("admin:commandes.description")}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={buildAdminCommandesFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
        />
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && commandes.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && commandes.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "id",
                  "client",
                  "freelance",
                  "service",
                  "montant",
                  "commission",
                  "montant_net",
                  "statut",
                  "date",
                ].map((col) => (
                  <TableHead key={col}>
                    {t(`admin:commandes.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell className="font-bold">#{commande.id}</TableCell>
                  <TableCell>
                    <AvatarIdentity user={commande.client} />
                  </TableCell>
                  <TableCell>
                    <AvatarIdentity user={commande.freelance} />
                  </TableCell>
                  <TableCell>
                    <ServiceMiniCard service={commande.service} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(commande.montant)} {CURRENCY}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatPrice(commande.commission)} {CURRENCY}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatPrice(commande.montant_net)} {CURRENCY}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        commandeStatusBadgeVariantByStatut[commande.statut]
                      }
                    >
                      {t(`admin:commandes.statuts.${commande.statut}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(commande.created_at)}</TableCell>
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
