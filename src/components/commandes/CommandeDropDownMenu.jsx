import { Ellipsis } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from "../ui";
import { COMMANDE_STATUS } from "@/features/account/commandes/commandes.status";
import { useUpdateCommandeStatus } from "@/features/account/commandes/commandes.mutations";
import { toast } from "sonner";
/**
 * Composant affichant le menu deroulant pour les actions sur une commande
 */
export function CommandeDropDownMenu({ t, commande, isVendor }) {
  // Hook de mutation pour mettre a jour le statut de la commande
  const updateCommandeStatus = useUpdateCommandeStatus();
  // Fonction pour gerer la mise a jour du statut de la commande
  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateCommandeStatus.mutateAsync({
        commandeId: commande.id,
        newStatus,
      });
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={updateCommandeStatus.isPending}
        >
          {updateCommandeStatus.isPending ? <Spinner /> : <Ellipsis />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {isVendor && commande?.statut === COMMANDE_STATUS.EN_ATTENTE && (
            <DropdownMenuItem asChild>
              <button
                className="w-full"
                onClick={() => handleUpdateStatus(COMMANDE_STATUS.EN_COURS)}
              >
                {t("commandes:actions.start")}
              </button>
            </DropdownMenuItem>
          )}
          {isVendor && commande?.statut === COMMANDE_STATUS.EN_COURS && (
            <DropdownMenuItem asChild>
              <button
                className="w-full"
                onClick={() => handleUpdateStatus(COMMANDE_STATUS.LIVREE)}
              >
                {t("commandes:actions.deliver")}
              </button>
            </DropdownMenuItem>
          )}
          {isVendor && commande?.statut === COMMANDE_STATUS.EN_REVISION && (
            <DropdownMenuItem asChild>
              <button
                className="w-full"
                onClick={() => handleUpdateStatus(COMMANDE_STATUS.LIVREE)}
              >
                {t("commandes:actions.redeliver")}
              </button>
            </DropdownMenuItem>
          )}
          {!isVendor && commande?.statut === COMMANDE_STATUS.LIVREE && (
            <>
              <DropdownMenuItem asChild>
                <button
                  className="w-full"
                  onClick={() => handleUpdateStatus(COMMANDE_STATUS.TERMINEE)}
                >
                  {t("commandes:actions.accept")}
                </button>
              </DropdownMenuItem>
              {commande?.service?.revisions > commande?.revisions_utilisees && (
                <DropdownMenuItem asChild>
                  <button
                    className="w-full"
                    onClick={() =>
                      handleUpdateStatus(COMMANDE_STATUS.EN_REVISION)
                    }
                  >
                    {t("commandes:actions.revision")}
                  </button>
                </DropdownMenuItem>
              )}
            </>
          )}
          {!isVendor &&
            [COMMANDE_STATUS.EN_ATTENTE, COMMANDE_STATUS.EN_COURS].includes(
              commande?.statut,
            ) && (
              <DropdownMenuItem asChild>
                <button
                  className="w-full text-destructive"
                  onClick={() => handleUpdateStatus(COMMANDE_STATUS.ANNULEE)}
                >
                  {t("commandes:actions.cancel")}
                </button>
              </DropdownMenuItem>
            )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
