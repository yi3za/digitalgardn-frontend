import { OnboardingLayout } from "@/components/layout/OnboardingLayout";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { FreelancerSetupPage } from "@/pages/onboarding/FreelancerSetupPage";

/**
 * Definit les routes liees a l'onboarding utilisateur
 *
 * OnboardingLayout : structure commune (logo, etapes, etc.) pour l'onboarding
 * 
 * onboarding : page principale de selection du role initial
 * onboarding/setup : configuration du profil detaille pour les freelances
 */
export const onboardingRoutes = {
  element: <OnboardingLayout />,
  children: [
    {
      path: "onboarding",
      element: <OnboardingPage />,
    },
    {
      path: "onboarding/setup",
      element: <FreelancerSetupPage />,
    },
  ],
};
