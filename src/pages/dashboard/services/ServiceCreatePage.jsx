import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, DollarSign, Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui";
import { MultiHierarchicalItem } from "@/components/shared/MultiHierarchicalItem";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { storeServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import {
  useCreateService,
  useSyncCategories,
  useSyncCompetences,
} from "@/features/freelance/catalog/services/services.mutations";
import { useSyncField } from "@/features/freelance/catalog/services/useSyncField";
import { setServerErrors } from "@/lib/utils";

// Les champs par step
const fieldsByStep = {
  1: ["titre", "description", "prix_base", "delai_livraison", "revisions"],
  2: ["categories", "competences"],
};

/**
 * Page de creation d'un service
 */
export function ServiceCreatePage() {
  // HOOKS
  const { t } = useTranslation(["dashboard", "codes", "taxonomy"]);
  const navigate = useNavigate();
  // Service mutations
  const createServiceMutation = useCreateService();
  const syncCategoriesMutation = useSyncCategories();
  const syncCompetencesMutation = useSyncCompetences();
  // Data queries
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  // FORM
  const form = useForm({
    defaultValues: {
      titre: "",
      description: "",
      prix_base: 1,
      delai_livraison: 1,
      revisions: 0,
      categories: [],
      competences: [],
    },
    resolver: zodResolver(storeServiceSchema),
    mode: "onChange",
  });
  // STATE
  const [step, setStep] = useState(1);
  const [serviceSlug, setServiceSlug] = useState(null);
  // SYNC HOOKS
  const syncCategories = useSyncField(
    syncCategoriesMutation,
    "categories",
    serviceSlug,
    form,
  );
  const syncCompetences = useSyncField(
    syncCompetencesMutation,
    "competences",
    serviceSlug,
    form,
  );
  // Passe a l'etape suivante
  const next = () => setStep((s) => s + 1);
  // Revenire a l'etape precedente
  const back = () => setStep((s) => s - 1);
  // COMPUTED VALUES
  const isPending =
    createServiceMutation.isPending ||
    syncCategories.isPending ||
    syncCompetences.isPending;
  // Validation par step
  const validateCurrentStep = () => {};
  // HANDLERS
  const submit = async () => {
    if (serviceSlug) {
      next();
      return;
    }
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    try {
      const valuesArray = form.getValues(fields);
      const data = Object.fromEntries(
        fields.map((field, index) => [field, valuesArray[index]]),
      );
      const response = await createServiceMutation.mutateAsync(data);
      const { code, details } = response ?? {};
      const slug = details?.service?.slug;
      if (slug) {
        setServiceSlug(slug);
      }
      toast.success(t(`codes:${code}`));
      next();
    } catch ({
      response: {
        data: { code, details: errors },
      },
    }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };
  // Finish la creation
  const finish = async () => {
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    navigate("/dashboard/services");
  };
  // Reinitialiser la form par step
  const handleFormResetByStep = () => {
    const fieldsResetByStep = fieldsByStep?.[step] || [];
    fieldsResetByStep.forEach((field) => form.resetField(field));
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
          <FieldSet disabled={isPending || (step === 1 && serviceSlug)}>
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
                    rules={{ min: 1 }}
                    min={1}
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
              {step === 2 && (
                <>
                  <MultiHierarchicalItem
                    name="categories"
                    control={form.control}
                    title={t("taxonomy:categories.title")}
                    description={t("taxonomy:categories.description")}
                    t={t}
                    dataQuery={categoriesQuery}
                    placeholder={t("taxonomy:categories.placeholder")}
                    emptyMessage={t("taxonomy:categories.empty")}
                    saveIsLoading={syncCategories.isPending}
                    onSave={syncCategories.sync}
                    onReset={() => form.resetField("categories")}
                    isChanged={form.formState.dirtyFields?.categories}
                  />
                  <MultiHierarchicalItem
                    name="competences"
                    control={form.control}
                    title={t("taxonomy:competences.title")}
                    description={t("taxonomy:competences.description")}
                    t={t}
                    dataQuery={competencesQuery}
                    placeholder={t("taxonomy:competences.placeholder")}
                    emptyMessage={t("taxonomy:competences.empty")}
                    saveIsLoading={syncCompetences.isPending}
                    onSave={syncCompetences.sync}
                    onReset={() => form.resetField("competences")}
                    isChanged={form.formState.dirtyFields?.competences}
                  />
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </Form>
      </CardContent>
      {/* Pied de carte */}
      <CardFooter className="flex-col gap-2">
        <ButtonGroup className="w-full flex">
          <Button
            disabled={step === 1 || isPending}
            variant="ghost"
            className="flex-1"
            onClick={back}
          >
            {t("services.create.actions.back")}
          </Button>
          <ButtonGroupSeparator />
          <Button
            disabled={
              isPending ||
              form.formState.dirtyFields?.competences ||
              form.formState.dirtyFields?.categories
            }
            className="flex-1"
            onClick={step === 1 ? submit : finish}
          >
            {step === 1 && isPending && <Spinner />}
            {t(
              `services.create.actions.${step === 1 ? (serviceSlug ? "next" : "submit") : "finish"}`,
            )}
          </Button>
        </ButtonGroup>
        <Button
          disabled={isPending}
          onClick={handleFormResetByStep}
          variant="secondary"
          className="w-full"
        >
          {t("services.create.actions.reset")}
        </Button>
      </CardFooter>
    </Card>
  );
}
