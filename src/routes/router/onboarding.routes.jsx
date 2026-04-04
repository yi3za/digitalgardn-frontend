import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";

/**
 * Definit les routes liees a l'onboarding utilisateur
 *
 * onboarding : page principale de l'etape d'onboarding utilisateur
 */
export const onboardingRoutes = {
  path: "onboarding",
  children: [
    {
      index: true,
      element: <OnboardingPage />,
    },
  ],
};
