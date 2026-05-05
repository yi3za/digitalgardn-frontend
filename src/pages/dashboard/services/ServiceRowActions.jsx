import { Button, ReusableDialog } from "@/components/ui";
import {
  useDeleteService,
  useUpdateServiceStatus,
} from "@/features/freelance/catalog/services/services.mutations";
import {
  SERVICE_STATUS,
  serviceStatusActionByStatut,
} from "@/features/freelance/catalog/services/services.status";
import { Ban, Eye, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { toast } from "sonner";

/**
 * Actions disponibles pour une ligne de service dans le tableau dashboard
 */
export function ServiceRowActions({ service }) {
  // Hook de traduction pour les textes statiques
  const { t } = useTranslation(["dashboard", "common", "codes"]);
  // Hook de navigation pour permettre la redirection vers les pages de details et d'edition du service
  const navigate = useNavigate();
  const { services: servicesBasePath } = useNavigationPaths();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Mutations pour la mise a jour du statut et la suppression d'un service
  const updateStatusMutation = useUpdateServiceStatus();
  const deleteMutation = useDeleteService();
  // Determination de l'action de changement de statut a afficher en fonction du statut actuel du service
  const currentStatusAction =
    serviceStatusActionByStatut?.[service?.statut] ?? null;
  const StatusActionIcon =
    currentStatusAction?.nextStatut === SERVICE_STATUS.EN_PAUSE
      ? Ban
      : RefreshCcw;
  // Handler pour le changement de statut du service
  const handleUpdateStatus = async () => {
    if (!service?.slug || !currentStatusAction?.nextStatut) return;
    try {
      const response = await updateStatusMutation.mutateAsync({
        slug: service.slug,
        data: { statut: currentStatusAction.nextStatut },
        currentStatut: service.statut,
      });
      toast.success(t(`codes:${response?.code}`));
    } catch (error) {
      toast.error(t(`codes:${error?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };
  // Handler pour la suppression du service
  const handleDelete = async () => {
    if (!service?.slug) return;
    try {
      const response = await deleteMutation.mutateAsync(service.slug);
      toast.success(t(`codes:${response?.code}`));
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error(t(`codes:${error?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate(`${servicesBasePath}/${service.slug}`)}
      >
        <Eye className="size-4" />
        {t("common:actions.view")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate(`${servicesBasePath}/${service.slug}/edit`)}
      >
        <Pencil className="size-4" />
        {t("services.show.actions.edit")}
      </Button>
      {currentStatusAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleUpdateStatus}
          disabled={updateStatusMutation.isPending}
        >
          <StatusActionIcon className="size-4" />
          {t(currentStatusAction.labelKey)}
        </Button>
      )}
      <ReusableDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        triggerLabel={
          <>
            <Trash2 className="size-4" />
            {t("services.show.actions.delete")}
          </>
        }
        triggerProps={{
          size: "sm",
          variant: "destructive",
          onClick: () => setOpenDeleteDialog(true),
        }}
        title={t("services.delete.dialog.title")}
        description={t("services.delete.dialog.description")}
        confirmLabel={t("common:actions.delete")}
        cancelLabel={t("common:actions.cancel")}
        confirmVariant="destructive"
        onConfirm={handleDelete}
        disabled={deleteMutation.isPending}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
