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
import { RecentListSkeleton } from "@/components/skeletons";

/**
 * Composant generique pour les listes d'activite recente (dashboard admin et freelance)
 */
export function RecentList({
  t,
  titleKey,
  descriptionKey,
  viewAllKey,
  emptyKey,
  linkTo,
  items = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
  renderItem,
  scrollClassName = "h-80",
  loadingSkeleton = RecentListSkeleton,
  loadingSkeletonProps = {},
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {t(titleKey)}
          {isFetching && <Spinner className="inline ml-2" />}
        </CardTitle>
        <CardDescription>{t(descriptionKey)}</CardDescription>
        <CardAction>
          <Button variant="link" size="sm" asChild>
            <Link to={linkTo}>{t(viewAllKey)}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {isLoading && (
          <DataLoading
            skeleton={loadingSkeleton}
            skeletonProps={loadingSkeletonProps}
          />
        )}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && items.length === 0 && (
          <DataEmpty description={t(emptyKey)} />
        )}
        {!isLoading && !isError && items.length > 0 && (
          <ScrollArea className={scrollClassName}>
            <ItemGroup className="gap-3">{items.map(renderItem)}</ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
