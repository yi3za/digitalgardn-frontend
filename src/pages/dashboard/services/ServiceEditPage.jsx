import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DataError, DataLoading } from "@/components/ui";
import { ServiceDetailsSkeleton } from "@/components/skeletons";
import { ServiceForm } from "@/components/shared/ServiceForm";
import { useMyService } from "@/features/freelance/catalog/services/services.query";
import { updateServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import { useServiceForm } from "@/features/freelance/catalog/services/useServiceForm";

/**
 * Page pour la modification des services
 */
export function ServiceEditPage() {
  // Initialisation des hooks de traduction
  const { t } = useTranslation(["dashboard", "common"]);
  // Recuperation du slug du service a modifier depuis les parametres d'URL
  const { slug } = useParams();
  // Recuperation des donnees du service a modifier en utilisant le hook de requete useMyService avec le slug
  const {
    data: service,
    isPending: isServicePending,
    isError: isServiceError,
    error: serviceError,
    refetch: refetchService,
  } = useMyService(slug);
  // Recuperation du controller de formulaire en mode "edit" avec le schema de validation pour la mise a jour de service
  const controller = useServiceForm({
    mode: "edit",
    schema: updateServiceSchema,
    service,
    slug,
  });

  if (isServicePending)
    return <DataLoading skeleton={ServiceDetailsSkeleton} />;

  if (isServiceError)
    return (
      <DataError
        errorCode={serviceError?.response?.data?.code ?? null}
        retryText={t("common:actions.retry")}
        onRetry={refetchService}
      />
    );

  return (
    <ServiceForm
      title={t("services.edit.title")}
      description={t("services.edit.description")}
      controller={controller}
    />
  );
}
