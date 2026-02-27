import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

// Composant Formulaire reutilisable avec gestion des erreurs serveur
export default function Form({ children, serverError, onSubmit, ...props }) {
  // Initialisation du formulaire avec react-hook-form
  // setError permet de remplir les erreurs specifiques aux champs
  const { setError, ...methods } = useForm();
  // Effet pour synchroniser les erreurs du serveur avec le formulaire
  useEffect(() => {
    // Ne rien faire si details est undefined ou null
    if (!serverError?.details) return;
    // Parcourt chaque champ retourne par le backend et assigne la premiere erreur
    Object.entries(serverError?.details).forEach(([field, message]) => {
      setError(field, { type: "server", message: message[0] });
    });
  }, [serverError, setError]);
  // Fournit les methodes du formulaire aux composants enfants via FormProvider
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {/* Affiche un message d'erreur general si present */}
        {serverError?.message && (
          <ErrorMessage message={serverError?.message} />
        )}
        {/* Tous les composants enfants du formulaire */}
        {children}
      </form>
    </FormProvider>
  );
}
