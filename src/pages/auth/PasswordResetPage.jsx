import {
  Button,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CustomFormField,
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
import { authCheckedSelector } from "@/features/auth/auth.selectors";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PasswordResetPage() {
  // Etat de store indiquant si une requete auth est en cours
  const checked = useSelector(authCheckedSelector);
  // Indique c'est le code a ete envoye
  const [isCodeSent, setIsCodeSent] = useState(false);
  // Etape actuelle du processus (1 = code & 2 = nouveau mot de passe)
  const [step, setStep] = useState(1);
  // Initialisation du formulaire avec les valeurs par defaut
  // Validation des champs basee sur resetPasswordSchema si isCodeSent sinon sendResetCodeSchema
  const form = useForm({
    defaultValues: {
      email: "",
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
  const { t } = useTranslation();
  // Passer a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenir a l'etape precedente
  const back = () => setStep((s) => s - 1);
  /**
   * Gerer le processus de reinitialisation du mot de passe :
   */
  const processPasswordReset = async (data) => {
    try {
      const email = data?.email;
      const thunk = !isCodeSent
        ? sendResetCodeThunk({ email })
        : resetPasswordThunk(data);
      const messageKey = !isCodeSent ? "successSendCode" : "successReset";
      await dispatch(thunk).unwrap();
      toast.success(t(`passwordReset.toast.${messageKey}`));
      if (!isCodeSent) setIsCodeSent(true);
      else navigate("/login", { state: { email } });
    } catch ({ code, details: errors }) {
      setServerErrors(errors, form.setError);
      toast.error(t(code));
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
          action: form.handleSubmit(processPasswordReset),
          label: !isCodeSent ? "sendCode" : "resetPassword",
        };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader disabled={!checked}>
        <CardTitle>{t("passwordReset.title")}</CardTitle>
        <CardDescription>{t("passwordReset.description")}</CardDescription>
        <CardAction className="flex flex-col items-end">
          <Link to="/login">
            <Button variant="link" disabled={!checked}>
              {t("passwordReset.headerAction.logIn")}
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="link" disabled={!checked}>
              {t("passwordReset.headerAction.signUp")}
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          {!isCodeSent && (
            <CustomFormField
              name="email"
              disabled={!checked}
              type="email"
              page="passwordReset"
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
                          disabled={!checked}
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
                    disabled={!checked}
                    name="password"
                    type="password"
                    control={form.control}
                    icon={Lock}
                    rules={{ min: 8 }}
                  />
                  <CustomFormField
                    disabled={!checked}
                    name="password_confirmation"
                    type="password"
                    control={form.control}
                    icon={Lock}
                  />
                </>
              )}
            </>
          )}
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <Button
          disabled={!checked}
          size="lg"
          className="w-full"
          onClick={resetPasswordConfig.action}
        >
          {!checked && <Spinner />}
          {t(`passwordReset.actions.${resetPasswordConfig.label}`)}
        </Button>
        <Button
          onClick={handleFormResetByStep}
          disabled={!checked}
          variant="secondary"
          className="w-full"
        >
          {t("passwordReset.actions.reset")}
        </Button>
        {isCodeSent && (
          <Button variant="link" onClick={handleStepBack} disabled={!checked}>
            {t(
              `passwordReset.actions.${step === 2 ? "editCode" : "editEmail"}`,
            )}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
