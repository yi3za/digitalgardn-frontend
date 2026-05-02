import { useTranslation } from "react-i18next";
import { useAdminCommandes } from "@/features/admin/admin.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
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
} from "@/components/ui";

// Variants de badge par statut commande
const COMMANDE_STATUS_VARIANT = {
  en_attente: "secondary",
  en_cours: "outline",
  livree: "default",
  en_revision: "outline",
  terminee: "default",
  annulee: "destructive",
};

/**
 * Page de gestion des commandes (espace admin)
 */
export function AdminCommandesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes"]);
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
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:commandes.title")}</CardTitle>
        <CardDescription>{t("admin:commandes.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {isLoading && <DataLoading />}
        {isError && <DataError errorCode={code} onRetry={refetch} />}
        {!isLoading && !isError && commandes.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && commandes.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {[
                    "id",
                    "client",
                    "freelance",
                    "service",
                    "montant",
                    "statut",
                    "date",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      {t(`admin:commandes.columns.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commandes.map((commande) => (
                  <tr
                    key={commande.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      #{commande.id}
                    </td>
                    <td className="px-4 py-3">
                      {commande.client?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {commande.freelance?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {commande.service?.titre ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(commande.montant)} {CURRENCY}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          COMMANDE_STATUS_VARIANT[commande.statut] ??
                          "secondary"
                        }
                      >
                        {t(`admin:commandes.statuts.${commande.statut}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(commande.created_at)}
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
