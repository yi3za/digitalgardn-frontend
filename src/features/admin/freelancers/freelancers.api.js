import { client } from "@/api/client";

// Profil complet d'un freelance (quel que soit son statut)
export const getAdminFreelancer = async (username, page = 1) => {
  const { data } = await client.get(`/api/admin/freelancers/${username}`, {
    params: { page },
  });
  return data?.details ?? { freelancer: null, services: [], meta: null };
};

// Avis recus par un freelance (quel que soit son statut)
export const getAdminFreelancerAvis = async (username, page = 1) => {
  const { data } = await client.get(`/api/admin/freelancers/${username}/avis`, {
    params: { page },
  });
  return {
    items: data?.details?.avis ?? [],
    meta: data?.details?.meta ?? {},
  };
};
