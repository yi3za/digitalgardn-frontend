import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  Button,
  CardFooter,
  ButtonGroup,
  ButtonGroupSeparator,
  RadioGroup,
  FieldLabel,
  Field,
  FieldContent,
  FieldTitle,
  FieldDescription,
  RadioGroupItem,
  CustomFormField,
} from "@/components/ui";
import { registerThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { Mail, Lock, User, AtSign } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function RegisterPage() {
  // Initialisation du formulaire
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "client",
    },
  });
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Hook pour la traduction
  const { t } = useTranslation();
  // Gestion des etapes du formulaire d'inscription
  const [step, setStep] = useState(1);
  // Passe a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenire a l'etape precedente
  const back = () => setStep((s) => s - 1);
  /**
   * Fonction de soumission du formulaire : dispatch de l'action login
   */
  const submit = async (data) => {
    try {
      // Envoyer les donnees
      await dispatch(registerThunk(data)).unwrap();
      // Afficher message de succes
      toast.success(t("register.toast.success"));
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      // Determine l'etape du formulaire selon les erreurs reçues
      if (errors?.name || errors?.username || errors?.email) setStep(1);
      else if (errors?.password) setStep(2);
      // Afficher notification d'erreur
      toast.error(t(code));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
        <CardAction>
          <Link to="/login">
            <Button variant="link">{t("register.headerAction.logIn")}</Button>
          </Link>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          {step === 1 && (
            <>
              <CustomFormField name="name" control={form.control} icon={User} />
              <CustomFormField
                name="username"
                control={form.control}
                icon={AtSign}
              />
              <CustomFormField
                name="email"
                type="email"
                control={form.control}
                icon={Mail}
              />
            </>
          )}
          {step === 2 && (
            <>
              <CustomFormField
                name="password"
                type="password"
                control={form.control}
                icon={Lock}
              />
              <CustomFormField
                name="password_confirmation"
                type="password"
                control={form.control}
                icon={Lock}
              />
            </>
          )}
          {step === 3 && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.fields.role.label")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {["freelance", "client"].map((r) => (
                        <FieldLabel key={r} className="pt-0">
                          <Field>
                            <FieldContent>
                              <FieldTitle>
                                {t(`register.fields.role.options.${r}.title`)}
                              </FieldTitle>
                              <FieldDescription>
                                {t(
                                  `register.fields.role.options.${r}.description`,
                                )}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem hidden value={r} />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <ButtonGroup className="w-full flex">
          <Button
            disabled={step === 1}
            variant="ghost"
            className="flex-1"
            onClick={back}
          >
            {t("register.actions.back")}
          </Button>
          <ButtonGroupSeparator />
          <Button
            className="flex-1"
            variant={step === 3 ? "" : "ghost"}
            onClick={step === 3 ? form.handleSubmit(submit) : next}
          >
            {step === 3
              ? t("register.actions.submit")
              : t("register.actions.next")}
          </Button>
        </ButtonGroup>
        <Button
          onClick={() => form.reset()}
          variant="secondary"
          className="w-full"
        >
          {t("register.actions.reset")}
        </Button>
      </CardFooter>
    </>
  );
}
