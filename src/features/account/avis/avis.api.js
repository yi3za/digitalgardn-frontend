import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste des avis recus par le freelance connecte
export const getMyAvis = async (filters = {}) => {
  const { data } = await client.get("/api/me/avis", {
    params: cleanFilters(filters),
  });

  return {
    items: data?.details?.avis ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Supprime un avis recu par le freelance connecte
export const deleteMyAvis = async (avisId) => {
  await client.delete(`/api/me/avis/${avisId}`);
};
