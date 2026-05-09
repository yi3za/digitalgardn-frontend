import { ServiceForm } from "@/components/shared/ServiceForm";
import { storeServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import { useServiceForm } from "@/features/freelance/catalog/services/useServiceForm";

/**
 * Page de creation d'un service
 */
export function ServiceCreatePage() {
  // Initialisation du controller de formulaire en mode "create" avec le schema de validation pour la creation de service
  const controller = useServiceForm({
    mode: "create",
    schema: storeServiceSchema,
  });
  // Destructuration de la fonction de traduction du controller pour l'utiliser dans le composant
  const { t } = controller;

  return (
    <ServiceForm
      title={t("services.create.title")}
      description={t("services.create.description")}
      controller={controller}
    />
  );
}
