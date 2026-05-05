import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  serviceStatusBadgeVariantByStatut,
  serviceStatusTextKeyByStatut,
} from "@/features/freelance/catalog/services/services.status";
import { CURRENCY } from "@/lib/config";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { AvatarIdentity } from "./AvatarIdentity";
import { ServiceMiniCard } from "./ServiceMiniCard";

/**
 * Tableau generique pour afficher une liste de services
 * showFreelance : affiche la colonne freelance (utile dans l'espace admin)
 * renderActions(service) : slot pour les boutons specifiques au contexte
 */
export function ServicesTable({
  services = [],
  showFreelance = false,
  renderActions,
}) {
  const { t } = useTranslation(["dashboard"]);
  // Colonnes dynamiques selon le contexte
  const columns = [
    "service",
    ...(showFreelance ? ["freelance"] : []),
    "prix",
    "statut",
    "date",
    "actions",
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>
              {t(`dashboard:services.columns.${col}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>
              <ServiceMiniCard service={service} />
            </TableCell>
            {showFreelance && (
              <TableCell>
                <AvatarIdentity user={service.user} />
              </TableCell>
            )}
            <TableCell className="font-medium whitespace-nowrap">
              {formatPrice(service.prix_base)} {CURRENCY}
            </TableCell>
            <TableCell>
              <Badge
                variant={serviceStatusBadgeVariantByStatut[service.statut]}
              >
                {t(serviceStatusTextKeyByStatut[service.statut])}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDateTime(service.created_at)}
            </TableCell>
            <TableCell>{renderActions?.(service) ?? null}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
