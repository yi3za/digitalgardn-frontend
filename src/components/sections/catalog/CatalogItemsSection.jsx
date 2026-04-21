import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  Spinner,
  DataLoading,
  DataError,
  DataEmpty,
} from "@/components/ui";
import { useTranslation } from "react-i18next";

/**
 * Composant parent partage pour une section du catalogue
 */
export function CatalogItemsSection({
  itemsQuery,
  title,
  description,
  action = null,
  renderItems,
  emptyDescription,
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
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            retryText={t("common.refresh")}
            onRetry={refetch}
          />
        )}
        {isSuccess &&
          (items?.length > 0 ? (
            renderItems(items)
          ) : (
            <DataEmpty
              description={
                emptyDescription ?? t("common.notAvailable.description")
              }
            />
          ))}
      </CardContent>
    </Card>
  );
}
