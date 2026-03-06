import {
  Button,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  Input,
} from "@/components/ui";
import { loginThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

/**
 * Composant de la page de connexion
 */
export function LoginPage() {
  // Initialisation du formulaire
  const form = useForm({ defaultValues: { email: "", password: "" } });
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
          <Button variant="link">{t("login.headerAction.signUp")}</Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.fields.email.label")}</FormLabel>
                <div className="relative">
                  <Mail
                    className="absolute top-1/2 left-5 -translate-1/2 text-gray-400 "
                    size={16}
                  />
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("login.fields.email.placeholder")}
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.fields.password.label")}</FormLabel>
                <div className="relative">
                  <Lock
                    className="absolute top-1/2 left-5 -translate-1/2 text-gray-400 "
                    size={16}
                  />
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={t("login.fields.password.placeholder")}
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
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
      </CardFooter>
    </>
  );
}
