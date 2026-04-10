import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Button,
  RadioGroup,
  RadioGroupItem,
  Field,
  FieldLabel,
  FieldContent,
  FieldTitle,
  FieldDescription,
  Spinner,
} from "@/components/ui";
import { Briefcase, User } from "lucide-react";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { useEffect } from "react";

// Roles disponibles
const { FREELANCE, CLIENT } = AUTH_ROLE;

/**
 * Page de selection du role initial
 */
export function OnboardingPage() {
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Hook de navigation
  const navigate = useNavigate();
  // Traduction
  const { t } = useTranslation(["onboarding"]);
  // Recuperation des donnees du context
  const { role, setRole, handleOnboardingCompletion } = useOutletContext();
  // Etat de store indiquant si une requete auth est en cours
  const { loading } = useSelector(authSelector);
  // Redirection
  useEffect(() => {
    if (user?.role === FREELANCE && !user?.onboarding_termine)
      navigate("/onboarding/setup", { replace: true });
  }, []);

  return (
    <>
      <CardHeader>
        <CardTitle>{t("role.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <RadioGroup
          value={role}
          onValueChange={setRole}
          className="grid-cols-2"
        >
          {[FREELANCE, CLIENT].map((r) => {
            const iconClassName = {
              className: "text-muted-foreground/60 size-10",
            };
            return (
              <FieldLabel
                key={r}
                className="group cursor-pointer hover:bg-secondary"
              >
                <Field>
                  <FieldContent className="items-center">
                    {r === "freelance" ? (
                      <Briefcase {...iconClassName} />
                    ) : (
                      <User {...iconClassName} />
                    )}
                    <FieldTitle>{t(`role.options.${r}.title`)}</FieldTitle>
                    <FieldDescription className="text-center">
                      {t(`role.options.${r}.description`)}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem hidden value={r} />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end">
        {role !== null && (
          <Button
            onClick={() => handleOnboardingCompletion(role === CLIENT)}
            variant={role === CLIENT ? "default" : "outline"}
            disabled={loading.completeOnboarding || loading.switchToFreelance}
          >
            {loading.completeOnboarding ||
              (loading.switchToFreelance && <Spinner />)}
            {t(`actions.${role === CLIENT ? "submit" : "next"}`)}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
