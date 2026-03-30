import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CustomFormField,
  FieldGroup,
  FieldSet,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from "@/components/ui";
import { changePasswordSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import { changePasswordThunk, logoutThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Page de gestion de la securite du compte utilisateur
 */
export function SecurityPage() {
  // Hook de traduction
  const { t } = useTranslation(["settings", "codes"]);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Hook pour naviguer entre les pages
  const navigate = useNavigate();
  // Etat de store indiquant si une requete est en cours
  const { user, loading } = useSelector(authSelector);
  // Initialisation du formulaire de changement de mot de passe
  // Validation des champs basee sur changePasswordSchema
  const form = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });
  // Fonction de soumission du formulaire
  const submit = async (data) => {
    try {
      // Envoyer les donnees de changement de mot de passe
      const { code } = await dispatch(changePasswordThunk(data)).unwrap();
      // Afficher message de succes
      toast.success(t(`codes:${code}`));
      // Reinitialiser le formulaire
      form.reset();
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };
  // Fonction de redirection vers la page de mot de passe oublie
  const forgetPassword = async () => {
    try {
      // Recuperer l'email de l'utilisateur
      const email = user?.email ?? "";
      // Deconnecter l'utilisateur avant de le rediriger vers la page de mot de passe oublie
      await dispatch(logoutThunk()).unwrap();
      // Rediriger vers la page de mot de passe oublie
      navigate("/password-reset", { state: { email } });
    } catch ({ code }) {
      // Afficher notification d'erreur
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("items.security.title")}</CardTitle>
        <CardDescription>{t("items.security.description")}</CardDescription>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={loading.changePassword || loading.logout}>
            <FieldGroup>
              <FormField
                name="old_password"
                control={form.control}
                render={({ field }) => {
                  const label = t("items.security.fields.labels.password");
                  return (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>{label}</FormLabel>
                        <Button
                          onClick={forgetPassword}
                          variant="link"
                          disabled={loading.changePassword || loading.logout}
                          className="p-0 h-fit leading-none text-muted-foreground"
                        >
                          {t("items.security.actions.forgotPassword")}
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
                            placeholder={t(
                              "items.security.fields.placeholder",
                              {
                                field: label.toLowerCase(),
                              },
                            )}
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
              <CustomFormField
                name="new_password"
                type="password"
                label={t("items.security.fields.labels.new_password")}
                placeholder={t("items.security.fields.placeholder", {
                  field: t(
                    "items.security.fields.labels.new_password",
                  ).toLowerCase(),
                })}
                control={form.control}
                icon={KeyRound}
                rules={{
                  min: 8,
                  max: 72,
                  other: t(
                    "items.security.fields.labels.password",
                  ).toLowerCase(),
                }}
              />
              <CustomFormField
                name="new_password_confirmation"
                type="password"
                label={t("items.security.fields.labels.confirm_password")}
                placeholder={t("items.security.fields.placeholder", {
                  field: t(
                    "items.security.fields.labels.confirm_password",
                  ).toLowerCase(),
                })}
                control={form.control}
                icon={ShieldCheck}
              />
            </FieldGroup>
          </FieldSet>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="gap-2">
        <Button
          onClick={form.handleSubmit(submit)}
          disabled={loading.changePassword || loading.logout}
        >
          {loading.changePassword && <Spinner />}
          {t("items.security.actions.reset_password")}
        </Button>
        <Button
          variant="outline"
          onClick={() => form.reset()}
          disabled={loading.changePassword || loading.logout}
        >
          {t("items.security.actions.cancel")}
        </Button>
      </CardFooter>
    </>
  );
}
