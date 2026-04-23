import { useSelector } from "react-redux";
import { Button, Spinner } from "@/components/ui";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useService } from "@/features/public/catalog/services/services.query";
import { authSelector } from "@/features/auth/auth.selectors";
import { useCreateCommande } from "@/features/account/commandes/commandes.mutations";
import {
  useCreateConversation,
  useSendMessage,
} from "@/features/messages/messages.mutations";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ServiceInstructionsDialog } from "@/components/shared/ServicePurchaseDialog";
import { useState } from "react";

/**
 * Page publique d'affichage d'un service
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de navigation pour rediriger vers la messagerie
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "validation", "codes"]);
  // Requete pour recuperer les informations du service et de son freelance
  const serviceQuery = useService(slug);
  // Mutation pour creer une commande
  const createCommandeMutation = useCreateCommande();
  // Mutation pour creer/recuperer une conversation
  const createConversationMutation = useCreateConversation();
  // Mutation pour envoyer un message dans la conversation
  const sendMessageMutation = useSendMessage();
  // Determination d'un etat de chargement global pour l'achat
  const isPurchasePending =
    createCommandeMutation.isPending ||
    createConversationMutation.isPending ||
    sendMessageMutation.isPending;
  // Recuperation de l'utilisateur
  const { user: currentUser } = useSelector(authSelector);
  // Destructuration des etats de la requete pour faciliter
  const { data: service, isLoading, isError, error, refetch } = serviceQuery;
  // Recuperation de l'utlisateur proprietaire du service
  const user = service?.user;
  // IsOwnService permet de determiner si le service affiche appartient a l'utilisateur connecte
  const isOwnService = currentUser?.id === user?.id;
  // Gestion du clic sur le bouton d'achat du service
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);
  // Fonction de gestion du clic sur le bouton d'achat
  const handleBuy = async (instructions) => {
    // Verification
    if (!service?.id || !user?.id) return;
    try {
      // Cree la commande depuis le service
      const commande = await createCommandeMutation.mutateAsync({
        service_id: service.id,
        instructions,
      });
      // Cree ou recupere la conversation avec le freelance
      const conversation = await createConversationMutation.mutateAsync({
        receiver_id: user.id,
        commande_id: commande.id,
      });
      // Envoie un message structure contenant l'item de service commande
      const messageContent = [
        `📦  ${t("serviceShow.commande.title")}`,
        ``,
        `🛠️ ${service?.titre ?? "-"}`,
        `💰 ${t("serviceShow.priceLabel")} : ${commande?.montant ?? service?.prix_base ?? "-"} ${t("serviceShow.priceSuffix")}`,
        `⏳ ${t("serviceShow.delayLabel")} : ${service?.delai_livraison ?? "-"} ${t("serviceShow.delaySuffix")}`,
        `🔁 ${t("serviceShow.revisionsLabel")} : ${service?.revisions ?? "-"}`,
        ``,
        `📝 ${t("serviceShow.commande.instructionsLabel")} :`,
        `${commande?.instructions ?? t("serviceShow.commande.noInstructions")}`,
      ].join("\n");
      if (conversation?.id) {
        await sendMessageMutation.mutateAsync({
          conversationId: conversation.id,
          data: { content: messageContent },
        });
        setInstructionsDialogOpen(false);
        // Redirection vers la messagerie avec la conversation ouverte
        navigate("/messages", {
          state: { conversationId: conversation.id },
        });
      }
      // Notification de succes puis redirection vers les transactions
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      // Redirection vers le portefeuille si le client n'a pas assez de solde pour acheter le service
      const status = error?.response?.status;
      if (status === 400) navigate("/portefeuille");
      // Determination du code d'erreur pour afficher une notification adaptee
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <div className="flex flex-col gap-5 flex-1">
      <ServiceDetailsCard
        service={service}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        t={t}
        showFreelancerSection={true}
        footerActions={
          !isOwnService && (
            <ServiceInstructionsDialog
              t={t}
              triggerLabel={
                <>
                  <ShoppingCart /> {t("catalog:serviceShow.buy")}
                </>
              }
              triggerProps={{
                disabled: isPurchasePending,
              }}
              open={instructionsDialogOpen}
              onOpenChange={setInstructionsDialogOpen}
              onConfirm={handleBuy}
              loading={isPurchasePending}
              disabled={isPurchasePending}
            />
          )
        }
      />
    </div>
  );
}
