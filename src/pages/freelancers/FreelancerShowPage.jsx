import { useMemo, useState } from "react";
import { ServicesGrid } from "@/components/catalog";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
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
  Spinner,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  ACCOUNT_STATUS_BADGE_VARIANT,
  AUTH_ROLE,
} from "@/features/auth/auth.constants";
import { useCreateConversation } from "@/features/messages/messages.mutations";
import {
  useAdminFreelancer,
  useAdminFreelancerAvis,
} from "@/features/admin/freelancers/freelancers.query";
import {
  useFreelancer,
  useFreelancerAvis,
} from "@/features/public/catalog/freelancers/freelancers.query";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { getFallbackName } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { SkillBadges } from "@/components/shared/SkillBadges";
import { AvisList } from "@/components/catalog/services/AvisList";

/**
 * Page d'affichage d'un freelance. Fonctionne en mode public et admin.
 * En mode admin (via NavigationContext), utilise les hooks admin sans filtres de statut.
 */
export function FreelancerShowPage() {
  // Recuperation du username dans les params d'URL pour charger le freelance correspondant
  const { username } = useParams();
  // Hook de navigation pour rediriger vers la messagerie
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common", "codes", "admin"]);
  // Recuperation du contexte de navigation (admin ou public)
  const { isAdmin: isAdminCtx, competences: competencesPath } =
    useNavigationPaths();
  // Recuperation de l'utilisateur connecte
  const { user: currentUser } = useSelector(authSelector);
  // Determination du mode admin (contexte layout ou role utilisateur)
  const isAdmin = isAdminCtx || currentUser?.role === AUTH_ROLE.ADMIN;
  // Filtres pour les services du freelance
  const [serviceFilters, setServiceFilters] = useState({});
  // Les deux hooks sont appeles : null desactive le hook non utilise (enabled: !!username)
  const publicFreelancerQuery = useFreelancer(isAdmin ? null : username, serviceFilters);
  // Hook admin : charge le freelance depuis l'API admin (tous statuts)
  const adminFreelancerQuery = useAdminFreelancer(isAdmin ? username : null, serviceFilters);
  // Selection de la requete active selon le contexte
  const freelancerQuery = isAdmin
    ? adminFreelancerQuery
    : publicFreelancerQuery;
  // Hook public : charge les avis du freelance (statut actif uniquement)
  const publicAvisQuery = useFreelancerAvis(isAdmin ? null : username);
  // Hook admin : charge les avis du freelance sans filtre de statut
  const adminAvisQuery = useAdminFreelancerAvis(isAdmin ? username : null);
  // Selection de la requete d'avis active selon le contexte
  const avisQuery = isAdmin ? adminAvisQuery : publicAvisQuery;
  // Mutation pour creer/recuperer la conversation avec le freelance
  const createConversationMutation = useCreateConversation();
  // Destructuration des etats de la requete pour faciliter l'acces aux donnees
  const { data, isLoading, isError, isFetching, error, refetch } =
    freelancerQuery;
  // Determination du code d'erreur pour afficher un message adapte
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Recuperation du freelance depuis la reponse
  const freelancer = data?.freelancer;
  // Recuperation des services publies par le freelance
  const services = data?.services ?? [];
  // Determine si le profil affiche appartient a l'utilisateur connecte
  const isOwnFreelancer = currentUser?.id === freelancer?.id;
  // Options de filtre par competence a partir des competences du freelance
  const competenceOptions = useMemo(
    () =>
      (freelancer?.competences ?? []).map((c) => ({
        value: c.slug,
        label: c.nom,
      })),
    [freelancer],
  );
  // Configuration des filtres disponibles pour les services
  const SERVICES_FILTERS_CONFIG = [
    { key: "search", type: "input" },
    ...(competenceOptions.length
      ? [{ key: "competence", type: "select", options: competenceOptions }]
      : []),
  ];
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
      // Si l'erreur est une erreur d'authentification, rediriger vers la page de login
      if (code === "UNAUTHENTICATED") navigate("/login");
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
          {!isOwnFreelancer && !isAdmin && (
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
                {getFallbackName(freelancer?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">
                {freelancer?.name}
                {isAdmin && freelancer?.status && (
                  <Badge
                    className="mx-3"
                    variant={
                      ACCOUNT_STATUS_BADGE_VARIANT[freelancer.status] ??
                      "secondary"
                    }
                  >
                    {t(`admin:users.statuses.${freelancer.status}`)}
                  </Badge>
                )}
              </p>
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
            <SkillBadges
              title={t("catalog:freelancer.competencesTitle")}
              items={freelancer.competences}
              BadgeVariant="secondary"
              path={competencesPath}
            />
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
          <FilterBar
            t={t}
            filtersConfig={SERVICES_FILTERS_CONFIG}
            onApply={setServiceFilters}
          />
          {services.length ? (
            <ServicesGrid services={services} isAdmin={isAdmin} />
          ) : (
            <DataEmpty description={t("common:states.empty")} />
          )}
        </CardContent>
      </Card>
      <AvisList
        avis={avisQuery.data ?? []}
        isLoading={avisQuery.isLoading}
        isError={avisQuery.isError}
        error={avisQuery.error}
        refetch={avisQuery.refetch}
        t={t}
      />
    </div>
  );
}
