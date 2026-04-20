import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CustomAlert,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  Separator,
  Skeleton,
} from "@/components/ui";
import {
  cn,
  collectServiceImages,
  formatPrice,
  getFallbackName,
} from "@/lib/utils";
import {
  getServiceStatusBadgeVariant,
  getServiceStatusTextKey,
} from "@/features/freelance/catalog/services/services.status";
import { AlertCircle, ImageOff } from "lucide-react";

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
  refreshTextKey = "sections:common.refresh",
  notAvailableTitleKey = "sections:common.notAvailable.title",
  notAvailableDescriptionKey = "sections:common.notAvailable.description",
  galleryEmptyTitleKey = "sections:serviceShow.galleryEmptyTitle",
  galleryEmptyDescriptionKey = "sections:serviceShow.galleryEmptyDescription",
  priceLabelKey = "sections:serviceShow.priceLabel",
  priceSuffixKey = "sections:serviceShow.priceSuffix",
  delayLabelKey = "sections:serviceShow.delayLabel",
  delaySuffixKey = "sections:serviceShow.delaySuffix",
  revisionsLabelKey = "sections:serviceShow.revisionsLabel",
  categoriesTitleKey = "sections:categories.title",
  competencesTitleKey = "sections:competences.title",
  statusDraftKey = "services.show.status.draft",
  freelancerSectionTitleKey = "sections:serviceShow.freelancerSection",
  freelancerSectionDescriptionKey = "sections:serviceShow.freelancerSectionDescription",
}) {
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme de chargement du service
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Collecte des images du service pour les afficher dans le carousel
  const serviceImages = collectServiceImages(service);

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
        refreshText={t(refreshTextKey)}
      />
    );
  }

  if (!service) {
    return (
      <CustomAlert
        header={t(notAvailableTitleKey)}
        body={t(notAvailableDescriptionKey)}
        icon={AlertCircle}
        onRefetch={refetch}
        refreshText={t(refreshTextKey)}
      />
    );
  }

  return (
    <>
      <Card className="shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          <div className="px-6 flex items-center justify-center">
            {serviceImages.length > 0 ? (
              <Carousel className="rounded-lg border overflow-hidden h-full bg-muted flex justify-center items-center">
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
              <Empty className="h-full min-h-72 border border-dashed bg-background/60">
                <EmptyHeader>
                  <ImageOff className="size-8 text-muted-foreground" />
                  <EmptyTitle>{t(galleryEmptyTitleKey)}</EmptyTitle>
                  <EmptyDescription>
                    {t(galleryEmptyDescriptionKey)}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
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
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t(freelancerSectionTitleKey)}</CardTitle>
            <CardDescription>
              {t(freelancerSectionDescriptionKey)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage
                  src={service.user.avatar_url}
                  alt={service.user.name}
                />
                <AvatarFallback>
                  {getFallbackName(
                    service.user.name || service.user.username,
                  ) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className={cn("min-w-0")}>
                <p className="font-medium truncate">
                  {service.user.name || service.user.username}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  @{service.user.username}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
