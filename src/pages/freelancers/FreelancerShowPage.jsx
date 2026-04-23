import { ServicesGrid } from "@/components/catalog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataEmpty,
  DataError,
  DataLoading,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  ItemGroup,
  Spinner,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { useCreateConversation } from "@/features/messages/messages.mutations";
import { useFreelancer } from "@/features/public/catalog/freelancers/freelancers.query";
import { getFallbackName } from "@/lib/utils";
import { Layers, MessageCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";

/**
 * Page publique d'affichage d'un freelance
 */
export function FreelancerShowPage() {
  // Recuperation du username dans les params d'URL pour charger le freelance correspondant
  const { username } = useParams();
  // Hook de navigation pour rediriger vers la messagerie
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common", "codes"]);
  // Recuperation de l'utilisateur connecte
  const { user: currentUser } = useSelector(authSelector);
  // Mutation pour creer/recuperer la conversation avec le freelance
  const createConversationMutation = useCreateConversation();
  // Requete pour recuperer les informations du freelance et de ses services publies
  const freelancerQuery = useFreelancer(username);
  // Destructuration des etats de la requete pour faciliter
  const { data, isLoading, isError, isFetching, error, refetch } =
    freelancerQuery;
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme de chargement du freelance
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Recuperation du freelance et de ses services
  const freelancer = data?.freelancer;
  // Recuperation de la liste des services publies par le freelance pour les afficher dans la section correspondante
  const services = data?.services ?? [];
  // IsOwnFreelancer permet de determiner si le profil affiche appartient a l'utilisateur connecte
  const isOwnFreelancer = currentUser?.id === freelancer?.id;
  // Demarrer une conversation avec le freelance depuis sa page publique
  const handleContactFreelancer = async () => {
    if (!freelancer?.id) return;
    try {
      const conversation = await createConversationMutation.mutateAsync({
        receiver_id: freelancer.id,
      });
      navigate("/messages", {
        state: { conversationId: conversation?.id },
      });
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  };

  if (isLoading) {
    return <DataLoading />;
  }

  if (isError) {
    return (
      <DataError
        errorCode={code}
        retryText={t("common:actions.retry")}
        onRetry={refetch}
      />
    );
  }

  if (!freelancer) {
    return <DataEmpty description={t("common:states.empty")} />;
  }

  return (
    <div className="py-5 space-y-4">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {t("catalog:freelancer.profileTitle")}
            {isFetching && <Spinner className="inline mx-5" />}
          </CardTitle>
          <CardDescription>@{freelancer.username}</CardDescription>
          {!isOwnFreelancer && (
            <CardAction>
              <Button
                variant="link"
                onClick={handleContactFreelancer}
                disabled={createConversationMutation.isPending}
              >
                <MessageCircle />
                {t("catalog:freelancer.contact")}
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage
                src={freelancer?.avatar_url}
                alt={freelancer?.name}
              />
              <AvatarFallback>
                {getFallbackName(freelancer?.name || freelancer?.username) ||
                  "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{freelancer?.name}</p>
              <p className="text-sm text-muted-foreground">
                {freelancer?.profil?.titre ||
                  t("catalog:freelancer.defaultTitle")}
              </p>
            </div>
          </div>
          {freelancer?.profil?.biographie && (
            <p className="text-sm leading-relaxed">
              {freelancer.profil.biographie}
            </p>
          )}
          {freelancer?.profil?.site_web && (
            <a
              href={freelancer.profil.site_web}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline text-primary block my-5"
            >
              {freelancer.profil.site_web}
            </a>
          )}
          {!!freelancer?.competences?.length && (
            <div className="flex flex-wrap gap-2">
              {freelancer.competences.map((competence) => (
                <span
                  key={competence.id}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs"
                >
                  {competence.nom}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{t("catalog:freelancer.publishedServices")}</CardTitle>
          <CardDescription>
            {t("catalog:freelancer.servicesCount", {
              count: services.length,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length ? (
            <ServicesGrid services={services} linkTo="/services" />
          ) : (
            <Empty className="min-h-40 border">
              <EmptyHeader>
                <Layers className="size-8 text-muted-foreground" />
                <EmptyTitle>
                  {t("catalog:freelancer.noServices.title")}
                </EmptyTitle>
                <EmptyDescription>
                  {t("catalog:freelancer.noServices.description")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
