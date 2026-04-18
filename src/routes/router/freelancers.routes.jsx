import { FreelancerShowPage } from "@/pages/freelancers/FreelancerShowPage";

/**
 * Routes publiques liees aux freelances
 */
export const freelancersRoutes = {
  path: "freelancers",
  children: [
    {
      path: ":username",
      element: <FreelancerShowPage />,
    },
  ],
};
