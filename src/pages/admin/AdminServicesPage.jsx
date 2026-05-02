import { useTranslation } from "react-i18next";
import {
  useAdminServices,
  useUpdateAdminServiceStatus,
} from "@/features/admin/admin.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
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

// Variants de badge par statut service
const SERVICE_STATUS_VARIANT = {
  brouillon: "secondary",
  en_attente_approbation: "outline",
  publie: "default",
  en_pause: "secondary",
  rejete: "destructive",
};

/**
 * Page de gestion des services (espace admin)
 */
export function AdminServicesPage() {
  // Hook traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Recupere tous les services
  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminServices();
  // Mutation pour modifier le statut d'un service (publier / rejeter)
  const mutation = useUpdateAdminServiceStatus();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Fonction de gestion du changement de statut d'un service (publier / rejeter)
  const handleStatusChange = async (serviceId, newStatut) => {
    try {
      await mutation.mutateAsync({ serviceId, statut: newStatut });
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      toast.error(t(`codes:${error?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:services.title")}</CardTitle>
        <CardDescription>{t("admin:services.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {/* Tableau */}
        {isLoading && <DataLoading />}
        {isError && <DataError errorCode={code} onRetry={refetch} />}
        {!isLoading && !isError && services.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && services.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {[
                    "service",
                    "freelance",
                    "prix",
                    "statut",
                    "date",
                    "actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      {t(`admin:services.columns.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium max-w-xs truncate">
                        {service.titre}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {service.user?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(service.prix_base)} {CURRENCY}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          SERVICE_STATUS_VARIANT[service.statut] ?? "secondary"
                        }
                      >
                        {t(`admin:services.statuts.${service.statut}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(service.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {service.statut === "en_attente_approbation" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(service.id, "publie")
                            }
                          >
                            {t("admin:services.actions.approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(service.id, "rejete")
                            }
                          >
                            {t("admin:services.actions.reject")}
                          </Button>
                        </div>
                      )}
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
