import { useTranslation } from "react-i18next";
import {
  useAdminServices,
  useUpdateAdminServiceStatus,
} from "@/features/admin/services/services.query";
import { SERVICE_STATUS } from "@/features/freelance/catalog/services/services.status";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { ServicesTable } from "@/components/shared/ServicesTable";
import {
  Card,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
  Button,
} from "@/components/ui";

import { buildAdminServicesFiltersConfig } from "@/features/admin/services/services.filters";
import { useUrlFilters } from "@/hooks/useUrlFilters";

/**
 * Page de gestion des services (espace admin)
 */
export function AdminServicesPage() {
  // Hook traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["search", "statut"],
  });
  // Recupere tous les services
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminServices({ ...filters, page });
  const services = data?.items ?? [];
  const meta = data?.meta;
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
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={buildAdminServicesFiltersConfig(t)}
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
        {!isLoading && !isError && services.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && services.length > 0 && (
          <ServicesTable
            services={services}
            showFreelance
            renderActions={(service) =>
              service.statut === SERVICE_STATUS.EN_ATTENTE_APPROBATION ? (
                <div className="flex gap-2 [&_button]:flex-1">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusChange(service.id, SERVICE_STATUS.PUBLIE)
                    }
                  >
                    {t("admin:services.actions.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleStatusChange(service.id, SERVICE_STATUS.REJETE)
                    }
                  >
                    {t("admin:services.actions.reject")}
                  </Button>
                </div>
              ) : null
            }
          />
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
