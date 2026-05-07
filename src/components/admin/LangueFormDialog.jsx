import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";
import { langueSchema } from "@/features/admin/langues/langues.schemas";
import {
  useCreateAdminLangue,
  useUpdateAdminLangue,
} from "@/features/admin/langues/langues.query";
import {
  ReusableDialog,
  Form,
  CustomFormField,
  FieldGroup,
  FieldSet,
} from "@/components/ui";

// Valeurs par defaut du formulaire
const DEFAULT_VALUES = {
  nom: "",
};

/**
 * Dialog de creation / modification d'une langue avec trigger interne
 */
export function LangueFormDialog({
  langue = null,
  triggerLabel,
  triggerProps = {},
}) {
  // Traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Determiner si c'est une edition ou une creation
  const isEdit = !!langue;
  const [open, setOpen] = useState(false);
  // Mutations pour creation et mise a jour
  const createMutation = useCreateAdminLangue();
  const updateMutation = useUpdateAdminLangue();
  const isPending = createMutation.isPending || updateMutation.isPending;
  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(langueSchema),
  });
  // Reinitialiser le formulaire a chaque ouverture
  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              nom: langue.nom,
            }
          : DEFAULT_VALUES,
      );
    }
  }, [open]);
  // Fonction de soumission du formulaire
  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        // Appel de la mutation de mise a jour avec l'id de la langue
        await updateMutation.mutateAsync({ id: langue.id, ...values });
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
          ? t("admin:langues.form.title_edit")
          : t("admin:langues.form.title_create")
      }
      description={
        isEdit
          ? t("admin:langues.form.description_edit")
          : t("admin:langues.form.description_create")
      }
      confirmLabel={
        isEdit ? t("admin:langues.form.save") : t("admin:langues.form.create")
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
              label={t("admin:langues.form.nom")}
              placeholder={t("admin:langues.form.nom_placeholder")}
              control={form.control}
              rules={{ min: 1, max: 255 }}
            />
          </FieldGroup>
        </FieldSet>
      </Form>
    </ReusableDialog>
  );
}
