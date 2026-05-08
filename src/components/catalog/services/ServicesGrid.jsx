import { ItemGroup } from "@/components/ui";
import { ServiceItem } from "./ServiceItem";

/**
 * Grille de rendu des services pour reutilisation (ex: page freelance, catalogues filtres)
 */
export function ServicesGrid({ services = [] }) {
  return (
    <ItemGroup className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
      {services.map((service) => (
        <ServiceItem key={service.id} item={service} />
      ))}
    </ItemGroup>
  );
}
