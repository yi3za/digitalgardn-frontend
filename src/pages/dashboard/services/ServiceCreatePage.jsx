import { useCallback, useState } from "react";
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
import { FichiersUploadItem } from "@/components/shared/FichiersUploadItem";
import { MultiHierarchicalItem } from "@/components/shared/MultiHierarchicalItem";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { storeServiceSchema } from "@/features/freelance/catalog/services/services.schemas";
import {
  useCreateService,
  useSyncCategories,
  useSyncCompetences,
  useSyncFichiers,
} from "@/features/freelance/catalog/services/services.mutations";
import { useSyncField } from "@/features/freelance/catalog/services/useSyncField";
import { setServerErrors } from "@/lib/utils";

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
 * Page de creation d'un service
 */
export function ServiceCreatePage() {
  // Hook de traduction pour les textes de la page
  const { t } = useTranslation(["dashboard", "common", "codes", "taxonomy"]);
  // Hook de navigation pour rediriger l'utilisateur apres la creation du service
  const navigate = useNavigate();
  // Mutations pour la creation du service et la synchronisation
  const createServiceMutation = useCreateService();
  const syncCategoriesMutation = useSyncCategories();
  const syncCompetencesMutation = useSyncCompetences();
  const syncFichiersMutation = useSyncFichiers();
  // Queries pour recuperer les categories et competences disponibles pour les services
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  // Formulaire de creation de service avec validation basee sur le schema de validation et react-hook-form pour la gestion des etats du formulaire
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
    resolver: zodResolver(storeServiceSchema),
    mode: "onChange",
  });
  // Etats locaux pour gerer l'etape actuelle et le slug du service cree
  const [step, setStep] = useState(STEP_INFO);
  const [serviceSlug, setServiceSlug] = useState(null);
  const [savedFichiers, setSavedFichiers] = useState([]);
  // Hooks de synchronisation des champs de categories et competences
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
  // Fonction pour passer a l'etape suivante
  const next = () => setStep((s) => Math.min(s + 1, STEP_TAXONOMY));
  // Fonction pour revenir a l'etape precedente
  const back = () => setStep((s) => Math.max(s - 1, STEP_INFO));
  // Etat de chargement global
  const isPending =
    createServiceMutation.isPending ||
    syncCategories.isPending ||
    syncCompetences.isPending;
  // Soumission du formulaire pour la creation du service
  const submit = async () => {
    // Si le service a deja ete cree (serviceSlug existe), on passe directement a l'etape suivante sans tenter de creer a nouveau le service
    if (serviceSlug) {
      next();
      return;
    }
    // Validation des champs de l'etape actuelle avant de tenter la creation du service
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    // Tentative de creation du service avec les valeurs du formulaire
    try {
      // Construction du payload de creation
      const valuesArray = form.getValues(fields);
      const data = Object.fromEntries(
        fields.map((field, index) => [field, valuesArray[index]]),
      );
      // Appel de la mutation de creation du service
      const response = await createServiceMutation.mutateAsync(data);
      const { code, details } = response ?? {};
      // Recuperation du slug du service cree
      const slug = details?.service?.slug;
      // Si le slug est present dans la reponse, on le stocke dans l'etat pour permettre la synchronisation des champs dans les etapes suivantes
      if (slug) {
        setServiceSlug(slug);
      }
      // Affichage d'un message de succes
      toast.success(t(`codes:${code}`));
      // Passage a l'etape suivante
      next();
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      setServerErrors(error?.response?.data?.details, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };
  // Passe a l'etape suivante avec validation
  const goNextWithValidation = async () => {
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    next();
  };
  // Finish la creation du service et navigation vers la liste des services
  const finish = async () => {
    const fields = fieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    navigate("/dashboard/services");
  };
  // Fonction pour reset les champs de l'etape actuelle
  const handleFormResetByStep = () => {
    const fieldsResetByStep = fieldsByStep?.[step] || [];
    fieldsResetByStep.forEach((field) => form.resetField(field));
  };
  // Fichiers: suivi des changements et handlers de sauvegarde/reset
  const watchedFichiers = form.watch("fichiers") ?? [];
  const isFichiersChanged =
    watchedFichiers.length !== savedFichiers.length ||
    watchedFichiers.some((file, i) => file !== savedFichiers[i]);
  // Handler de sauvegarde des fichiers
  const handleSaveFichiers = useCallback(async () => {
    // Validation du champ de fichiers avant de tenter la synchronisation
    const files = form.getValues("fichiers") ?? [];
    if (!files.length || !serviceSlug) return;
    // Tentative de synchronisation des fichiers avec le backend
    try {
      // Appel de la mutation de synchronisation des fichiers
      const response = await syncFichiersMutation.mutateAsync({
        slug: serviceSlug,
        files,
      });
      // Recuperation du code de reponse pour afficher un message de succes approprie
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
      // Mise a jour de l'etat local des fichiers
      setSavedFichiers([...files]);
    } catch (error) {
      // Gestion des erreurs de validation et affichage des messages d'erreur
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  }, [form, serviceSlug, syncFichiersMutation, t]);
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
  // Fonction pour obtenir le label du bouton principal
  const getPrimaryLabel = () => {
    if (step === STEP_INFO) {
      return serviceSlug
        ? t("common:actions.next")
        : t("services.create.actions.submit");
    }
    if (step === STEP_FICHIERS) return t("common:actions.next");
    return t("common:actions.finish");
  };

  return (
    <Card className="shadow-none rounded-none">
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
            {t("common:actions.cancel")}
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={isPending || (step === STEP_INFO && serviceSlug)}>
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
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Textarea
                                placeholder={t(
                                  "services.form.fields.description.placeholder",
                                )}
                                className="max-h-100 overflow-y-auto"
                                {...field}
                              />
                            </FormControl>
                            <div className="absolute text-muted-foreground bottom-2 right-2">
                              {length}/{maxLength}
                            </div>
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
            {t("common:actions.back")}
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
          variant="secondary"
          className="w-full"
          onClick={handleFormResetByStep}
        >
          {t("common:actions.reset")}
        </Button>
      </CardFooter>
    </Card>
  );
}
