import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import {
  useCreateService,
  useSyncCategories,
  useSyncCompetences,
  useSyncFichiers,
  useUpdateService,
} from "./services.mutations";
import { useSyncField } from "./useSyncField";
import { setServerErrors } from "@/lib/utils";

// Etapes du formulaire de service
export const STEP_INFO = 1;
export const STEP_FICHIERS = 2;
export const STEP_TAXONOMY = 3;

// Champs de validation pour les informations de base du service
export const serviceFieldsByStep = {
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

// Valeurs par defaut du formulaire de service
const defaultValues = {
  titre: "",
  description: "",
  prix_base: 1,
  delai_livraison: 1,
  revisions: 0,
  fichiers: [],
  categories: [],
  competences: [],
};

// Fonction utilitaire pour construire les donnees a envoyer a l'API a partir des valeurs du formulaire et des champs a inclure
const buildStepData = (form, fields) => {
  const valuesArray = form.getValues(fields);
  return Object.fromEntries(
    fields.map((field, index) => [field, valuesArray[index]]),
  );
};

// Fonction utilitaire pour transformer les fichiers existants en items utilisables dans le formulaire
const toFichierItems = (fichiers = []) =>
  fichiers
    .filter((fichier) => fichier?.id && fichier?.chemin_url)
    .map((fichier) => ({
      type: "existing",
      id: fichier.id,
      url: fichier.chemin_url,
      name: fichier.chemin?.split("/").pop() ?? `image-${fichier.id}`,
    }));

// Fonction utilitaire pour generer une cle unique
const getFichierKey = (item) => {
  if (item?.type === "existing") return `existing:${item.id}`;
  const file = item?.file;
  return file
    ? `new:${file.name}:${file.size}:${file.lastModified}`
    : "new:missing";
};

// Fonction utilitaire pour comparer deux listes de fichiers
const fichiersEqual = (a = [], b = []) =>
  a.length === b.length &&
  a.every((item, index) => getFichierKey(item) === getFichierKey(b[index]));

/**
 * Hook de gestion du formulaire de creation et d'edition de service
 */
export function useServiceForm({ mode, schema, service = null, slug = null }) {
  // Hook de traduction
  const { t } = useTranslation(["dashboard", "common", "codes", "taxonomy"]);
  // Hook de navigation
  const navigate = useNavigate();
  // Requete des chemins de navigation pour les services
  const { services: servicesBasePath } = useNavigationPaths();
  // Mutations pour la creation et la mise a jour de service
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  // Mutations pour la synchronisation des champs de taxonomie et de fichiers
  const syncCategoriesMutation = useSyncCategories();
  const syncCompetencesMutation = useSyncCompetences();
  const syncFichiersMutation = useSyncFichiers();
  // Requetes pour recuperer les categories et competences disponibles
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  // Initialisation du formulaire avec react-hook-form
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  // Etat de l'etape actuelle du formulaire (informations, fichiers, taxonomie)
  const [step, setStep] = useState(STEP_INFO);
  // Slug du service en cours de creation ou d'edition
  const [serviceSlug, setServiceSlug] = useState(mode === "edit" ? slug : null);
  // Etat des fichiers sauvegardes
  const [savedFichiers, setSavedFichiers] = useState([]);
  // Fonctions de synchronisation des champs de taxonomie
  const effectiveSlug = serviceSlug ?? slug;
  // Utilisation du hook de synchronisation pour les categories et competences
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
  // Redirection vers l'etape d'edition du service si on est en mode creation et qu'on a recu un slug
  useEffect(() => {
    if (mode !== "edit") return;
    setServiceSlug(slug);
  }, [mode, slug]);
  // Initialisation des valeurs du formulaire et des fichiers sauvegardes a partir du service recu en props
  useEffect(() => {
    if (mode !== "edit" || !service) return;
    // Transformation des fichiers existants du service en items utilisables dans le formulaire
    const fichiers = toFichierItems(service.fichiers);
    setSavedFichiers(fichiers);
    form.reset({
      titre: service.titre ?? "",
      description: service.description ?? "",
      prix_base: service.prix_base ?? 1,
      delai_livraison: service.delai_livraison ?? 1,
      revisions: service.revisions ?? 0,
      categories: service.categories?.map((c) => c.id) ?? [],
      competences: service.competences?.map((c) => c.id) ?? [],
      fichiers,
    });
  }, [form, mode, service]);
  // Redefinition de la fonction de navigation
  const next = () => setStep((s) => Math.min(s + 1, STEP_TAXONOMY));
  const back = () => setStep((s) => Math.max(s - 1, STEP_INFO));
  // Determination de l'etat de chargement global du formulaire en fonction des mutations en cours
  const isPending =
    createServiceMutation.isPending ||
    updateServiceMutation.isPending ||
    syncCategories.isPending ||
    syncCompetences.isPending;
  // Determination si les fichiers ont ete modifies
  const watchedFichiers = form.watch("fichiers") ?? [];
  const isFichiersChanged = !fichiersEqual(watchedFichiers, savedFichiers);
  //
  // Fonction utilitaire pour determiner si au moins un champ d'une liste est modifie dans le formulaire
  const isDirtyFieldsByStep = (dirtyFields, fields) =>
    fields.some((field) => dirtyFields?.[field]);
  // Determination si les champs d'information ont ete modifies
  const isInfoChanged = isDirtyFieldsByStep(
    form.formState.dirtyFields,
    serviceFieldsByStep[STEP_INFO],
  );
  // Gestion de la soumission des informations de base du service
  const submitInfo = async () => {
    if (
      (mode === "create" && serviceSlug) ||
      (mode === "edit" && !isInfoChanged)
    ) {
      next();
      return;
    }
    const fields = serviceFieldsByStep[STEP_INFO];
    if (!(await form.trigger(fields))) return;
    try {
      const data = buildStepData(form, fields);
      const response =
        mode === "create"
          ? await createServiceMutation.mutateAsync(data)
          : await updateServiceMutation.mutateAsync({
              slug: effectiveSlug,
              data,
            });
      const { code } = response ?? {};
      const updatedSlug = response?.details?.service?.slug ?? effectiveSlug;
      if (updatedSlug) setServiceSlug(updatedSlug);
      if (mode === "edit" && updatedSlug && updatedSlug !== slug) {
        navigate(`${servicesBasePath}/${updatedSlug}/edit`, { replace: true });
      }
      toast.success(t(`codes:${code}`));
      next();
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      setServerErrors(error?.response?.data?.details, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };
  // Fonction de navigation vers l'etape suivante avec validation des champs de l'etape actuelle
  const goNextWithValidation = async () => {
    const fields = serviceFieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    next();
  };
  // Fonction de navigation vers l'etape de fin du formulaire avec validation de tous les champs
  const finish = async () => {
    const fields = serviceFieldsByStep?.[step] || [];
    if (!(await form.trigger(fields))) return;
    navigate(servicesBasePath);
  };
  // Fonction de reinitialisation des champs de l'etape actuelle
  const resetCurrentStep = () => {
    const fields = serviceFieldsByStep?.[step] || [];
    fields.forEach((field) => form.resetField(field));
  };
  // Fonction de sauvegarde des fichiers du service
  const saveFichiers = useCallback(async () => {
    if (!(await form.trigger("fichiers"))) return;
    const fichiers = form.getValues("fichiers") ?? [];
    if (!fichiers.length || !effectiveSlug) return;
    try {
      const response = await syncFichiersMutation.mutateAsync({
        slug: effectiveSlug,
        files: fichiers,
      });
      const { code } = response ?? {};
      toast.success(t(`codes:${code}`));
      setSavedFichiers([...fichiers]);
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      toast.error(t(`codes:${code}`));
    }
  }, [effectiveSlug, form, syncFichiersMutation, t]);
  // Fonction de reinitialisation des fichiers aux valeurs sauvegardees
  const resetFichiers = useCallback(() => {
    form.resetField("fichiers", { defaultValue: [...savedFichiers] });
  }, [form, savedFichiers]);
  // Gestion de l'action principale du formulaire
  const handlePrimaryAction = async () => {
    if (step === STEP_INFO) {
      await submitInfo();
    } else if (step === STEP_FICHIERS) {
      await goNextWithValidation();
    } else {
      await finish();
    }
  };
  // Fonction utilitaire pour determiner le label du bouton d'action principale
  const getPrimaryLabel = () => {
    if (step === STEP_FICHIERS) return t("common:actions.next");
    if (step !== STEP_INFO) return t("common:actions.finish");
    // En mode creation
    if (mode === "create") {
      return serviceSlug
        ? t("common:actions.next")
        : t("services.create.actions.submit");
    }
    // En mode edition
    return !isInfoChanged ? t("common:actions.next") : t("common:actions.save");
  };

  return {
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
    primaryLabel: getPrimaryLabel(),
    cancel: () => navigate(servicesBasePath),
    isInfoLocked: mode === "create" && step === STEP_INFO && !!serviceSlug,
  };
}
