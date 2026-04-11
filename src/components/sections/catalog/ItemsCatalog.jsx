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
} from "../../ui";
import { AlertCircle, ArrowRight, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ItemCatalog } from "./ItemCatalog";

/**
 * Composant qui affiche une liste d'elements du catalogue
 */
export function ItemsCatalog({ itemsQuery, title, description, linkTo }) {
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
    <Card className="my-10 shadow-none rounded-none">
      <CardHeader>
        <CardTitle>
          {title}
          {isFetching && <Spinner className="inline mx-5" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button asChild variant="link">
            <Link to={linkTo}>
              {t("common.viewAll")} <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-20">
        {isLoading && <Skeleton className="h-full" />}
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
            <ScrollArea>
              <div className="flex gap-4 mb-8">
                {items?.map((item) => (
                  <ItemCatalog key={item.id} linkTo={linkTo} item={item} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
