import { RecentList } from "@/components/shared/RecentList";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Liste des derniers services en attente d'approbation
 */
export function AdminRecentServicesList({ t, services = [] }) {
  const { services: servicesBasePath } = useNavigationPaths();

  return (
    <RecentList
      t={t}
      titleKey="admin:dashboard.activite.services.title"
      descriptionKey="admin:dashboard.activite.services.description"
      viewAllKey="admin:dashboard.activite.services.viewAll"
      emptyKey="admin:dashboard.activite.services.empty"
      linkTo={servicesBasePath}
      items={services}
      renderItem={(service) => (
        <ServiceMiniCard key={service.slug} service={service} />
      )}
    />
  );
}
