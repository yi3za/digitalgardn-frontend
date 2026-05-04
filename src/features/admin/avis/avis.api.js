import { client } from "@/api/client";

// Liste de tous les avis
export const getAdminAvis = async () => {
  const { data } = await client.get("/api/admin/avis");
  return data?.details?.avis ?? [];
};

// Supprime un avis par son id
export const deleteAdminAvis = async (avisId) => {
  await client.delete(`/api/admin/avis/${avisId}`);
};
