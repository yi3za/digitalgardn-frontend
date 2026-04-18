import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  Skeleton,
  CardAction,
  Spinner,
  CustomAlert,
} from "@/components/ui";
import { AlertCircle, Ban } from "lucide-react";
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
  emptyTitle,
  emptyDescription,
  emptyIcon = Ban,
  errorVariant = "destructive",
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
            variant={errorVariant}
          />
        )}
        {isSuccess &&
          (items?.length > 0 ? (
            renderItems(items)
          ) : (
            <CustomAlert
              header={emptyTitle ?? t("common.notAvailable.title")}
              body={emptyDescription ?? t("common.notAvailable.description")}
              onRefetch={refetch}
              refreshText={t("common.refresh")}
              icon={emptyIcon}
            />
          ))}
      </CardContent>
    </Card>
  );
}
