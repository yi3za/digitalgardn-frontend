import { client } from "@/api/client";

// Liste de toutes les transactions
export const getAdminTransactions = async () => {
  const { data } = await client.get("/api/admin/transactions");
  return data?.details?.transactions ?? [];
};
