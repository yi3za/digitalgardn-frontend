import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemDescription,
  ItemActions,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
  WaitButton,
  Spinner,
} from "@/components/ui";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteService } from "@/features/freelance/catalog/services/services.mutations";
import { toast } from "sonner";

/**
 * Composant qui affiche un service individuel dans le catalogue
 */
export function ServiceItem({ item, linkTo = "/services", dashboard = false }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de traduction
  const { t } = useTranslation(["dashboard", "codes"]);
  // État pour gérer l'ouverture du dialog de confirmation de suppression
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Hook de suppression de service
  const deleteServiceMutation = useDeleteService();
  // Fonction pour naviguer vers la page
  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };
  // Fonction pour naviguer vers la page de modification de service
  const handleEditService = () => {
    navigate(`${linkTo}/${item.slug}/edit`);
  };
  // Fonction pour supprimer le service
  const handleDeleteService = async () => {
    try {
      const response = await deleteServiceMutation.mutateAsync(item.slug);
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
      setOpenDeleteDialog(false);
    } catch (error) {
      const { code } = error?.response?.data ?? {};
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <Item
      className="hover:shadow transition-shadow overflow-hidden flex-nowrap flex-col"
      variant="outline"
    >
      <ItemHeader
        className="min-h-60 max-h-60 cursor-pointer rounded overflow-hidden"
        onClick={handleClick}
      >
        <img
          src={item?.fichierPrincipale?.chemin_url}
          alt={item?.titre}
          title={item?.titre}
          className="w-full h-full object-cover"
        />
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{item?.titre}</ItemTitle>
        <ItemDescription>{item?.description}</ItemDescription>
      </ItemContent>
      {dashboard && (
        <ItemActions className="gap-5 justify-evenly w-full bg-muted p-2 rounded">
          <Eye className="block text-blue-500 hover:text-blue-700 cursor-pointer" />
          <Pencil
            onClick={handleEditService}
            className="block text-amber-500 hover:text-amber-700 cursor-pointer"
          />
          <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogTrigger asChild>
              <Trash2 className="block text-red-600 hover:text-red-800 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("services.delete.dialog.title")}</DialogTitle>
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
                    {t("services.delete.actions.cancel")}
                  </Button>
                </DialogClose>
                <WaitButton
                  variant="destructive"
                  onClick={handleDeleteService}
                  disabled={deleteServiceMutation.isPending}
                >
                  {deleteServiceMutation.isPending && <Spinner />}
                  {t("services.delete.actions.confirm")}
                </WaitButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ItemActions>
      )}
    </Item>
  );
}
