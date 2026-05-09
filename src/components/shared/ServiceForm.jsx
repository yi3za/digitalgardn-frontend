import { Clock, DollarSign, FileText, RotateCcw } from "lucide-react";
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  Card,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
  Textarea,
} from "@/components/ui";
import { FichiersUploadItem } from "@/components/shared/FichiersUploadItem";
import { MultiHierarchicalItem } from "@/components/shared/MultiHierarchicalItem";
import {
  STEP_FICHIERS,
  STEP_INFO,
  STEP_TAXONOMY,
} from "@/features/freelance/catalog/services/useServiceForm";

/**
 * Composant de formulaire de service, qui affiche les champs d'information, de fichiers et de taxonomie selon l'etape actuelle du formulaire
 */
export function ServiceForm({ title, description, controller }) {
  // Destructuration des proprietes et fonctions du controller de formulaire
  const {
    t,
    form,
    step,
    back,
    isPending,
    isFichiersChanged,
    categoriesQuery,
    competencesQuery,
    syncCategories,
    syncCompetences,
    syncFichiersMutation,
    saveFichiers,
    resetFichiers,
    resetCurrentStep,
    handlePrimaryAction,
    primaryLabel,
    cancel,
    isInfoLocked,
  } = controller;
  // Determination si les champs de taxonomie ont ete modifies, en verifiant les dirtyFields de react-hook-form pour les competences et categories
  const isTaxonomyChanged =
    form.formState.dirtyFields?.competences ||
    form.formState.dirtyFields?.categories;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button onClick={cancel} variant="link" disabled={isPending}>
            {t("common:actions.cancel")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <FieldSet disabled={isPending || isInfoLocked}>
            <FieldGroup>
              {step === STEP_INFO && <ServiceInfoFields t={t} form={form} />}
              {step === STEP_FICHIERS && (
                <FichiersUploadItem
                  t={t}
                  name="fichiers"
                  control={form.control}
                  maxFiles={10}
                  title={t("services.form.fields.fichiers.label")}
                  description={t("services.form.fields.fichiers.description")}
                  saveIsLoading={syncFichiersMutation.isPending}
                  onSave={saveFichiers}
                  onReset={resetFichiers}
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
              isTaxonomyChanged
            }
            className="flex-1"
            onClick={handlePrimaryAction}
          >
            {step === STEP_INFO && isPending && <Spinner />}
            {primaryLabel}
          </Button>
        </ButtonGroup>
        <Button
          disabled={isPending}
          variant="secondary"
          className="w-full"
          onClick={resetCurrentStep}
        >
          {t("common:actions.reset")}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ServiceInfoFields({ t, form }) {
  return (
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
              <FormMessage rules={{ attribute: label, min: 150, max: 600 }} />
            </FormItem>
          );
        }}
      />
      <CustomFormField
        name="prix_base"
        type="number"
        label={t("services.form.fields.prix_base.label")}
        placeholder={t("services.form.fields.prix_base.placeholder")}
        control={form.control}
        icon={DollarSign}
        rules={{ min: 1 }}
        min={1}
      />
      <CustomFormField
        name="delai_livraison"
        type="number"
        label={t("services.form.fields.delai_livraison.label")}
        placeholder={t("services.form.fields.delai_livraison.placeholder")}
        control={form.control}
        icon={Clock}
        rules={{ min: 1 }}
        min={1}
      />
      <CustomFormField
        name="revisions"
        type="number"
        label={t("services.form.fields.revisions.label")}
        placeholder={t("services.form.fields.revisions.placeholder")}
        control={form.control}
        icon={RotateCcw}
        rules={{ min: 0 }}
        min={0}
      />
    </>
  );
}
