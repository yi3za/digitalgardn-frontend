import { setServerErrors } from "@/lib/utils";
import { useEffect } from "react";

/**
 * Hook pour appliquer automatiquement les erreurs serveur aux champs du formulaire
 */
export function useServerErrors(errors, setError) {
  useEffect(() => {
    if (!errors) return;
    setServerErrors(errors, setError);
  }, [errors, setError]);
}
