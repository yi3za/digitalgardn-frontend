import {
  Button,
  CardAction,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Spinner,
} from "@/components/ui";
import {
  resetPasswordSchema,
  sendResetCodeSchema,
} from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  resetPasswordThunk,
  sendResetCodeThunk,
} from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PasswordResetPage() {
  // Recuperation des donnees passees via navigate (state) depuis la page precedente
  const { state } = useLocation();
  // Etat de store indiquant si une requete auth est en cours
  const { loading } = useSelector(authSelector);
  // Indique c'est le code a ete envoye
  const [isCodeSent, setIsCodeSent] = useState(false);
  // Etape actuelle du processus (1 = code & 2 = nouveau mot de passe)
  const [step, setStep] = useState(1);
  // Initialisation du formulaire avec les valeurs par defaut
  // Validation des champs basee sur resetPasswordSchema si isCodeSent sinon sendResetCodeSchema
  const form = useForm({
    defaultValues: {
      email: state?.email ?? "",
      code: "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(
      !isCodeSent ? sendResetCodeSchema : resetPasswordSchema,
    ),
  });
  // Hook pour envoyer des actions Redux
  const dispatch = useDispatch();
  // Hook pour naviguer vers une autre page
  const navigate = useNavigate();
  // Hook pour la traduction
  const { t } = useTranslation(["auth", "codes"]);
  // Passer a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenir a l'etape precedente
  const back = () => setStep((s) => s - 1);
  // Fonction appelee lorsque la validation du formulaire echoue
  const onError = (errors) => {
    if (!errors) return;
    if (isCodeSent && errors?.code && step !== 1) setStep(1);
  };
  /**
   * Gerer le processus de reinitialisation du mot de passe :
   */
  const processPasswordReset = async (data) => {
    try {
      const email = data?.email ?? "";
      // Choisir le thunk selon si le code a deja ete envoye ou non
      const action = !isCodeSent
        ? sendResetCodeThunk({ email })
        : resetPasswordThunk(data);
      // Envoyer la requete
      const { code } = await dispatch(action).unwrap();
      // Afficher un toast de succes
      toast.success(t(`codes:${code}`));
      // Mettre a jour l'etat ou naviguer vers login
      if (!isCodeSent) setIsCodeSent(true);
      else navigate("/login", { state: { email } });
    } catch ({ code, details: errors }) {
      // Mettre le formulaire a jour selon les erreurs
      onError(errors);
      // Assigner les erreurs serveur aux champs du formulaire
      setTimeout(() => {
        setServerErrors(errors, form.setError);
      }, 0);
      // Afficher un toast d'erreur
      toast.error(t(`codes:${code}`));
    }
  };
  // Reset des champs selon l'etape actuelle
  const handleFormResetByStep = () => {
    if (!isCodeSent) return form.reset();
    const fieldsResetByStep =
      step === 1 ? ["code"] : ["password", "password_confirmation"];
    fieldsResetByStep.forEach((field) => form.resetField(field));
  };
  // Gestion du button retour
  const handleStepBack = () => {
    if (step === 2) return back();
    setIsCodeSent(false);
    form.reset();
  };
  // Configuration de l’action et du label du bouton principal
  const resetPasswordConfig =
    isCodeSent && step === 1
      ? { action: next, label: "next" }
      : {
          action: form.handleSubmit(processPasswordReset, onError),
          label: !isCodeSent ? "sendCode" : "resetPassword",
        };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("passwordReset.title")}</CardTitle>
        <CardDescription>{t("passwordReset.description")}</CardDescription>
        <CardAction className="flex flex-col items-end">
          <Button
            onClick={() => navigate("/login")}
            variant="link"
            disabled={loading.sendResetCode || loading.resetPassword}
          >
            {t("passwordReset.headerAction.logIn")}
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant="link"
            disabled={loading.sendResetCode || loading.resetPassword}
          >
            {t("passwordReset.headerAction.signUp")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={loading.sendResetCode || loading.resetPassword}>
            <FieldGroup>
              {!isCodeSent && (
                <CustomFormField
                  autoFocus
                  name="email"
                  label={t("passwordReset.fields.email.label")}
                  placeholder={t("passwordReset.fields.email.placeholder")}
                  type="email"
                  control={form.control}
                  icon={Mail}
                  rules={{ max: 255 }}
                />
              )}
              {isCodeSent && (
                <>
                  {step === 1 ? (
                    <FormField
                      name="code"
                      control={form.control}
                      render={({ field }) => {
                        const label = t("passwordReset.fields.code.label");
                        return (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <InputOTP
                                autoFocus
                                maxLength={6}
                                {...field}
                                pattern={REGEXP_ONLY_DIGITS}
                              >
                                <InputOTPGroup className="w-full flex justify-center">
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormDescription className="text-center">
                              {t("passwordReset.fields.code.placeholder")}
                            </FormDescription>
                            <FormMessage
                              className="text-center"
                              rules={{ attribute: label, size: 6 }}
                            />
                          </FormItem>
                        );
                      }}
                    />
                  ) : (
                    <>
                      <CustomFormField
                        autoFocus
                        name="password"
                        label={t("passwordReset.fields.password.label")}
                        placeholder={t(
                          "passwordReset.fields.password.placeholder",
                        )}
                        type="password"
                        control={form.control}
                        icon={Lock}
                        rules={{ min: 8, max: 72 }}
                      />
                      <CustomFormField
                        name="password_confirmation"
                        label={t(
                          "passwordReset.fields.password_confirmation.label",
                        )}
                        placeholder={t(
                          "passwordReset.fields.password_confirmation.placeholder",
                        )}
                        type="password"
                        control={form.control}
                        icon={Lock}
                      />
                    </>
                  )}
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <Button
          disabled={loading.sendResetCode || loading.resetPassword}
          size="lg"
          className="w-full"
          onClick={resetPasswordConfig.action}
        >
          {(loading.sendResetCode || loading.resetPassword) && <Spinner />}
          {t(`passwordReset.actions.${resetPasswordConfig.label}`)}
        </Button>
        <Button
          onClick={handleFormResetByStep}
          disabled={loading.sendResetCode || loading.resetPassword}
          variant="secondary"
          className="w-full"
        >
          {t("passwordReset.actions.reset")}
        </Button>
        {isCodeSent && (
          <Button
            variant="link"
            onClick={handleStepBack}
            disabled={loading.sendResetCode || loading.resetPassword}
          >
            {t(
              `passwordReset.actions.${step === 2 ? "editCode" : "editEmail"}`,
            )}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
