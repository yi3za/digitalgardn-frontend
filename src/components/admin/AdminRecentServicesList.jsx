import { AdminRecentList } from "./AdminRecentList";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";

// Liste des derniers services en attente d'approbation (dashboard admin)
export function AdminRecentServicesList({ t, services = [] }) {
  return (
    <AdminRecentList
      t={t}
      titleKey="admin:dashboard.activite.services.title"
      descriptionKey="admin:dashboard.activite.services.description"
      viewAllKey="admin:dashboard.activite.services.viewAll"
      emptyKey="admin:dashboard.activite.services.empty"
      linkTo="/admin/services"
      items={services}
      renderItem={(service) => (
        <ServiceMiniCard key={service.slug} service={service} />
      )}
    />
  );
}
