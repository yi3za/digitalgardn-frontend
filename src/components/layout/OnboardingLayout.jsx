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
import {
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";
const { FREELANCE } = AUTH_ROLE;

/**
 * Layout de l'onboarding
 */
export function OnboardingLayout() {
  // Etat du role selectionne
  const [role, setRole] = useState(null);
  // Etat local du redirection apres l'onboarding
  const [redirectUrl, setRedirectUrl] = useState({});
  // Dispatch des actions
  const dispatch = useDispatch();
  // Traduction
  const { t } = useTranslation(["onboarding", "common", "codes"]);
  // Gestion de la navigation
  const navigate = useNavigate();
  // Recuperation le state de navigation
  const location = useLocation();
  const form = location.state?.from;
  // Change l'etat de redirection
  useEffect(() => {
    setRedirectUrl(form || { pathname: "/", state: {} });
  }, []);
  // Redirection selon le choix
  const handleOnboardingCompletion = async (onboarding_termine = false) => {
    try {
      // Si le role est freelance et que l'onboarding n'est pas termine, rediriger vers la page de setup
      if (role === FREELANCE && !onboarding_termine) {
        // Changer le role de l'utilisateur vers freelance
        await dispatch(switchToFreelanceThunk()).unwrap();
        // Rediriger vers la page de setup
        navigate("/onboarding/setup", { replace: true });
        return;
      }
      // Marquer l'onboarding comme termine via le thunk
      const { code } = await dispatch(completeOnboardingThunk()).unwrap();
      // Afficher une notification en cas de succes
      toast.success(t(`codes:${code}`));
      // Rediriger l'utilisateur vers sa page destination
      navigate(redirectUrl.pathname, {
        state: redirectUrl.state,
        replace: true,
      });
    } catch ({ code }) {
      // Afficher une notification en cas d'erreur
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-3xl shadow-none rounded-none border-none">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
          <CardAction>
            <Button
              onClick={() => navigate("/", { replace: true })}
              variant="link"
            >
              {t("common:actions.exit")}
            </Button>
          </CardAction>
        </CardHeader>
        <Outlet context={{ role, setRole, handleOnboardingCompletion }} />
      </Card>
    </div>
  );
}
