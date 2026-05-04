import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
  ItemGroup,
  Button,
  ScrollArea,
  Spinner,
} from "@/components/ui";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";

/**
 * Liste des derniers services en attente d'approbation (dashboard admin)
 */
export function AdminRecentServicesList({
  t,
  services = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {t("admin:dashboard.activite.services.title")}
          {isFetching && <Spinner className="inline ml-2" />}
        </CardTitle>
        <CardDescription>
          {t("admin:dashboard.activite.services.description")}
        </CardDescription>
        <CardAction>
          <Button variant="link" size="sm" asChild>
            <Link to="/admin/services">
              {t("admin:dashboard.activite.services.viewAll")}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && services.length === 0 && (
          <DataEmpty
            description={t("admin:dashboard.activite.services.empty")}
          />
        )}
        {!isLoading && !isError && services.length > 0 && (
          <ScrollArea className="h-80">
            <ItemGroup className="gap-3">
              {services.map((service) => (
                <ServiceMiniCard key={service.slug} service={service} />
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
