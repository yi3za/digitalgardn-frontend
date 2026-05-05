import { useQuery } from "@tanstack/react-query";
import { getAdminAvis } from "./avis.api";

// Liste de tous les avis
export const useAdminAvis = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "avis", filters],
    queryFn: () => getAdminAvis(filters),
  });
