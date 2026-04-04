import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "@/components/ui";
import { useState } from "react";
import { Briefcase, User } from "lucide-react";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { useLocation, useNavigate } from "react-router-dom";

// Roles disponibles
const { FREELANCE, CLIENT } = AUTH_ROLE;

/**
 * Page de selection du role initial
 */
export function OnboardingPage() {
  // Traduction
  const { t } = useTranslation("onboarding");
  // Etat du role selectionne
  const [role, setRole] = useState(null);
  // Gestion de la localisation
  const location = useLocation();
  // Gestion de la navigation
  const navigate = useNavigate();
  // Recuperer la page precedente ou l'accueil
  const from = location.state?.from?.pathname ?? "/";
  // Redirection selon le choix
  const handleRoleNavigation = () => {
    if (role === CLIENT) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-3xl">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
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
              onClick={handleRoleNavigation}
              variant={role === CLIENT ? "default" : "outline"}
            >
              {t(`actions.${role === CLIENT ? "submit" : "next"}`)}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
