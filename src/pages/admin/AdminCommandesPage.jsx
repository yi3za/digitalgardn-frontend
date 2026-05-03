import { useTranslation } from "react-i18next";
import { useAdminCommandes } from "@/features/admin/commandes/commandes.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
import { commandeStatusBadgeVariantByStatut } from "@/features/account/commandes/commandes.status";
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
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";

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
    isFetching,
    error,
    refetch,
  } = useAdminCommandes();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:commandes.title")}
        description={t("admin:commandes.description")}
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
