import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste de tous les avis
export const getAdminAvis = async (filters = {}) => {
  const { data } = await client.get("/api/admin/avis", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.avis ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Supprime un avis par son id
export const deleteAdminAvis = async (avisId) => {
  await client.delete(`/api/admin/avis/${avisId}`);
};
