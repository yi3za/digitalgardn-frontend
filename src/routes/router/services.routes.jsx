import { ServiceShowPage } from "@/pages/services/ServiceShowPage";
import { ServicesPage } from "@/pages/services/ServicesPage";

/**
 * Routes publiques liees aux services
 *
 * ServicesPage : page affichant tous les services publies
 * ServiceShowPage : page affichant les details d'un service publie, accessible via son slug
 */
export const servicesRoutes = {
  path: "services",
  children: [
    {
      index: true,
      element: <ServicesPage />,
    },
    {
      path: ":slug",
      element: <ServiceShowPage />,
    },
  ],
};
