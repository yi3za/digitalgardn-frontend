import { useSelector } from "react-redux";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useService } from "@/features/public/catalog/services/services.query";
import {
  useAdminService,
  useAdminServiceAvis,
} from "@/features/admin/services/services.query";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
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
 * Page d'affichage d'un service. Fonctionne en mode public et admin.
 * En mode admin (via NavigationContext), utilise les hooks admin sans filtres de statut.
 */
export function ServiceShowPage() {
  // Recuperation du slug du service depuis les params d'URL
  const { slug } = useParams();
  // Hook de navigation pour la redirection apres achat
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "validation", "codes", "common"]);
  // Recuperation du contexte de navigation (admin ou public)
  const {
    isAdmin: isAdminCtx,
    competences: competencesPath,
    categories: categoriesPath,
  } = useNavigationPaths();
  // Recuperation de l'utilisateur connecte
  const { user: currentUser } = useSelector(authSelector);
  // Determination du mode admin (contexte layout ou role utilisateur)
  const isAdmin = isAdminCtx || currentUser?.role === AUTH_ROLE.ADMIN;
  // Les deux hooks sont appeles : null desactive le hook non utilise (enabled: !!slug)
  const publicServiceQuery = useService(isAdmin ? null : slug);
  // Hook admin : charge le service depuis l'API admin (tous statuts)
  const adminServiceQuery = useAdminService(isAdmin ? slug : null);
  // Hook admin : charge les avis du service sans filtre de statut
  const adminAvisQuery = useAdminServiceAvis(isAdmin ? slug : null);
  // Selection de la requete active selon le contexte
  const serviceQuery = isAdmin ? adminServiceQuery : publicServiceQuery;
  // Mutations pour l'achat (public uniquement)
  const createCommandeMutation = useCreateCommande();
  // Mutation pour creer/recuperer une conversation liee a la commande
  const createConversationMutation = useCreateConversation();
  // Mutation pour envoyer un message dans la conversation
  const sendMessageMutation = useSendMessage();
  // Etat de chargement global pendant le processus d'achat
  const isPurchasePending =
    createCommandeMutation.isPending ||
    createConversationMutation.isPending ||
    sendMessageMutation.isPending;
  // Destructuration des etats de la requete du service
  const { data: service, isLoading, isError, error, refetch } = serviceQuery;
  // Recuperation du proprietaire du service
  const user = service?.user;
  // Determine si le service affiche appartient a l'utilisateur connecte
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
      // Recuperer la conversation de la commande
      const conversationId = commande?.conversation?.id;
      // Fermer la dialog d'instructions
      setInstructionsDialogOpen(false);
      // Redirection vers la messagerie avec la conversation ouverte
      navigate("/messages", {
        state: { conversationId },
      });
      // Notification de succes puis redirection vers les transactions
      toast.success(t("codes:SUCCESS"));
    } catch (error) {
      // Determination du code d'erreur pour afficher une notification adaptee
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      // Redirection vers la page de connexion si l'erreur est une erreur d'authentification
      if (code === "UNAUTHENTICATED") navigate("/login");
      // Redirection vers la page de portefeuille si l'erreur est une erreur de solde insuffisant
      if (code === "BAD_REQUEST") navigate("/portefeuille");
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
        showFreelancerSection={!isOwnService}
        showAvis={true}
        showStatus={isAdmin}
        avisQuery={isAdmin ? adminAvisQuery : null}
        competencesPath={competencesPath}
        categoriesPath={categoriesPath}
        footerActions={
          !isOwnService &&
          !isAdmin && (
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
