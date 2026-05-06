import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAdminTransactions } from "@/features/admin/transactions/transactions.query";
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_BADGE_VARIANT,
} from "@/features/account/portefeuille/portefeuille.constants";
import { formatPrice, formatDateTime } from "@/lib/utils";
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

// Colonnes du tableau des transactions
const COLUMNS = ["id", "user", "type", "montant", "date"];

import { buildAdminTransactionsFiltersConfig } from "@/features/admin/transactions/transactions.filters";

/**
 * Page de gestion des transactions (espace admin)
 */
export function AdminTransactionsPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common", "profil"]);
  const [searchParams, setSearchParams] = useSearchParams();
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState(() => {
    const initial = {};
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const platform = searchParams.get("platform");

    if (search) initial.search = search;
    if (type) initial.type = type;
    if (platform) initial.platform = platform;

    return initial;
  });
  const [page, setPage] = useState(() => Number(searchParams.get("page") ?? 1));
  const syncSearchParams = (nextFilters, nextPage = 1) => {
    const nextParams = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== "" && value != null) nextParams.set(key, value);
    });

    if (nextPage > 1) nextParams.set("page", String(nextPage));

    setSearchParams(nextParams);
  };
  const handleApplyFilters = (newFilters) => {
    const nextFilters = filters.platform
      ? { ...newFilters, platform: filters.platform }
      : newFilters;

    setFilters(nextFilters);
    setPage(1);
    syncSearchParams(nextFilters, 1);
  };
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    syncSearchParams(filters, nextPage);
  };
  // Requete de recuperation des transactions
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminTransactions({ ...filters, page });
  const transactions = data?.items ?? [];
  const meta = data?.meta;
  // Code d'erreur ou valeur par defaut
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:transactions.title")}
        description={t("admin:transactions.description")}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={buildAdminTransactionsFiltersConfig(t)}
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
        {!isLoading && !isError && transactions?.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && transactions?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead key={col}>
                    {t(`admin:transactions.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-bold">#{transaction.id}</TableCell>
                  <TableCell>
                    <AvatarIdentity user={transaction.user} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={TRANSACTION_TYPE_BADGE_VARIANT[transaction.type]}
                    >
                      {t(
                        `profil:portefeuille.transactions.types.${transaction.type}`,
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(transaction.montant)} {CURRENCY}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(transaction.created_at)}
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
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
