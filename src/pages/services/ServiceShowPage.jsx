import { useSelector } from "react-redux";
import { Button } from "@/components/ui";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useService } from "@/features/public/catalog/services/services.query";
import { authSelector } from "@/features/auth/auth.selectors";
import { useCreateConversation } from "@/features/messages/messages.mutations";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/**
 * Page publique d'affichage d'un service
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de navigation pour rediriger vers la messagerie
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "codes"]);
  // Requete pour recuperer les informations du service et de son freelance
  const serviceQuery = useService(slug);
  // Mutation pour creer/recuperer la conversation avec le freelance
  const createConversationMutation = useCreateConversation();
  // Recuperation de l'utilisateur
  const { user: currentUser } = useSelector(authSelector);
  // Destructuration des etats de la requete pour faciliter
  const { data: service, isLoading, isError, error, refetch } = serviceQuery;
  // Recuperation du l'utlisateur proprietaire du service pour afficher les informations le concernant et permettre de le contacter
  const user = service?.user;
  // IsOwnService permet de determiner si le service affiche appartient a l'utilisateur connecte
  const isOwnService = currentUser?.id === user?.id;
  // Fonction de gestion du clic sur le bouton d'achat pour demarrer une conversation avec le freelance proprietaire du service et acceder a la messagerie
  const handleBuy = async () => {
    // Verification
    if (!user?.id) return;
    try {
      // Creer et recuperer la conversation avec le freelance proprietaire du service
      const conversation = await createConversationMutation.mutateAsync({
        receiver_id: user.id,
      });
      // Redirection vers la messagerie avec l'ID de la conversation
      navigate("/messages", {
        state: { conversationId: conversation?.id ?? null },
      });
    } catch (error) {
      // Determination du code d'erreur pour afficher une notification adapte en cas de probleme de creation de la conversation
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      // En cas d'erreur, afficher une notification generique
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
            <Button
              onClick={handleBuy}
              disabled={createConversationMutation.isPending}
            >
              <ShoppingCart /> {t("catalog:serviceShow.buy")}
            </Button>
          )
        }
      />
    </div>
  );
}
