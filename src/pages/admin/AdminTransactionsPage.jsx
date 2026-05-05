import { useState } from "react";
import { useTranslation } from "react-i18next";
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

// Configuration des filtres disponibles pour les transactions
const TRANSACTIONS_FILTERS_CONFIG = [
  { key: "search", type: "input" },
  {
    key: "type",
    type: "select",
    options: Object.values(TRANSACTION_TYPE).map((v) => ({
      value: v,
      labelKey: `profil:portefeuille.transactions.types.${v}`,
    })),
  },
];

/**
 * Page de gestion des transactions (espace admin)
 */
export function AdminTransactionsPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common", "profil"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
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
          filtersConfig={TRANSACTIONS_FILTERS_CONFIG}
          onApply={handleApplyFilters}
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
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
