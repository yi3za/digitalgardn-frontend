import { ItemGroup } from "@/components/ui";
import { ServiceItem } from "./ServiceItem";

/**
 * Grille de rendu des services pour reutilisation (ex: page freelance, catalogues filtres)
 */
export function ServicesGrid({
  services = [],
  linkTo = "/services",
  dashboard = false,
}) {
  return (
    <ItemGroup className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          item={service}
          linkTo={linkTo}
          dashboard={dashboard}
        />
      ))}
    </ItemGroup>
  );
}
