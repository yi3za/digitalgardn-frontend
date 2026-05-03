import { useTranslation } from "react-i18next";
import { useAdminCommandes } from "@/features/admin/admin.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
import { commandeStatusBadgeVariantByStatut } from "@/features/account/commandes/commandes.status";
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";

/**
 * Page de gestion des commandes (espace admin)
 */
export function AdminCommandesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Requete de recuperation des commandes
  const {
    data: commandes,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCommandes();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none flex-1">
      <CardHeader>
        <CardTitle>{t("admin:commandes.title")}</CardTitle>
        <CardDescription>{t("admin:commandes.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1">
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
                  <TableCell>#{commande.id}</TableCell>
                  <TableCell>{commande.client?.name ?? "—"}</TableCell>
                  <TableCell>{commande.freelance?.name ?? "—"}</TableCell>
                  <TableCell>{commande.service?.titre ?? "—"}</TableCell>
                  <TableCell>
                    {formatPrice(commande.montant)} {CURRENCY}
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
      </CardContent>
    </Card>
  );
}
