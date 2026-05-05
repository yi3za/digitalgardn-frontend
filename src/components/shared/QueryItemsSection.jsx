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
  Button,
} from "@/components/ui";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Section generique basee sur une query de liste
 */
export function QueryItemsSection({
  itemsQuery,
  title,
  description,
  action = null,
  filterBar = null,
  paginationBar = null,
  limit = null,
  isDark = false,
  renderItems,
  emptyDescription,
}) {
  // Hook de traduction pour les textes statiques de la section et les codes d'erreur
  const { t } = useTranslation(["common", "codes"]);
  // Destructuration des donnees et etats de la query
  const { data, isSuccess, isLoading, isFetching, isError, error, refetch } =
    itemsQuery;
  // Retro-compatibilite : la data peut etre un tableau direct ou un objet {items, meta}
  const rawItems = data?.items ?? data ?? [];
  // Limite optionnelle : affiche seulement les N premiers elements (usage homepage)
  const items = limit ? rawItems.slice(0, limit) : rawItems;
  // Recuperation du code d'erreur ou valeur par defaut NETWORK_ERROR
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card
      className={`shadow-none border-none flex-1 min-h-50 ${isDark ? "bg-transparent" : ""}`}
    >
      <CardHeader>
        <CardTitle>
          {title}
          {isFetching && <Spinner className="inline mx-3" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          {action ? (
            action
          ) : (
            <Button size="sm" variant="ghost" onClick={refetch}>
              <RefreshCw className="size-4" />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {filterBar}
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            retryText={t("common:actions.retry")}
            onRetry={refetch}
          />
        )}
        {isSuccess &&
          (items?.length > 0 ? (
            renderItems(items)
          ) : (
            <DataEmpty
              description={emptyDescription ?? t("common:states.empty")}
            />
          ))}
        {paginationBar}
      </CardContent>
    </Card>
  );
}
