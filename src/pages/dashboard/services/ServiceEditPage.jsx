import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  DollarSign,
  Clock,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
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
  CustomAlert,
  Skeleton,
} from "@/components/ui";
import { FichiersUploadItem } from "@/components/shared/FichiersUploadItem";
import { MultiHierarchicalItem } from "@/components/shared/MultiHierarchicalItem";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { updateServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import {
  useUpdateService,
  useSyncCategories,
  useSyncCompetences,
  useSyncFichiers,
} from "@/features/freelance/catalog/services/services.mutations";
import { useSyncField } from "@/features/freelance/catalog/services/useSyncField";
import { setServerErrors } from "@/lib/utils";
import { useMyService } from "@/features/freelance/catalog/services/services.query";

const STEP_INFO = 1;
const STEP_FICHIERS = 2;
const STEP_TAXONOMY = 3;

// Les champs par step
const fieldsByStep = {
  [STEP_INFO]: [
    "titre",
    "description",
    "prix_base",
    "delai_livraison",
    "revisions",
  ],
  [STEP_FICHIERS]: ["fichiers"],
  [STEP_TAXONOMY]: ["categories", "competences"],
};

/**
 * Page pour la modification des services
 */
export function ServiceEditPage() {
  // Traductions, navigation et params
  const { t } = useTranslation(["dashboard", "codes", "taxonomy"]);
  const navigate = useNavigate();
  const { slug } = useParams();
  // Charger le service existant
  const {
    data: service,
    isPending: isServicePending,
    isError: isServiceError,
    error: serviceError,
    refetch: refetchService,
  } = useMyService(slug);
  // Mutations pour la mise a jour du service et la synchronisation des champs
  const updateServiceMutation = useUpdateService();
  const syncCategoriesMutation = useSyncCategories();
  const syncCompetencesMutation = useSyncCompetences();
  const syncFichiersMutation = useSyncFichiers();
  // Queries pour les categories et competences disponibles
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  // Formulaire react-hook-form avec validation zod
  const form = useForm({
    defaultValues: {
      titre: "",
      description: "",
      prix_base: 1,
      delai_livraison: 1,
      revisions: 0,
      fichiers: [],
      categories: [],
      competences: [],
    },
    resolver: zodResolver(updateServiceSchema),
    mode: "onChange",
  });
  // State local pour gerer le step actuel, les fichiers sauvegardes et le slug du service
  const [step, setStep] = useState(STEP_INFO);
  const [savedFichiers, setSavedFichiers] = useState([]);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const effectiveSlug = currentSlug ?? slug;
  // Hydrater le formulaire quand le service est charge
  useEffect(() => {
    // Si le service n'est pas encore charge, on ne fait rien
    if (!service) return;
    // Recuperer les valeurs actuelles du champ de fichiers pour eviter de les reset lors de l'hydratation
    const currentFichiers = form.getValues("fichiers") ?? [];
    // Hydrater les champs du formulaire avec les donnees du service
    form.reset({
      titre: service.titre ?? "",
      description: service.description ?? "",
      prix_base: service.prix_base ?? 1,
      delai_livraison: service.delai_livraison ?? 1,
      revisions: service.revisions ?? 0,
      categories: service.categories?.map((c) => c.id) ?? [],
      competences: service.competences?.map((c) => c.id) ?? [],
      fichiers: currentFichiers,
    });
  }, [form, service]);
  // Mettre a jour le slug actuel si le parametre change
  useEffect(() => {
    setCurrentSlug(slug);
  }, [slug]);
  // Hooks de synchronisation des champs de taxonomie
  const syncCategories = useSyncField(
    syncCategoriesMutation,
    "categories",
    effectiveSlug,
    form,
  );
  const syncCompetences = useSyncField(
    syncCompetencesMutation,
    "competences",
    effectiveSlug,
    form,
  );
  // Navigation entre les steps
  const next = () => setStep((s) => Math.min(s + 1, STEP_TAXONOMY));
  const back = () => setStep((s) => Math.max(s - 1, STEP_INFO));
  // Indicateur de chargement global
  const isPending =
    updateServiceMutation.isPending ||
    syncCategories.isPending ||
    syncCompetences.isPending;
  // Soumission step 1 : mise a jour du service
  const submit = async () => {
    // Validation des champs du step actuel avant de tenter la mise a jour
    const fields = fieldsByStep[STEP_INFO];
    if (!(await form.trigger(fields))) return;
    // Tentative de mise a jour du service avec les nouvelles valeurs du formulaire
    try {
      // Recuperation des valeurs a jour des champs a synchroniser
      const valuesArray = form.getValues(fields);
      const data = Object.fromEntries(
        fields.map((field, index) => [field, valuesArray[index]]),
      );
      // Appel de la mutation de mise a jour du service
      const response = await updateServiceMutation.mutateAsync({
        slug: effectiveSlug,
        data,
      });
      // Recuperation du code de reponse pour afficher un message de succes
      const { code } = response ?? {};
      // Mise a jour du slug actuel
      const updatedSlug = response?.details?.service?.slug ?? effectiveSlug;
      setCurrentSlug(updatedSlug);
      // Redirection vers le nouveau slug si celui-ci a change suite a la mise a jour
      if (updatedSlug && updatedSlug !== slug) {
        navigate(`/dashboard/services/${updatedSlug}/edit`, { replace: true });
      }
      toast.success(t(`codes:${code}`));
      next();
    } catch (error) {
      // Gestion des erreurs de validation et affichage des messages d'erreur
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      setServerErrors(error?.response?.data?.details, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };
  // Navigation avec validation
  const goNextWithValidation = async () => {
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    next();
  };
  // Terminer et rediriger
  const finish = async () => {
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    navigate("/dashboard/services");
  };
  // Reset les champs du step actuel
  const handleFormResetByStep = () => {
    const fieldsResetByStep = fieldsByStep?.[step] || [];
    fieldsResetByStep.forEach((field) => form.resetField(field));
  };
  // Fichiers : suivi des changements
  const watchedFichiers = form.watch("fichiers") ?? [];
  const isFichiersChanged =
    watchedFichiers.length !== savedFichiers.length ||
    watchedFichiers.some((file, i) => file !== savedFichiers[i]);
  // Handler de sauvegarde des fichiers
  const handleSaveFichiers = useCallback(async () => {
    // Validation du champ de fichiers avant de tenter la synchronisation
    const files = form.getValues("fichiers") ?? [];
    if (!files.length || !effectiveSlug) return;
    // Tentative de synchronisation des fichiers avec le backend
    try {
      const response = await syncFichiersMutation.mutateAsync({
        slug: effectiveSlug,
        files,
      });
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
      setSavedFichiers([...files]);
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  }, [form, effectiveSlug, syncFichiersMutation, t]);
  // Handler de reset des fichiers
  const handleResetFichiers = useCallback(() => {
    form.resetField("fichiers", { defaultValue: [...savedFichiers] });
  }, [form, savedFichiers]);
  // Action primaire selon le step
  const handlePrimaryAction = async () => {
    if (step === STEP_INFO) {
      await submit();
    } else if (step === STEP_FICHIERS) {
      await goNextWithValidation();
    } else {
      await finish();
    }
  };
  // Fonction pour obtenir le label du bouton principal selon le step
  const getPrimaryLabel = () => {
    if (step === STEP_INFO) return t("services.edit.actions.submit");
    if (step === STEP_FICHIERS) return t("services.form.actions.next");
    return t("services.form.actions.finish");
  };

  if (isServicePending) return <Skeleton className="flex-1" />;

  if (isServiceError)
    return (
      <CustomAlert
        header={serviceError?.response?.data?.code ?? "NETWORK_ERROR"}
        body={t(
          `codes:${serviceError?.response?.data?.code ?? "NETWORK_ERROR"}`,
        )}
        onRefetch={refetchService}
        refreshText={t("services.form.actions.refresh")}
        icon={AlertCircle}
        variant="destructive"
      />
    );

  return (
    <Card className="shadow-none rounded-none">
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("services.edit.title")}</CardTitle>
        <CardDescription>{t("services.edit.description")}</CardDescription>
        <CardAction>
          <Button
            onClick={() => navigate("/dashboard/services")}
            variant="link"
            disabled={isPending}
          >
            {t("services.form.actions.cancel")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={isPending}>
            <FieldGroup>
              {step === STEP_INFO && (
                <>
                  <CustomFormField
                    autoFocus
                    name="titre"
                    label={t("services.form.fields.titre.label")}
                    placeholder={t("services.form.fields.titre.placeholder")}
                    control={form.control}
                    icon={FileText}
                    rules={{ max: 255 }}
                  />
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => {
                      const label = t("services.form.fields.description.label");
                      const length = field.value?.length || 0;
                      const maxLength = 600;
                      return (
                        <FormItem className="relative">
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "services.form.fields.description.placeholder",
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
                    label={t("services.form.fields.prix_base.label")}
                    placeholder={t(
                      "services.form.fields.prix_base.placeholder",
                    )}
                    control={form.control}
                    icon={DollarSign}
                    rules={{ min: 1 }}
                    min={1}
                  />
                  <CustomFormField
                    name="delai_livraison"
                    type="number"
                    label={t("services.form.fields.delai_livraison.label")}
                    placeholder={t(
                      "services.form.fields.delai_livraison.placeholder",
                    )}
                    control={form.control}
                    icon={Clock}
                    rules={{ min: 1 }}
                    min={1}
                  />
                  <CustomFormField
                    name="revisions"
                    type="number"
                    label={t("services.form.fields.revisions.label")}
                    placeholder={t(
                      "services.form.fields.revisions.placeholder",
                    )}
                    control={form.control}
                    icon={RotateCcw}
                    rules={{ min: 0 }}
                    min={0}
                  />
                </>
              )}
              {step === STEP_FICHIERS && (
                <FichiersUploadItem
                  t={t}
                  name="fichiers"
                  control={form.control}
                  maxFiles={10}
                  existingUrls={
                    service?.fichiers?.map((f) => f.chemin_url) ?? []
                  }
                  title={t("services.form.fields.fichiers.label")}
                  description={t("services.form.fields.fichiers.description")}
                  saveIsLoading={syncFichiersMutation.isPending}
                  onSave={handleSaveFichiers}
                  onReset={handleResetFichiers}
                  isChanged={isFichiersChanged}
                />
              )}
              {step === STEP_TAXONOMY && (
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
            disabled={step === STEP_INFO || isPending}
            variant="ghost"
            className="flex-1"
            onClick={back}
          >
            {t("services.form.actions.back")}
          </Button>
          <ButtonGroupSeparator />
          <Button
            disabled={
              isPending ||
              syncFichiersMutation.isPending ||
              isFichiersChanged ||
              form.formState.dirtyFields?.competences ||
              form.formState.dirtyFields?.categories
            }
            className="flex-1"
            onClick={handlePrimaryAction}
          >
            {step === STEP_INFO && isPending && <Spinner />}
            {getPrimaryLabel()}
          </Button>
        </ButtonGroup>
        <Button
          disabled={isPending}
          onClick={handleFormResetByStep}
          variant="secondary"
          className="w-full"
        >
          {t("services.form.actions.reset")}
        </Button>
      </CardFooter>
    </Card>
  );
}
