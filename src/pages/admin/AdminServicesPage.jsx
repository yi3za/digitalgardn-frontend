import { useTranslation } from "react-i18next";
import {
  useAdminServices,
  useUpdateAdminServiceStatus,
} from "@/features/admin/services/services.query";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { CURRENCY } from "@/lib/config";
import {
  SERVICE_STATUS,
  serviceStatusBadgeVariantByStatut,
} from "@/features/freelance/catalog/services/services.status";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";
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
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";

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
    isFetching,
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
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:services.title")}
        description={t("admin:services.description")}
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
        {!isLoading && !isError && services.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && services.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "service",
                  "freelance",
                  "prix",
                  "statut",
                  "date",
                  "actions",
                ].map((col) => (
                  <TableHead key={col}>
                    {t(`admin:services.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <ServiceMiniCard service={service} />
                  </TableCell>
                  <TableCell>
                    <AvatarIdentity user={service.user} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(service.prix_base)} {CURRENCY}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        serviceStatusBadgeVariantByStatut[service.statut]
                      }
                    >
                      {t(`admin:services.statuts.${service.statut}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(service.created_at)}</TableCell>
                  <TableCell>
                    {service.statut ===
                      SERVICE_STATUS.EN_ATTENTE_APPROBATION && (
                      <div className="flex gap-2 [&_button]:flex-1">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              service.id,
                              SERVICE_STATUS.PUBLIE,
                            )
                          }
                        >
                          {t("admin:services.actions.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusChange(
                              service.id,
                              SERVICE_STATUS.REJETE,
                            )
                          }
                        >
                          {t("admin:services.actions.reject")}
                        </Button>
                      </div>
                    )}
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
