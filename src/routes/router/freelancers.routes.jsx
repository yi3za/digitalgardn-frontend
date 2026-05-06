import { FreelancerShowPage } from "@/pages/freelancers/FreelancerShowPage";

/**
 * Routes publiques liees aux freelances
 */
export const freelancersRoutes = {
  path: "freelancers/:username",
  element: <FreelancerShowPage />,
};
