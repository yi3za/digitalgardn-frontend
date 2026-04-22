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
import {
  getServiceStatusBadgeVariant,
  getServiceStatusTextKey,
} from "@/features/freelance/catalog/services/services.status";

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
  categoryBadgeVariant = "outline",
  competenceBadgeVariant = "secondary",
  refreshTextKey = "common:actions.retry",
  notAvailableDescriptionKey = "common:states.empty",
  priceLabelKey = "serviceShow.priceLabel",
  priceSuffixKey = "serviceShow.priceSuffix",
  delayLabelKey = "serviceShow.delayLabel",
  delaySuffixKey = "serviceShow.delaySuffix",
  revisionsLabelKey = "serviceShow.revisionsLabel",
  categoriesTitleKey = "serviceShow.categories.title",
  competencesTitleKey = "serviceShow.competences.title",
  statusDraftKey = "serviceShow.status.draft",
  freelancerSectionTitleKey = "serviceShow.freelancerSection",
  freelancerSectionDescriptionKey = "serviceShow.freelancerSectionDescription",
}) {
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme de chargement du service
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Collecte des images du service pour les afficher dans le carousel
  const serviceImages = collectServiceImages(service);

  if (isLoading) {
    return <DataLoading />;
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
              <Carousel className="rounded-lg border overflow-hidden w-full h-full bg-muted flex justify-center items-center">
                <CarouselContent>
                  {serviceImages.map((imageUrl, index) => (
                    <CarouselItem key={`${service.id}-image-${index}`}>
                      <img
                        src={imageUrl}
                        alt={`${service?.titre}-${index + 1}`}
                        className="object-contain"
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
                  <Badge variant={getServiceStatusBadgeVariant(service.statut)}>
                    {t(getServiceStatusTextKey(service.statut, statusDraftKey))}
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
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {t(categoriesTitleKey)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(service.categories ?? []).map((category) => (
                    <Badge
                      key={`category-${category.id}`}
                      variant={categoryBadgeVariant}
                    >
                      {category.nom}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {t(competencesTitleKey)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(service.competences ?? []).map((competence) => (
                    <Badge
                      key={`competence-${competence.id}`}
                      variant={competenceBadgeVariant}
                    >
                      {competence.nom}
                    </Badge>
                  ))}
                </div>
              </div>
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
    </>
  );
}
