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
  Input,
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
} from "@/components/ui";
import { registerThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { Mail, Lock, User, AtSign } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
      console.log(data);
      // Envoyer les donnees
      await dispatch(registerThunk(data)).unwrap();
      // Afficher message de succes
      toast.success(t("register.toast.success"));
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      setStep(1);
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
          <Button variant="link">{t("register.headerAction.logIn")}</Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register.fields.name.label")}</FormLabel>
                    <div className="relative">
                      <User
                        className="absolute top-1/2 -translate-1/2 left-5 text-gray-400"
                        size={16}
                      />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("register.fields.name.placeholder")}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register.fields.username.label")}</FormLabel>
                    <div className="relative">
                      <AtSign
                        className="absolute top-1/2 -translate-1/2 left-5 text-gray-400"
                        size={16}
                      />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
                            "register.fields.username.placeholder",
                          )}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register.fields.email.label")}</FormLabel>
                    <div className="relative">
                      <Mail
                        className="absolute top-1/2 -translate-1/2 left-5 text-gray-400"
                        size={16}
                      />
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("register.fields.email.placeholder")}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </>
          )}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register.fields.password.label")}</FormLabel>
                    <div className="relative">
                      <Lock
                        className="absolute top-1/2 -translate-1/2 left-5 text-gray-400"
                        size={16}
                      />
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={t(
                            "register.fields.password.placeholder",
                          )}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("register.fields.password_confirmation.label")}
                    </FormLabel>
                    <div className="relative">
                      <Lock
                        className="absolute top-1/2 -translate-1/2 left-5 text-gray-400"
                        size={16}
                      />
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={t(
                            "register.fields.password_confirmation.placeholder",
                          )}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
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
                        <FieldLabel key={r} htmlFor={r}>
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
                            <RadioGroupItem hidden value={r} id={r} />
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
      </CardFooter>
    </>
  );
}
