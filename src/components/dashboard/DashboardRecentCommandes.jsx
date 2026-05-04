import { CommandeItem } from "@/components/commandes/CommandeItem";
import { RecentList } from "@/components/shared/RecentList";

// Liste des dernieres commandes recentes du freelance (dashboard)
export function DashboardRecentCommandes({
  t,
  commandes = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  return (
    <RecentList
      t={t}
      titleKey="dashboard:activity.title"
      descriptionKey="dashboard:activity.description"
      viewAllKey="common:actions.viewAll"
      emptyKey="common:states.empty"
      linkTo="/dashboard/commandes"
      items={commandes}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      error={error}
      refetch={refetch}
      renderItem={(commande) => (
        <CommandeItem
          key={commande.id}
          item={commande}
          linkTo="/dashboard/messages"
          t={t}
        />
      )}
    />
  );
}
