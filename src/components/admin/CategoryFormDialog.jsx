import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";
import { categorieSchema } from "@/features/admin/categories/categories.schemas";
import {
  useCreateAdminCategorie,
  useUpdateAdminCategorie,
} from "@/features/admin/categories/categories.query";
import {
  ReusableDialog,
  Form,
  CustomFormField,
  FieldGroup,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  FieldSet,
} from "@/components/ui";

// Valeurs par defaut du formulaire
const DEFAULT_VALUES = {
  nom: "",
  description: "",
  parent_id: null,
  ordre: 0,
  est_active: true,
};

/**
 * Dialog de creation / modification d'une categorie avec trigger interne
 */
export function CategoryFormDialog({
  categorie = null,
  parents = [],
  triggerLabel,
  triggerProps = {},
}) {
  // Traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Determiner si c'est une edition ou une creation
  const isEdit = !!categorie;
  const [open, setOpen] = useState(false);
  // Mutations pour creation et mise a jour
  const createMutation = useCreateAdminCategorie();
  const updateMutation = useUpdateAdminCategorie();
  const isPending = createMutation.isPending || updateMutation.isPending;
  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(categorieSchema),
  });
  // Reinitialiser le formulaire a chaque ouverture
  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              nom: categorie.nom,
              description: categorie.description ?? "",
              parent_id: categorie.parent_id ?? null,
              ordre: categorie.ordre ?? 0,
              est_active: Boolean(categorie.est_active ?? true),
            }
          : DEFAULT_VALUES,
      );
    }
  }, [open]);
  // Fonction de soumission du formulaire
  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        // Appel de la mutation de mise a jour avec l'id de la categorie
        await updateMutation.mutateAsync({ id: categorie.id, ...values });
      } else {
        // Appel de la mutation de creation
        await createMutation.mutateAsync(values);
      }
      toast.success(t("codes:SUCCESS"));
      setOpen(false);
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      // Afficher les erreurs de validation
      setServerErrors(error?.response?.data?.details, form.setError);
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={setOpen}
      triggerLabel={triggerLabel}
      triggerProps={triggerProps}
      title={
        isEdit
          ? t("admin:categories.form.title_edit")
          : t("admin:categories.form.title_create")
      }
      confirmLabel={
        isEdit
          ? t("admin:categories.form.save")
          : t("admin:categories.form.create")
      }
      cancelLabel={t("common:actions.cancel")}
      onConfirm={form.handleSubmit(onSubmit)}
      loading={isPending}
      disabled={isPending}
    >
      <Form {...form}>
        <FieldSet disabled={isPending}>
          <FieldGroup>
            <CustomFormField
              name="nom"
              label={t("admin:categories.form.nom")}
              placeholder={t("admin:categories.form.nom_placeholder")}
              control={form.control}
              rules={{ min: 1, max: 100 }}
            />
            <CustomFormField
              name="description"
              label={t("admin:categories.form.description")}
              placeholder={t("admin:categories.form.description_placeholder")}
              control={form.control}
              rules={{ max: 500 }}
            />
            <CustomFormField
              name="ordre"
              label={t("admin:categories.form.ordre")}
              placeholder={t("admin:categories.form.ordre_placeholder")}
              type="number"
              min={0}
              control={form.control}
              rules={{ min: 0 }}
            />
            {parents.length > 0 && (
              <FormField
                name="parent_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin:categories.form.parent")}</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : "none"}
                      onValueChange={(v) =>
                        field.onChange(v === "none" ? null : Number(v))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("admin:categories.form.no_parent")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("admin:categories.form.no_parent")}
                        </SelectItem>
                        {parents.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="est_active"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("admin:categories.form.est_active")}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </Form>
    </ReusableDialog>
  );
}
