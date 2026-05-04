import { useQuery } from "@tanstack/react-query";
import { getAdminTransactions } from "./transactions.api";

// Liste de toutes les transactions
export const useAdminTransactions = () =>
  useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: getAdminTransactions,
  });
