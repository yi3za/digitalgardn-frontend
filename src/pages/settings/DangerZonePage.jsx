import {
  Button,
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
} from "@/components/ui";
import { ACCOUNT_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  activateAccountThunk,
  deactivateAccountThunk,
  deleteAccountThunk,
} from "@/features/auth/auth.thunks";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
  const { t } = useTranslation(["settings", "codes"]);
  // Dispatch pour les actions redux
  const dispatch = useDispatch();
  // Recuperation des informations de l'utilisateur connecte
  const { user } = useSelector(authSelector);
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
      toast.success(t(`codes:${code}`));
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
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <ItemGroup className="gap-5">
          {dangerousItems.map(({ id, title, description }) => {
            const isDeleteAction = id === "delete";
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
                  <Button
                    variant="link"
                    onClick={() => handleAccountAction(id)}
                  >
                    {isDeleteAction
                      ? t("items.danger_zone.delete.action")
                      : t(
                          `items.danger_zone.status.actions.${user?.status === ACCOUNT_STATUS.ACTIF ? "deactivate" : "activate"}`,
                        )}
                  </Button>
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </CardContent>
    </>
  );
}
