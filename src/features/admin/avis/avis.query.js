import { useQuery } from "@tanstack/react-query";
import { getAdminAvis } from "./avis.api";

// Liste de tous les avis
export const useAdminAvis = () =>
  useQuery({
    queryKey: ["admin", "avis"],
    queryFn: getAdminAvis,
  });
