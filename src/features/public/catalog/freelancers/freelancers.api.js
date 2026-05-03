import { client } from "@/api/client";

// Recuperer les details d'un freelance public par username
export const getFreelancerByUsername = async (username) => {
  const { data } = await client.get(`/api/freelancers/${username}`);
  return data?.details ?? { freelancer: null, services: [] };
};

// Recuperer les avis recus par un freelance
export const getFreelancerAvis = async (username) => {
  const { data } = await client.get(`/api/freelancers/${username}/avis`);
  return data?.details?.avis ?? [];
};
