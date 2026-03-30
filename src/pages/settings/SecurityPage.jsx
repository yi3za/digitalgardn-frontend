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
  Spinner,
} from "@/components/ui";
import { changePasswordSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import { changePasswordThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

/**
 * Page de gestion de la securite du compte utilisateur
 */
export function SecurityPage() {
  // Hook de traduction
  const { t } = useTranslation(["settings", "codes"]);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Etat de store indiquant si une requete est en cours
  const { loading } = useSelector(authSelector);
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
          <FieldSet disabled={loading.changePassword}>
            <FieldGroup>
              <CustomFormField
                name="old_password"
                type="password"
                label={t("items.security.fields.labels.password")}
                placeholder={t("items.security.fields.placeholder", {
                  field: t(
                    "items.security.fields.labels.password",
                  ).toLowerCase(),
                })}
                control={form.control}
                icon={Lock}
                rules={{ min: 8, max: 72 }}
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
          disabled={loading.changePassword}
        >
          {loading.changePassword && <Spinner />}
          {t("items.security.actions.reset_password")}
        </Button>
        <Button
          variant="outline"
          onClick={() => form.reset()}
          disabled={loading.changePassword}
        >
          {t("items.security.actions.cancel")}
        </Button>
      </CardFooter>
    </>
  );
}
