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
import { registerSchema } from "@/features/auth/auth.schemas";
import { authCheckedSelector } from "@/features/auth/auth.selectors";
import { registerThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, AtSign } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RegisterPage() {
  // Etat de store indiquant si une requete auth est en cours
  const checked = useSelector(authCheckedSelector);
  // Initialisation du formulaire
  // Validation des champs basee sur registerSchema
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "client",
    },
    resolver: zodResolver(registerSchema),
  });
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Hook pour naviguer vers une autre page
  const navigate = useNavigate();
  // Hook pour la traduction
  const { t } = useTranslation();
  // Gestion des etapes du formulaire d'inscription
  const [step, setStep] = useState(1);
  // Passe a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenire a l'etape precedente
  const back = () => setStep((s) => s - 1);
  // Fonction appelee lorsque la validation du formulaire echoue
  const onError = (errors) => {
    if (errors?.name || errors?.username || errors?.email) setStep(1);
    else if (errors?.password || errors?.password_confirmation) setStep(2);
  };
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
  // Reset des champs selon l'etape actuelle
  const handleFormResetByStep = () => {
    const fieldsResetByStep =
      step === 1
        ? ["name", "username", "email"]
        : step === 2
          ? ["password", "password_confirmation"]
          : ["role"];
    fieldsResetByStep.forEach((field) => form.resetField(field));
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
        <CardAction>
          <Button onClick={() => navigate("/login")} variant="link" disabled={!checked}>
            {t("register.headerAction.logIn")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <fieldset disabled={!checked}>
          {step === 1 && (
            <>
              <CustomFormField
                autoFocus
                name="name"
                control={form.control}
                icon={User}
                rules={{ max: 255 }}
              />
              <CustomFormField
                name="username"
                control={form.control}
                icon={AtSign}
                rules={{ min: 3, max: 30 }}
              />
              <CustomFormField
                name="email"
                type="email"
                control={form.control}
                icon={Mail}
                rules={{ max: 255 }}
              />
            </>
          )}
          {step === 2 && (
            <>
              <CustomFormField
                autoFocus
                name="password"
                type="password"
                control={form.control}
                icon={Lock}
                rules={{ min: 8 }}
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
              render={({ field }) => {
                const label = t("register.fields.role.label");
                return (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
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
                  <FormMessage rules={{ attribute: label }} />
                </FormItem>
                );
              }}
            />
          )}
          </fieldset>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <ButtonGroup className="w-full flex">
          <Button
            disabled={step === 1 || !checked}
            variant="ghost"
            className="flex-1"
            onClick={back}
          >
            {t("register.actions.back")}
          </Button>
          <ButtonGroupSeparator />
          <Button
            disabled={!checked}
            className="flex-1"
            variant={step === 3 ? "" : "ghost"}
            onClick={step === 3 ? form.handleSubmit(submit, onError) : next}
          >
            {t(`register.actions.${step === 3 ? "submit" : "next"}`)}
          </Button>
        </ButtonGroup>
        <Button
          disabled={!checked}
          onClick={handleFormResetByStep}
          variant="secondary"
          className="w-full"
        >
          {t("register.actions.reset")}
        </Button>
      </CardFooter>
    </>
  );
}
