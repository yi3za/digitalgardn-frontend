import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recuperer les details d'un freelance public par username
export const getFreelancerByUsername = async (
  username,
  serviceFilters = {},
) => {
  const { data } = await client.get(`/api/freelancers/${username}`, {
    params: cleanFilters(serviceFilters),
  });
  return data?.details ?? { freelancer: null, services: [] };
};

// Recuperer les avis recus par un freelance
export const getFreelancerAvis = async (username) => {
  const { data } = await client.get(`/api/freelancers/${username}/avis`);
  return data?.details?.avis ?? [];
};
