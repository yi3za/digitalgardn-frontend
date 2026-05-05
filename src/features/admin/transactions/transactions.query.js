import { useQuery } from "@tanstack/react-query";
import { getAdminTransactions } from "./transactions.api";

// Liste de toutes les transactions
export const useAdminTransactions = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "transactions", filters],
    queryFn: () => getAdminTransactions(filters),
  });
