import {
  Button,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  CustomFormField,
} from "@/components/ui";
import { loginThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/features/auth/auth.schemas";

/**
 * Composant de la page de connexion
 */
export function LoginPage() {
  // Recuperation des donnees passees via navigate (state) depuis la page precedente
  const { state } = useLocation();
  // Initialisation du formulaire
  // Validation des champs basee sur loginSchema
  const form = useForm({
    defaultValues: { email: state?.email ?? "", password: "" },
    resolver: zodResolver(loginSchema)
  });
  // Hook pour la traduction
  const { t } = useTranslation();
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  /**
   * Fonction de soumission du formulaire : dispatch de l'action login
   */
  const submit = async (data) => {
    try {
      // Envoyer les donnees
      await dispatch(loginThunk(data)).unwrap();
      // Afficher message de succes
      toast.success(t("login.toast.success"));
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      // Afficher notification d'erreur
      toast.error(t(code));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
        <CardAction>
          <Link to="/register">
            <Button variant="link">{t("login.headerAction.signUp")}</Button>
          </Link>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <CustomFormField
            name="email"
            type="email"
            page="login"
            control={form.control}
            icon={Mail}
            rules={{ max: 255 }}
          />
          <CustomFormField
            name="password"
            type="password"
            page="login"
            control={form.control}
            icon={Lock}
            rules={{ min: 8 }}
          />
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full"
          size="lg"
          onClick={form.handleSubmit(submit)}
        >
          {t("login.actions.submit")}
        </Button>
        <Button
          onClick={() => form.reset()}
          variant="secondary"
          className="w-full"
        >
          {t("login.actions.reset")}
        </Button>
        <Link to="/password-reset">
          <Button variant="link" className="w-full">
            {t("login.actions.forgotPassword")}
          </Button>
        </Link>
      </CardFooter>
    </>
  );
}
