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
  ItemGroup,
  Separator,
} from "@/components/ui";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { Star } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

/**
 * Composant qui affiche la liste des avis d'un service
 */
export function AvisList({
  avis = [],
  isLoading = false,
  isError = false,
  error,
  refetch,
  t,
}) {
  // Determination du code d'erreur pour afficher un message d'erreur adapte en cas de probleme
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
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
        {(!avis || avis.length === 0) && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {avis.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {avis.length} {t("catalog:avis.count_suffix")}
            </p>
            <ItemGroup className="space-y-0">
              {avis.map((item, index) => (
                <div key={item.id || index}>
                  <Item
                    variant="outline"
                    className="flex-col items-start gap-3"
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <AvatarIdentity user={item?.client} />
                        <div className="flex items-center gap-1">
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
                        </div>
                      </div>
                      {item?.commentaire && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.commentaire}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {formatDateTime(item?.created_at)}
                      </p>
                    </div>
                  </Item>
                  {index < avis.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </ItemGroup>
          </>
        )}
      </CardContent>
    </Card>
  );
}
