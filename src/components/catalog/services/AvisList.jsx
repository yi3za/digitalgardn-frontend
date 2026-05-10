import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  DataEmpty,
  DataError,
  DataLoading,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { Star } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

/**
 * Composant qui affiche la liste des avis d'un service avec pagination
 */
export function AvisList({
  avis = [],
  meta = null,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  isError = false,
  error,
  refetch,
  t,
  className,
}) {
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className={`shadow-none ${className}`}>
      <CardHeader>
        <CardTitle>{t("catalog:avis.title")}</CardTitle>
        <CardDescription>{t("catalog:avis.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            retryText={t("common:actions.retry")}
            onRetry={refetch}
          />
        )}
        {!isLoading && !isError && avis.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && avis.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {meta?.total ?? avis.length} {t("catalog:avis.count_suffix")}
            </p>
            <ItemGroup className="gap-3">
              {avis.map((item) => (
                <Item key={item.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      <AvatarIdentity user={item?.client} />
                    </ItemTitle>
                    {item?.commentaire && (
                      <ItemDescription>{item.commentaire}</ItemDescription>
                    )}
                    <ItemDescription className="text-xs">
                      {formatDateTime(item?.created_at)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < item.note
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
            <PaginationBar
              currentPage={currentPage}
              lastPage={meta?.last_page}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
