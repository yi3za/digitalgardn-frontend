import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";

/**
 * Hook personnalise pour gerer la synchronisation des champs de service
 */
export const useSyncField = (mutation, fieldName, serviceSlug, form) => {
  const { t } = useTranslation("codes");

  const sync = async () => {
    if (!serviceSlug) return;

    try {
      const value = form.getValues(fieldName);
      const response = await mutation.mutateAsync({
        slug: serviceSlug,
        data: { [fieldName]: value },
      });
      const { code } = response ?? {};
      toast.success(t(`${code}`));
      form.resetField(fieldName, { defaultValue: value });
    } catch ({
      response: {
        data: { code, details: errors },
      },
    }) {
      setServerErrors(errors, form.setError);
      toast.error(t(`${code}`));
    }
  };

  return {
    sync,
    isPending: mutation.isPending,
  };
};
