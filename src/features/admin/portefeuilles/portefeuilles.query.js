import { useQuery } from "@tanstack/react-query";
import { getAdminPortefeuilles } from "./portefeuilles.api";

// Liste de tous les portefeuilles
export const useAdminPortefeuilles = () =>
  useQuery({
    queryKey: ["admin", "portefeuilles"],
    queryFn: getAdminPortefeuilles,
  });
