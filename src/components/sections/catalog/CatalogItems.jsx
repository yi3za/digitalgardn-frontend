import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  Skeleton,
  CardAction,
  ScrollBar,
  ScrollArea,
  Spinner,
  CustomAlert,
  ItemGroup,
} from "../../ui";
import { AlertCircle, ArrowRight, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * Composant qui affiche une liste d'elements du catalogue
 */
export function CatalogItems({
  itemsQuery,
  title,
  description,
  linkTo,
  item: Item = null,
  isScrollArea = false,
  dashboard = false,
}) {
  // Hook de traduction
  const { t } = useTranslation(["sections", "codes"]);
  // Destructuration des donnees et etats de la requete
  const {
    data: items,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = itemsQuery;
  // Recuperation du code d'erreur ou valeur par defaut NETWORK_ERROR
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="my-5 shadow-none rounded-none">
      <CardHeader>
        <CardTitle>
          {title}
          {isFetching && <Spinner className="inline mx-5" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        {!dashboard && (
          <CardAction>
            <Button asChild variant="link">
              <Link to={linkTo}>
                {t("common.viewAll")} <ArrowRight />
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="min-h-20">
        {isLoading && <Skeleton className="min-h-20" />}
        {isError && (
          <CustomAlert
            header={code}
            body={t(`codes:${code}`)}
            onRefetch={refetch}
            refreshText={t("common.refresh")}
            icon={AlertCircle}
            variant="destructive"
          />
        )}
        {isSuccess &&
          (items?.length > 0 ? (
            isScrollArea ? (
              <ScrollArea>
                <div className="flex gap-4 mb-8">
                  {items?.map((item) => (
                    <Item key={item.id} linkTo={linkTo} item={item} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : dashboard ? (
              <ItemGroup className="gap-5">
                {items?.map((item) => (
                  <Item
                    key={item.id}
                    linkTo={linkTo}
                    item={item}
                    dashboard={dashboard}
                  />
                ))}
              </ItemGroup>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-wrap">
                {items?.map((item) => (
                  <Item key={item.id} linkTo={linkTo} item={item} />
                ))}
              </div>
            )
          ) : (
            <CustomAlert
              header={t("common.notAvailable.title")}
              body={t("common.notAvailable.description")}
              onRefetch={refetch}
              refreshText={t("common.refresh")}
              icon={Ban}
            />
          ))}
      </CardContent>
    </Card>
  );
}
