import { CommandeItem } from "@/components/commandes/CommandeItem";
import { RecentList } from "@/components/shared/RecentList";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { CommandesSkeleton } from "@/components/skeletons";

/**
 * Liste des dernieres commandes recentes du freelance
 */
export function DashboardRecentCommandes({
  t,
  commandes = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  const {
    commandes: commandesBasePath,
    messages: messagesBasePath,
  } = useNavigationPaths();

  return (
    <RecentList
      t={t}
      titleKey="dashboard:activity.title"
      descriptionKey="dashboard:activity.description"
      viewAllKey="common:actions.viewAll"
      emptyKey="common:states.empty"
      linkTo={commandesBasePath}
      items={commandes}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      error={error}
      refetch={refetch}
      loadingSkeleton={CommandesSkeleton}
      renderItem={(commande) => (
        <CommandeItem
          key={commande.id}
          item={commande}
          linkTo={messagesBasePath}
          t={t}
        />
      )}
    />
  );
}
