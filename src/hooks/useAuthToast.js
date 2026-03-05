import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook pour afficher les notifications toast selon l'etat d'authentification
 */
export function useAuthToast(status, code, t, type) {
  useEffect(() => {
    if (status === AUTH_STATUS.AUTHENTICATED)
      toast.success(t(`${type}.toast.success`));
    else if (code && status === AUTH_STATUS.UNAUTHENTICATED)
      toast.error(t(code));
  }, [status, code, t, type]);
}
