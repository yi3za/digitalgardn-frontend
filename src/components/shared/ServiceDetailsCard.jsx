import {
  Badge,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DataEmpty,
  DataError,
  DataLoading,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  Separator,
} from "@/components/ui";
import { collectServiceImages, formatPrice } from "@/lib/utils";
import { ServiceFreelancerCard } from "@/components/shared/ServiceFreelancerCard";
import { AvisList } from "@/components/catalog/services/AvisList";
import { useServiceAvis } from "@/features/public/catalog/services/services.query";
import {
  serviceStatusBadgeVariantByStatut,
  serviceStatusTextKeyByStatut,
} from "@/features/freelance/catalog/services/services.status";
import { SkillBadges } from "./SkillBadges";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { useState } from "react";
import { ServiceDetailsSkeleton } from "@/components/skeletons";

/**
 * Composant de carte de details d'un service, utilise dans la page de details d'un service et dans la liste des services d'un freelance, avec gestion des etats de chargement, d'erreur et de service non disponible
 */
export function ServiceDetailsCard({
  service,
  isLoading = false,
  isError = false,
  error,
  refetch,
  t,
  showStatus = false,
  footerActions = null,
  showFreelancerSection = false,
  showAvis = false,
  avisQuery: externalAvisQuery = null,
  avisPage: controlledAvisPage,
  onAvisPageChange,
  categoryBadgeVariant = "outline",
  competenceBadgeVariant = "secondary",
  refreshTextKey = "common:actions.retry",
  notAvailableDescriptionKey = "common:states.empty",
  priceLabelKey = "catalog:serviceShow.priceLabel",
  priceSuffixKey = "catalog:serviceShow.priceSuffix",
  delayLabelKey = "catalog:serviceShow.delayLabel",
  delaySuffixKey = "catalog:serviceShow.delaySuffix",
  revisionsLabelKey = "catalog:serviceShow.revisionsLabel",
  categoriesTitleKey = "catalog:serviceShow.categoriesTitle",
  competencesTitleKey = "catalog:serviceShow.competencesTitle",
  freelancerSectionTitleKey = "catalog:serviceShow.freelancerSection",
  freelancerSectionDescriptionKey = "catalog:serviceShow.freelancerSectionDescription",
}) {
  const [internalAvisPage, setInternalAvisPage] = useState(1);
  const avisPage = controlledAvisPage ?? internalAvisPage;
  const setAvisPage = onAvisPageChange ?? setInternalAvisPage;
  // Si un avisQuery externe est fourni (ex: admin), on desactive l'appel public
  const internalAvisQuery = useServiceAvis(
    externalAvisQuery ? null : service?.slug,
    avisPage,
  );
  const avisQuery = externalAvisQuery ?? internalAvisQuery;
  // Recuperation des chemins de navigation selon le contexte (public ou admin)
  const { categories: categoriesPath, competences: competencesPath } =
    useNavigationPaths();
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme de chargement du service
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Collecte des images du service pour les afficher dans le carousel
  const serviceImages = collectServiceImages(service);

  if (isLoading) {
    return <DataLoading skeleton={ServiceDetailsSkeleton} />;
  }

  if (isError) {
    return (
      <DataError
        errorCode={code}
        retryText={t(refreshTextKey)}
        onRetry={refetch}
      />
    );
  }

  if (!service) {
    return <DataEmpty description={t(notAvailableDescriptionKey)} />;
  }

  return (
    <>
      <Card className="shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          <div className="px-6 flex items-center justify-center">
            {serviceImages.length > 0 ? (
              <Carousel className="rounded-lg border overflow-hidden w-full h-full bg-card flex items-center justify-center">
                <CarouselContent>
                  {serviceImages.map((imageUrl, index) => (
                    <CarouselItem key={`${service.id}-image-${index}`}>
                      <img
                        src={imageUrl}
                        alt={`${service?.titre}-${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {serviceImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            ) : (
              <DataEmpty
                className="h-full"
                description={t(notAvailableDescriptionKey)}
              />
            )}
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{service.titre}</h1>
                {showStatus && (
                  <Badge
                    variant={
                      serviceStatusBadgeVariantByStatut?.[service.statut]
                    }
                  >
                    {t(serviceStatusTextKeyByStatut?.[service.statut])}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
            <Separator />
            <ItemGroup className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Item variant="outline" className="py-3">
                <ItemContent>
                  <ItemDescription className="text-xs">
                    {t(priceLabelKey)}
                  </ItemDescription>
                  <ItemTitle className="text-lg">
                    {formatPrice(service.prix_base)} {t(priceSuffixKey)}
                  </ItemTitle>
                </ItemContent>
              </Item>
              <Item variant="outline" className="py-3">
                <ItemContent>
                  <ItemDescription className="text-xs">
                    {t(delayLabelKey)}
                  </ItemDescription>
                  <ItemTitle className="text-lg">
                    {service.delai_livraison} {t(delaySuffixKey)}
                  </ItemTitle>
                </ItemContent>
              </Item>
              <Item variant="outline" className="py-3">
                <ItemContent>
                  <ItemDescription className="text-xs">
                    {t(revisionsLabelKey)}
                  </ItemDescription>
                  <ItemTitle className="text-lg">{service.revisions}</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
            <div className="space-y-3">
              <SkillBadges
                title={t(categoriesTitleKey)}
                items={service.categories}
                BadgeVariant={categoryBadgeVariant}
                path={categoriesPath}
              />
              <SkillBadges
                title={t(competencesTitleKey)}
                items={service.competences}
                BadgeVariant={competenceBadgeVariant}
                path={competencesPath}
              />
            </div>
            {footerActions}
          </CardContent>
        </div>
      </Card>
      {showFreelancerSection && service?.user && (
        <ServiceFreelancerCard
          user={service.user}
          t={t}
          titleKey={freelancerSectionTitleKey}
          descriptionKey={freelancerSectionDescriptionKey}
        />
      )}
      {showAvis && (
        <AvisList
          avis={avisQuery.data?.items ?? []}
          meta={avisQuery.data?.meta ?? null}
          currentPage={avisQuery.data?.meta?.current_page ?? avisPage}
          onPageChange={setAvisPage}
          isLoading={avisQuery.isLoading}
          isError={avisQuery.isError}
          error={avisQuery.error}
          refetch={avisQuery.refetch}
          t={t}
        />
      )}
    </>
  );
}
