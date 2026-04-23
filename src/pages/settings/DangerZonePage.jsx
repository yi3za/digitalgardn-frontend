import {
  Button,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  ReusableDialog,
} from "@/components/ui";
import { ACCOUNT_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  activateAccountThunk,
  deactivateAccountThunk,
  deleteAccountThunk,
} from "@/features/auth/auth.thunks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

/**
 * Configuration des actions dangereuses disponibles
 */
const dangerousItems = [
  {
    id: "status",
    title: "items.danger_zone.status.title",
    description: "items.danger_zone.status.description",
  },
  {
    id: "delete",
    title: "items.danger_zone.delete.title",
    description: "items.danger_zone.delete.description",
  },
];

/**
 * Page de gestion des actions dangereuses liees au compte utilisateur
 */
export function DangerZonePage() {
  // Hook de traduction
  const { t } = useTranslation(["settings", "common", "codes"]);
  // Dispatch pour les actions redux
  const dispatch = useDispatch();
  // Recuperation des informations de l'utilisateur connecte
  const { user, loading } = useSelector(authSelector);
  // Etat local pour gerer l'ouverture du dialog de confirmation
  const [activeDialog, setActiveDialog] = useState(null);
  // Fonction pour fermer le dialog
  const closeDialog = () => setActiveDialog(null);
  // Gestion des actions dangereuses
  const handleAccountAction = async (actionId) => {
    // Determination de l'action a effectuer en fonction de l'action demandee et du status actuel de l'utilisateur
    const action =
      actionId === "delete"
        ? deleteAccountThunk
        : user?.status === ACCOUNT_STATUS.ACTIF
          ? deactivateAccountThunk
          : activateAccountThunk;
    try {
      // Execution de l'action et attente de sa resolution
      const { code } = await dispatch(action()).unwrap();
      // Afficher message de succes
      toast.success(t(`codes:${code}`));
      // Fermer le dialog de confirmation
      closeDialog();
    } catch ({ code, details: errors }) {
      // Affichage d'une notification d'erreur en cas d'echec de l'action
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("items.danger_zone.title")}</CardTitle>
        <CardDescription>{t("items.danger_zone.description")}</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link to="/settings">{t("action.back_to_settings")}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <ItemGroup className="gap-5">
          {dangerousItems.map(({ id, title, description }) => {
            const isDeleteAction = id === "delete";
            const isDisabled =
              loading.deleteAccount ||
              loading.activateAccount ||
              loading.deactivateAccount;
            const actionLabel = isDeleteAction
              ? t("items.danger_zone.delete.action")
              : t(
                  `items.danger_zone.status.actions.${user?.status === ACCOUNT_STATUS.ACTIF ? "deactivate" : "activate"}`,
                );

            return (
              <Item
                key={id}
                variant={isDeleteAction ? "destructive" : "muted"}
                className={`p-10 ${isDeleteAction ? "bg-destructive/5 " : "hover:bg-muted"}`}
              >
                <ItemContent>
                  <ItemTitle>{t(title)}</ItemTitle>
                  <ItemDescription>{t(description)}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ReusableDialog
                    open={activeDialog === id}
                    onOpenChange={(open) => !open && closeDialog()}
                    triggerLabel={actionLabel}
                    triggerProps={{
                      variant: "link",
                      disabled: isDisabled,
                      onClick: () => setActiveDialog(id),
                    }}
                    title={
                      isDeleteAction
                        ? t("items.danger_zone.delete.dialog.title")
                        : t("items.danger_zone.status.dialog.title")
                    }
                    description={
                      isDeleteAction
                        ? t("items.danger_zone.delete.dialog.description")
                        : t("items.danger_zone.status.dialog.description", {
                            action: actionLabel.toLowerCase(),
                          })
                    }
                    confirmLabel={t("common:actions.confirm")}
                    cancelLabel={t("common:actions.cancel")}
                    confirmVariant={isDeleteAction ? "destructive" : "default"}
                    onConfirm={() => handleAccountAction(id)}
                    disabled={isDisabled}
                    loading={isDisabled}
                  />
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </CardContent>
    </>
  );
}
