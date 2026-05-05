import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste de toutes les transactions
export const getAdminTransactions = async (filters = {}) => {
  const { data } = await client.get("/api/admin/transactions", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.transactions ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};
