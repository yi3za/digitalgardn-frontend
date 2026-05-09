import { ServiceShowPage } from "@/pages/services/ServiceShowPage";
import { ServicesPage } from "@/pages/services/ServicesPage";

/**
 * Routes publiques liees aux services
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
