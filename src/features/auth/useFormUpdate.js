import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";

/**
 * Hook utilitaire pour gerer les mises a jour de formulaire via Redux Thunk
 * Unifie le processus d'extraction de donnees, validation, dispatch, toast et gestion d'erreurs
 */
export const useFormUpdate = (form) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["codes"]);

  /**
   * Fonction utilitaire generale pour executer une mise a jour
   * Gere: validation, dispatch, feedback utilisateur, et gestion d'erreurs
   */
  const executeGenericUpdate = async (config) => {
    const {
      fieldNames,
      thunk,
      resetFields,
      getFieldValue = null, // Fonction optionnelle pour extraire les donnees
    } = config;

    // Normaliser fieldNames en array
    const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    const fieldsToReset = Array.isArray(resetFields)
      ? resetFields
      : resetFields
        ? [resetFields]
        : fields;

    // Extraire les donnees (par defaut depuis le formulaire, ou via getFieldValue)
    let data = {};
    if (getFieldValue) {
      data = getFieldValue();
    } else {
      const allValues = form.getValues();
      fields.forEach((field) => {
        data[field] = allValues[field];
      });
    }
    // Valider les champs
    if (!(await form.trigger(fields))) {
      return false;
    }

    try {
      // Dispatcher le thunk et attendre la reponse
      const { code } = await dispatch(thunk(data)).unwrap();
      // Afficher un message de succes
      toast.success(t(`codes:${code}`));
      // Reinitialiser les champs speciifies
      fieldsToReset.forEach((field) => {
        form.resetField(field, {
          defaultValue: data[field],
        });
      });
      return true;
    } catch ({ code, details: errors }) {
      // Definir les erreurs de serveur dans le formulaire
      setServerErrors(errors, form.setError);
      // Afficher un message d'erreur
      toast.error(t(`codes:${code}`));
      return false;
    }
  };

  /**
   * Execute une mise a jour de formulaire standard
   */
  const executeUpdate = (config) => executeGenericUpdate(config);

  return { executeUpdate };
};
