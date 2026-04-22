import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  WaitButton,
} from "@/components/ui";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useMyService } from "@/features/freelance/catalog/services/services.query";
import {
  useDeleteService,
  useUpdateServiceStatus,
} from "@/features/freelance/catalog/services/services.mutations";
import { serviceStatusActionByStatut } from "@/features/freelance/catalog/services/services.status";
import { Ban, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

/**
 * Page d'affichage d'un service dans le dashboard freelance, permettant de voir les details du service et d'acceder a son edition
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["dashboard", "common", "codes"]);
  // Etat pour le dialogue de confirmation de suppression
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Requete pour recuperer les informations du service
  const {
    data: service,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useMyService(slug);
  // Mutation de mise a jour du statut du service
  const updateServiceStatusMutation = useUpdateServiceStatus();
  // Mutation pour supprimer un service
  const deleteServiceMutation = useDeleteService();
  // Determiner l'action de changement de statut possible en fonction du statut actuel du service
  const currentStatusAction =
    serviceStatusActionByStatut?.[service?.statut] ?? null;
  // Icone de l'action de changement de statut a afficher dans le bouton d'action
  const StatusActionIcon =
    currentStatusAction?.nextStatut === "en_pause" ? Ban : RefreshCcw;
  // Fonction de gestion du clic sur le bouton de changement de statut avec affichage de notifications de succes ou d'erreur
  const handleUpdateStatus = async () => {
    // Verifier que le service a un slug et une action de statut possible avant de tenter la mise a jour
    if (!service?.slug || !currentStatusAction?.nextStatut) return;
    // Effectuer la mise a jour du statut du service via la mutation
    try {
      const response = await updateServiceStatusMutation.mutateAsync({
        slug: service.slug,
        data: { statut: currentStatusAction.nextStatut },
        currentStatut: service.statut,
      });
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  };
  // Fonction de suppression du service depuis la page show
  const handleDeleteService = async () => {
    if (!service?.slug) return;
    try {
      const response = await deleteServiceMutation.mutateAsync(service.slug);
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
      setOpenDeleteDialog(false);
      navigate("/dashboard/services", { replace: true });
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <Card className="shadow-none rounded-none border-none flex-1">
      <CardHeader>
        <CardTitle>{t("services.show.title")}</CardTitle>
        <CardDescription>{t("services.show.description")}</CardDescription>
        <CardAction>
          {isSuccess && (
            <>
              {currentStatusAction && (
                <Button
                  variant="link"
                  onClick={handleUpdateStatus}
                  disabled={updateServiceStatusMutation.isPending}
                >
                  {StatusActionIcon && <StatusActionIcon className="size-4" />}
                  {t(currentStatusAction.labelKey)}
                </Button>
              )}
              <Button
                variant="link"
                onClick={() =>
                  navigate(`/dashboard/services/${service?.slug}/edit`)
                }
              >
                <Pencil />
                {t("services.show.actions.edit")}
              </Button>
              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 />
                    {t("services.show.actions.delete")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t("services.delete.dialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("services.delete.dialog.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={deleteServiceMutation.isPending}
                      >
                        {t("common:actions.cancel")}
                      </Button>
                    </DialogClose>
                    <WaitButton
                      variant="destructive"
                      onClick={handleDeleteService}
                      disabled={deleteServiceMutation.isPending}
                    >
                      {deleteServiceMutation.isPending && <Spinner />}
                      {t("common:actions.delete")}
                    </WaitButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ServiceDetailsCard
          service={service}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
          t={t}
          showStatus={true}
        />
      </CardContent>
    </Card>
  );
}
