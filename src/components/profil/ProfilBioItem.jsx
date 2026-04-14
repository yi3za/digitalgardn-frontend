import { toCapitalize } from "@/lib/utils";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Spinner,
  Textarea,
} from "../ui";
import { useFormUpdate } from "@/features/auth/useFormUpdate";
import { updateFreelanceProfilThunk } from "@/features/auth/auth.thunks";

/**
 * Composant de la page de profil
 * Affiche le biographie de l'utilisateur
 */
export function ProfilBioItem({
  t,
  user,
  biographieEdit,
  setBiographieEdit,
  form,
  loading,
}) {
  // Hook pour les mises a jour de formulaire
  const { executeBioUpdate } = useFormUpdate(form);
  // Function pour mise a jour de la biographie
  const handleUpdateBio = async () => {
    const success = await executeBioUpdate({
      fieldName: "biographie",
      thunk: updateFreelanceProfilThunk,
    });
    if (success) setBiographieEdit(false);
  };

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{t("modifierInfo.fields.biographie.label")}</ItemTitle>
        <ItemDescription>
          {t("modifierInfo.fields.biographie.description")}
        </ItemDescription>
        <FormField
          control={form.control}
          name="biographie"
          render={({ field }) => {
            const length = field.value?.length || 0;
            const maxLength = 600;
            return (
              <FormItem className="mt-3">
                {biographieEdit ? (
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={loading.updateFreelanceProfil}
                        placeholder={t(
                          "modifierInfo.fields.biographie.placeholder",
                        )}
                        className="min-h-30"
                      />
                    </FormControl>
                    <div className="absolute bottom-2 right-2">
                      {length}/{maxLength}
                    </div>
                  </div>
                ) : (
                  <ItemDescription className="line-clamp-10">
                    {user?.profil?.biographie
                      ? toCapitalize(user.profil.biographie)
                      : t("modifierInfo.fields.biographie.placeholder")}
                  </ItemDescription>
                )}
                <FormMessage
                  rules={{
                    attribute: t("modifierInfo.fields.biographie.label"),
                    min: 150,
                    max: maxLength,
                  }}
                />
              </FormItem>
            );
          }}
        />
        {biographieEdit && form.formState.dirtyFields?.biographie && (
          <Button
            onClick={handleUpdateBio}
            disabled={loading.updateFreelanceProfil}
            className="mt-3 w-fit"
          >
            {loading.updateFreelanceProfil && <Spinner />}
            {t("actions.save")}
          </Button>
        )}
      </ItemContent>
      <ItemActions className="self-start">
        <Button
          variant="link"
          className="pt-0 h-fit"
          onClick={() => setBiographieEdit(!biographieEdit)}
        >
          {biographieEdit ? t("actions.cancel") : t("actions.edit")}
        </Button>
      </ItemActions>
    </Item>
  );
}
