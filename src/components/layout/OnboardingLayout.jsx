import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import {
  completeOnboardingThunk,
  switchToFreelanceThunk,
} from "@/features/auth/auth.thunks";
import { Card } from "../ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
const { FREELANCE } = AUTH_ROLE;

/**
 * Layout de l'onboarding
 */
export function OnboardingLayout() {
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Etat du role selectionne
  const [role, setRole] = useState(null);
  // Dispatch des actions
  const dispatch = useDispatch();
  // Traduction
  const { t } = useTranslation(["codes"]);
  // Gestion de la localisation
  const location = useLocation();
  // Recuperer la page precedente ou l'accueil
  const from = location.state?.from?.pathname ?? "/";
  // Gestion de la navigation
  const navigate = useNavigate();
  // Redirection vers la page de setup si l'utilisateur est freelance et que l'onboarding n'est pas termine
  useEffect(() => {
    if (user?.role === FREELANCE && !user?.onboarding_termine) {
      navigate("/onboarding/setup", {
        state: { from },
        replace: true,
      });
    }
  }, [user?.role, user?.onboarding_termine, from]);
  // Redirection selon le choix
  const handleOnboardingCompletion = async (onboarding_termine = false) => {
    try {
      // Si le role est freelance et que l'onboarding n'est pas termine, rediriger vers la page de setup
      if (role === FREELANCE && !onboarding_termine) {
        // Changer le role de l'utilisateur vers freelance
        await dispatch(switchToFreelanceThunk()).unwrap();
        // Rediriger vers la page de setup
        navigate("/onboarding/setup");
        return;
      }
      // Marquer l'onboarding comme termine via le thunk
      const { code } = await dispatch(completeOnboardingThunk()).unwrap();
      // Afficher une notification en cas de succes
      toast.success(t(`codes:${code}`));
      // Rediriger l'utilisateur vers sa page destination
      navigate(from, { replace: true });
    } catch ({ code }) {
      // Afficher une notification en cas d'erreur
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-3xl">
        <Outlet context={{ role, setRole, handleOnboardingCompletion }} />
      </Card>
    </div>
  );
}
