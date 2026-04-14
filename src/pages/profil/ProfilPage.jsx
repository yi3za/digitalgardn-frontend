import { ProfilBioItem } from "@/components/profil/ProfilBioItem";
import { ProfilEditItem } from "@/components/profil/ProfilEditItem";
import { ProfilViewItem } from "@/components/profil/ProfilViewItem";
import { MultiHierarchicalItem } from "@/components/shared/MultiHierarchicalItem";
import { Button, Form, ItemGroup, Spinner } from "@/components/ui";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { updateInfoSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  syncCompetencesThunk,
  updateFreelanceProfilThunk,
} from "@/features/auth/auth.thunks";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import {
  formatDate,
  getFallbackName,
  setServerErrors,
  toCapitalize,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Definition des sheets disponibles
const SHEET = { PROFIL: { SHOW: "profile-show", EDIT: "profile-edit" } };

/**
 * Composant de la page de profil
 * Affiche les informations de l'utilisateur
 */
export function ProfilPage({ handleOnboardingCompletion }) {
  // competencesQuery contient generalement : data, isLoading, isError, etc.
  const competencesQuery = useCompetences();
  // Recupere les donnees de l'utilisateur authentifie
  const { user, loading } = useSelector(authSelector);
  // Fonction de traduction
  const { t } = useTranslation(["profil", "codes", "onboarding", "taxonomy"]);
  // Etat local pour control l'edition de biographie
  const [biographieEdit, setBiographieEdit] = useState(false);
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'utilisateur
  const avatarFallback = getFallbackName(user?.name);
  // Generation du nom de l'utilisateur avec la premiere lettre en majuscule pour l'affichage dans le profil
  const user_name = user?.name && toCapitalize(user.name);
  // Generation du titre professionnel de l'utilisateur pour l'affichage dans le profil
  const user_titre = `- ${
    user?.profil?.titre
      ? toCapitalize(user.profil.titre)
      : t("modifierInfo.fields.titre.placeholder")
  }`;
  // Formatage de la date d'inscription de l'utilisateur pour l'affichage dans le profil
  const date_incription = formatDate(user?.created_at);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Initialisation du formulaire avec les valeurs de l'utilisateur et validation basee sur updateInfoSchema
  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      titre: user?.profil?.titre ?? "",
      site_web: user?.profil?.site_web ?? "",
      biographie: user?.profil?.biographie ?? "",
      avatar: undefined,
      competences: user?.competences ?? [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(updateInfoSchema),
  });
  // Sheet actuellement ouvert
  const [activeSheet, setActiveSheet] = useState(null);
  // Fermer le actif
  const closeSheet = () => setActiveSheet(null);
  // Function pour mise a jour du profil freelance
  const handleUpdateFreelanceProfil = async () => {
    const values = form.getValues();
    const { name, avatar, competences, ...rest } = values;
    const dataKeys = Object.keys(rest).filter(
      (f) => form.formState.dirtyFields[f],
    );
    const data = Object.fromEntries(
      dataKeys.map((key) => [key, values[key].trim()]),
    );
    if (await form.trigger(dataKeys)) {
      try {
        const { code } = await dispatch(
          updateFreelanceProfilThunk(data),
        ).unwrap();
        toast.success(t(`codes:${code}`));
        form.reset({ ...values, ...data });
        if (data?.biographie) setBiographieEdit(false);
      } catch ({ code, details: errors }) {
        setServerErrors(errors, form.setError);
        toast.error(t(`codes:${code}`));
      }
    }
  };
  // Verifier que les champs obligatoires de freelance sont remplirent
  const isOnboardingTermine = async () => {
    if (!(await form.trigger(["titre", "avatar"]))) {
      setActiveSheet(SHEET.PROFIL.EDIT);
      return;
    }
    if (!(await form.trigger("biographie"))) {
      setBiographieEdit(true);
      return;
    }
    return handleOnboardingCompletion(true);
  };
  // Function pour mise a jour des competences
  const handleUpdateCompetences = async () => {
    const values = form.getValues();
    const { competences } = values;
    if (await form.trigger("competences")) {
      try {
        const { code } = await dispatch(
          syncCompetencesThunk({ competences }),
        ).unwrap();
        toast.success(t(`codes:${code}`));
        form.reset({ ...values, competences });
      } catch ({ code, details: errors }) {
        setServerErrors(errors, form.setError);
        toast.error(t(`codes:${code}`));
      }
    }
  };
  // Function pour reinitialiser les competences
  const handleResetCompetences = () => {
    form.resetField("competences", { defaultValue: user?.competences ?? [] });
  };

  return (
    <ItemGroup className="gap-5">
      <Form {...form}>
        {user?.onboarding_termine && (
          <ProfilViewItem
            t={t}
            activeSheet={activeSheet}
            closeSheet={closeSheet}
            setActiveSheet={setActiveSheet}
            user={user}
            avatarFallback={avatarFallback}
            user_name={user_name}
            date_incription={date_incription}
            SHEET={SHEET}
          />
        )}
        <ProfilEditItem
          t={t}
          user={user}
          user_name={user_name}
          user_titre={user_titre}
          date_incription={date_incription}
          activeSheet={activeSheet}
          setBiographieEdit={setBiographieEdit}
          closeSheet={closeSheet}
          setActiveSheet={setActiveSheet}
          loading={loading}
          form={form}
          handleUpdateFreelanceProfil={handleUpdateFreelanceProfil}
          avatarFallback={avatarFallback}
          SHEET={SHEET}
        />
        {user?.role === AUTH_ROLE.FREELANCE && (
          <>
            <ProfilBioItem
              t={t}
              user={user}
              biographieEdit={biographieEdit}
              setBiographieEdit={setBiographieEdit}
              form={form}
              loading={loading}
              handleUpdateFreelanceProfil={handleUpdateFreelanceProfil}
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
              saveIsLoading={loading.syncCompetences}
              onSave={handleUpdateCompetences}
              onReset={handleResetCompetences}
              competencesChanged={form.formState.dirtyFields?.competences}
            />
          </>
        )}
      </Form>
      {user?.role === AUTH_ROLE.FREELANCE &&
        !user?.onboarding_termine &&
        !biographieEdit && (
          <Button
            onClick={isOnboardingTermine}
            disabled={loading.completeOnboarding}
            className="mt-3 w-fit self-end"
          >
            {loading.completeOnboarding && <Spinner />}
            {t("onboarding:actions.submit")}
          </Button>
        )}
    </ItemGroup>
  );
}
