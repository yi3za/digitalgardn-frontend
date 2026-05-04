import { client } from "@/api/client";

// Liste de tous les portefeuilles
export const getAdminPortefeuilles = async () => {
  const { data } = await client.get("/api/admin/portefeuilles");
  return data?.details?.portefeuilles ?? [];
};
