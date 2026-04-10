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

/**
 * Composant de la page de profil
 * Affiche le biographie de l'utilisateur
 */
export default function ProfilBioItem({
  t,
  user,
  biographieEdit,
  setBiographieEdit,
  form,
  loading,
  handleUpdateFreelanceProfil,
}) {
  // Functionne pour control l'edition de biographie
  const handleBiographieEdit = () => {
    if (biographieEdit) {
      form.resetField("biographie", {
        defaultValue: user?.profil?.biographie ?? "",
      });
      setBiographieEdit(false);
    } else {
      setBiographieEdit(true);
    }
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
                        autoFocus
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
            onClick={handleUpdateFreelanceProfil}
            disabled={loading.updateFreelanceProfil}
            className="mt-3"
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
          onClick={handleBiographieEdit}
        >
          {biographieEdit ? t("actions.cancel") : t("actions.edit")}
        </Button>
      </ItemActions>
    </Item>
  );
}
