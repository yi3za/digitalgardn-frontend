import { useTranslation } from "react-i18next";
import { useAdminTransactions } from "@/features/admin/transactions/transactions.query";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
import { TRANSACTION_TYPE_BADGE_VARIANT } from "@/features/account/portefeuille/portefeuille.constants";

// Colonnes du tableau des transactions
const COLUMNS = ["id", "user", "type", "montant", "date"];

/**
 * Page de gestion des transactions (espace admin)
 */
export function AdminTransactionsPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common", "profil"]);
  // Requete de recuperation des transactions
  const {
    data: transactions,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAdminTransactions();
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
      <CardContent className="flex flex-1">
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
      </CardContent>
    </Card>
  );
}
