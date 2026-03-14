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
  ErrorAlert,
  Spinner,
  EmptyAlert,
} from "../ui";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ItemsSection({ itemsQuery, name }) {
  // Hook de traduction
  const { t } = useTranslation();
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
    <Card className="my-10">
      <CardHeader>
        <CardTitle>
          {t(`${name}.title`)}
          {isFetching && <Spinner className="inline mx-5" />}
        </CardTitle>
        <CardDescription>{t(`${name}.description`)}</CardDescription>
        <CardAction>
          <Button asChild variant="link">
            <Link to={`/${name}`}>
              {t(`${name}.viewAll`)} <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="h-20">
        {isLoading && <Skeleton className="h-full" />}
        {isError && (
          <ErrorAlert
            onRefetch={refetch}
            code={code}
            message={t(code)}
            refreshText={t("refresh")}
          />
        )}
        {isSuccess &&
          (items?.length > 0 ? (
            <ScrollArea>
              <div className="flex gap-4 mb-8">
                {items?.map((item) => (
                  <Button
                    asChild
                    variant="outline"
                    className="min-w-50"
                    key={item.id}
                  >
                    <Link to={`/${name}?slug=${item.slug}`}>{item.nom}</Link>
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <EmptyAlert
              titre={t(`${name}.title`) + " " + t("notAvailable.title")}
              description={t("notAvailable.description")}
              onRefetch={refetch}
              refreshText={t("refresh")}
            />
          ))}
      </CardContent>
    </Card>
  );
}
