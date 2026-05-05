import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Profil complet d'un freelance (quel que soit son statut)
export const getAdminFreelancer = async (username, serviceFilters = {}) => {
  const { data } = await client.get(`/api/admin/freelancers/${username}`, {
    params: cleanFilters(serviceFilters),
  });
  return data?.details ?? { freelancer: null, services: [] };
};

// Avis recus par un freelance (quel que soit son statut)
export const getAdminFreelancerAvis = async (username) => {
  const { data } = await client.get(`/api/admin/freelancers/${username}/avis`);
  return data?.details?.avis ?? [];
};
