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
  CustomFormField,
  Spinner,
  FieldSet,
  FieldGroup,
  Textarea,
  Card,
} from "@/components/ui";
import { storeServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import { useCreateService } from "@/features/freelance/catalog/services/services.mutations";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, DollarSign, Clock, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Page de creation d'un service
 */
export function ServiceCreatePage() {
  // Hook pour la traduction
  const { t } = useTranslation(["dashboard", "codes"]);
  // Hook pour la creation de service
  const createServiceMutation = useCreateService();
  // Hook pour naviguer
  const navigate = useNavigate();
  // Initialisation du formulaire
  const form = useForm({
    defaultValues: {
      titre: "",
      description: "",
      prix_base: 0,
      delai_livraison: 1,
      revisions: 0,
    },
    resolver: zodResolver(storeServiceSchema),
  });
  // Gestion des etapes du formulaire d'inscription
  const [step, setStep] = useState(1);
  // Passe a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenire a l'etape precedente
  const back = () => setStep((s) => s - 1);
  /**
   * Fonction de soumission du formulaire
   */
  const submit = async (data) => {
    try {
      const { code } = await createServiceMutation.mutateAsync(data);
      toast.success(t(`codes:${code}`));
      next();
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <Card className="m-5 shadow-none rounded-none">
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("services.create.title")}</CardTitle>
        <CardDescription>{t("services.create.description")}</CardDescription>
        <CardAction>
          <Button
            onClick={() => navigate("/dashboard/services")}
            variant="link"
            disabled={createServiceMutation.isPending}
          >
            {t("services.create.actions.cancel")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={createServiceMutation.isPending}>
            <FieldGroup>
              {step === 1 && (
                <>
                  <CustomFormField
                    autoFocus
                    name="titre"
                    label={t("services.create.fields.titre.label")}
                    placeholder={t("services.create.fields.titre.placeholder")}
                    control={form.control}
                    icon={FileText}
                    rules={{ max: 255 }}
                  />
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => {
                      const label = t(
                        "services.create.fields.description.label",
                      );
                      const length = field.value?.length || 0;
                      const maxLength = 600;
                      return (
                        <FormItem className="relative">
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "services.create.fields.description.placeholder",
                              )}
                              className="min-h-30"
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute bottom-2 right-2">
                            {length}/{maxLength}
                          </div>
                          <FormMessage
                            rules={{ attribute: label, min: 150, max: 600 }}
                          />
                        </FormItem>
                      );
                    }}
                  />
                  <CustomFormField
                    name="prix_base"
                    type="number"
                    label={t("services.create.fields.prix_base.label")}
                    placeholder={t(
                      "services.create.fields.prix_base.placeholder",
                    )}
                    control={form.control}
                    icon={DollarSign}
                    rules={{ min: 0 }}
                    min={0}
                  />
                  <CustomFormField
                    name="delai_livraison"
                    type="number"
                    label={t("services.create.fields.delai_livraison.label")}
                    placeholder={t(
                      "services.create.fields.delai_livraison.placeholder",
                    )}
                    control={form.control}
                    icon={Clock}
                    rules={{ min: 1 }}
                    min={1}
                  />
                  <CustomFormField
                    name="revisions"
                    type="number"
                    label={t("services.create.fields.revisions.label")}
                    placeholder={t(
                      "services.create.fields.revisions.placeholder",
                    )}
                    control={form.control}
                    icon={RotateCcw}
                    rules={{ min: 0 }}
                    min={0}
                  />
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="justify-end">
        <Button
          onClick={form.handleSubmit(submit)}
          disabled={createServiceMutation.isPending}
          className="w-fit"
        >
          {createServiceMutation.isPending && <Spinner />}
          {t("services.create.actions.submit")}
        </Button>
      </CardFooter>
    </Card>
  );
}
