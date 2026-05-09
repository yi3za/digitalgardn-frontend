import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";
import { IconeUploadField } from "@/components/admin/IconeUploadField";
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
  Textarea,
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
export function CategorieFormDialog({
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
      // Convertir le booleen en 0/1 pour Laravel multipart
      const payload = {
        ...values,
        est_active: values.est_active ? 1 : 0,
        parent_id: Number(values.parent_id) || null,
      };
      if (isEdit) {
        // Appel de la mutation de mise a jour avec l'id de la categorie
        await updateMutation.mutateAsync({ id: categorie.id, ...payload });
      } else {
        // Appel de la mutation de creation
        await createMutation.mutateAsync(payload);
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
      description={
        isEdit
          ? t("admin:categories.form.description_edit")
          : t("admin:categories.form.description_create")
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
            <IconeUploadField
              control={form.control}
              label={t("admin:categories.form.icone")}
              open={open}
            />
            <CustomFormField
              name="nom"
              label={t("admin:categories.form.nom")}
              placeholder={t("admin:categories.form.nom_placeholder")}
              control={form.control}
              rules={{ min: 1, max: 100 }}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => {
                const label = t("admin:categories.form.description");
                const placeholder = t(
                  "admin:categories.form.description_placeholder",
                );
                return (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-30"
                        {...field}
                        placeholder={placeholder}
                      />
                    </FormControl>
                    <FormMessage rules={{ attribute: label, max: 500 }} />
                  </FormItem>
                );
              }}
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
                render={({ field }) => {
                  const label = t("admin:categories.form.parent");
                  return (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
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
                      <FormMessage rules={{ attribute: label }} />
                    </FormItem>
                  );
                }}
              />
            )}
            <FormField
              name="est_active"
              control={form.control}
              render={({ field }) => {
                const label = t("admin:categories.form.est_active");
                return (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <FormLabel>{label}</FormLabel>
                    <FormMessage rules={{ attribute: label }} />
                  </FormItem>
                );
              }}
            />
          </FieldGroup>
        </FieldSet>
      </Form>
    </ReusableDialog>
  );
}
