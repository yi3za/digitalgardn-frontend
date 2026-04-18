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
import { AlertCircle, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  action = null,
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
    <Card className="shadow-none rounded-none border-none flex-1 min-h-50">
      <CardHeader>
        <CardTitle>
          {title}
          {isFetching && <Spinner className="inline mx-5" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {isLoading && <Skeleton className="flex-1" />}
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
            ) : (
              <ItemGroup className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items?.map((item) => (
                  <Item
                    key={item.id}
                    linkTo={linkTo}
                    item={item}
                    dashboard={dashboard}
                  />
                ))}
              </ItemGroup>
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
