import {
  Button,
  Card,
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
import { errorSelector, statusSelector } from "@/features/auth/auth.selectors";
import { loginThunk } from "@/features/auth/auth.thunks";
import { useAuthToast } from "@/hooks/useAuthToast";
import { useServerErrors } from "@/hooks/useServerErrors";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

/**
 * Composant de la page de connexion
 */
export function LoginPage() {
  // Initialisation du formulaire
  const form = useForm({ defaultValues: { email: "", password: "" } });
  // Hook pour la traduction
  const { t } = useTranslation();
  // dispatcher pour les actions et selecteurs pour l'état auth
  const dispatch = useDispatch();
  const { code, details } = useSelector(errorSelector) ?? {};
  const status = useSelector(statusSelector);
  // Gestion des erreurs serveur et affichage dans le formulaire
  const { setError } = form;
  useServerErrors(details, setError);
  // Affichage des notifications toast selon l'etat d'authentification
  useAuthToast(status, code, t);
  // Fonction de soumission du formulaire : dispatch de l'action login
  const submit = (data) => dispatch(loginThunk(data));

  return (
    <Card className="min-w-lg">
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
    </Card>
  );
}
