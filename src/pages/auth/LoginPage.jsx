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
  Spinner,
  FieldSet,
  FieldGroup,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Checkbox,
  FormDescription,
  Input,
} from "@/components/ui";
import { loginThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";

/**
 * Composant de la page de connexion
 */
export function LoginPage() {
  // Etat de store indiquant si une requete auth est en cours
  const { loading } = useSelector(authSelector);
  // Recuperation des donnees passees via navigate (state) depuis la page precedente
  const { state } = useLocation();
  // Initialisation du formulaire
  // Validation des champs basee sur loginSchema
  const form = useForm({
    defaultValues: {
      email: state?.email ?? "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(loginSchema),
  });
  // Hook pour la traduction
  const { t } = useTranslation(["auth", "common", "codes"]);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Hook pour naviguer entre les pages
  const navigate = useNavigate();
  /**
   * Fonction de soumission du formulaire : dispatch de l'action login
   */
  const submit = async (data) => {
    try {
      // Envoyer les donnees
      const { code } = await dispatch(loginThunk(data)).unwrap();
      // Afficher message de succes
      toast.success(t(`codes:${code}`));
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      // Afficher notification d'erreur
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
        <CardAction>
          <Button
            onClick={() => navigate("/register")}
            variant="link"
            disabled={loading.login}
          >
            {t("login.headerAction.signUp")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={loading.login}>
            <FieldGroup>
              <CustomFormField
                autoFocus
                name="email"
                label={t("login.fields.email.label")}
                placeholder={t("login.fields.email.placeholder")}
                type="email"
                control={form.control}
                icon={Mail}
                rules={{ max: 255 }}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => {
                  const label = t("login.fields.password.label");
                  return (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>{label}</FormLabel>
                        <Button
                          onClick={() => navigate("/password-reset")}
                          variant="link"
                          disabled={loading.login}
                          className="p-0 h-fit leading-none text-muted-foreground"
                        >
                          {t("login.actions.forgotPassword")}
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                          size={16}
                        />
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder={t("login.fields.password.placeholder")}
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage
                        rules={{ attribute: label, min: 8, max: 72 }}
                      />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="remember"
                control={form.control}
                render={({ field }) => {
                  const { value, onChange, ...rest } = field;
                  const label = t("login.fields.remember.label");
                  return (
                    <FormItem className="grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                      <FormControl>
                        <Checkbox
                          checked={value}
                          onCheckedChange={onChange}
                          {...rest}
                          className="row-span-2"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">{label}</FormLabel>
                      <FormDescription>
                        {t("login.fields.remember.description")}
                      </FormDescription>
                      <FormMessage rules={{ attribute: label }} />
                    </FormItem>
                  );
                }}
              />
            </FieldGroup>
          </FieldSet>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full"
          size="lg"
          onClick={form.handleSubmit(submit)}
          disabled={loading.login}
        >
          {loading.login && <Spinner />}
          {t("login.actions.submit")}
        </Button>
        <Button
          onClick={() => form.reset()}
          variant="secondary"
          className="w-full"
          disabled={loading.login}
        >
          {t("common:actions.reset")}
        </Button>
      </CardFooter>
    </>
  );
}
