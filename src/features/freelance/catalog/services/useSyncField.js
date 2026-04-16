import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { setServerErrors } from "@/lib/utils";

/**
 * Hook personnalise pour gerer la synchronisation des champs de service
 */
export const useSyncField = (mutation, fieldName, serviceSlug, form) => {
  // Hook de traduction pour les messages d'erreur et de succes
  const { t } = useTranslation("codes");
  // Fonction pour synchroniser le champ specifique du service
  const sync = async () => {
    // Verification de la presence du slug du service avant de tenter la synchronisation
    if (!serviceSlug) return;
    // Tentative de synchronisation du champ avec le backend
    try {
      // Recuperation de la valeur actuelle du champ a synchroniser depuis le formulaire
      const value = form.getValues(fieldName);
      // Appel de la mutation de synchronisation avec le slug du service et la nouvelle valeur du champ
      const response = await mutation.mutateAsync({
        slug: serviceSlug,
        data: { [fieldName]: value },
      });
      // Recuperation du code de reponse pour afficher un message de succes appropriement traduit
      const { code } = response ?? {};
      toast.success(t(`${code}`));
      // Reset du champ dans le formulaire pour refleter la valeur synchronisee et eviter les desynchronisations d'etat
      form.resetField(fieldName, { defaultValue: value });
    } catch ({
      response: {
        data: { code, details: errors },
      },
    }) {
      // Gestion des erreurs de validation et affichage des messages d'erreur
      setServerErrors(errors, form.setError);
      toast.error(t(`${code}`));
    }
  };
  // Retourne la fonction de synchronisation et l'etat de chargement de la mutation pour permettre une integration facile dans les composants qui utilisent ce hook
  return {
    sync,
    isPending: mutation.isPending,
  };
};
