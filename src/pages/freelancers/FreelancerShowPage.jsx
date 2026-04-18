import { ServicesGrid } from "@/components/sections/catalog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomAlert,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  ItemGroup,
  Skeleton,
  Spinner,
} from "@/components/ui";
import { useFreelancer } from "@/features/public/catalog/freelancers/freelancers.query";
import { getFallbackName } from "@/lib/utils";
import { AlertCircle, Layers } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Page publique d'affichage d'un freelance
 */
export function FreelancerShowPage() {
  // Recuperation du username dans les params d'URL pour charger le freelance correspondant
  const { username } = useParams();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["sections", "codes"]);
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

  if (isLoading) {
    return <Skeleton className="flex-1" />;
  }

  if (isError) {
    return (
      <CustomAlert
        header={code}
        body={t(`codes:${code}`)}
        icon={AlertCircle}
        variant="destructive"
        onRefetch={refetch}
        refreshText={t("common.refresh")}
      />
    );
  }

  if (!freelancer) {
    return (
      <CustomAlert
        header={t("common.notAvailable.title")}
        body={t("common.notAvailable.description")}
        icon={AlertCircle}
        onRefetch={refetch}
        refreshText={t("common.refresh")}
      />
    );
  }

  return (
    <section className="py-5 space-y-4">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {t("freelancer.profileTitle")}
            {isFetching && <Spinner className="inline mx-5" />}
          </CardTitle>
          <CardDescription>@{freelancer.username}</CardDescription>
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
                {freelancer?.profil?.titre || t("freelancer.defaultTitle")}
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
          <CardTitle>{t("freelancer.publishedServices")}</CardTitle>
          <CardDescription>
            {t("freelancer.servicesCount", {
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
                <EmptyTitle>{t("freelancer.noServices.title")}</EmptyTitle>
                <EmptyDescription>
                  {t("freelancer.noServices.description")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
