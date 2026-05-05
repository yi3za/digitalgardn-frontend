import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

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
