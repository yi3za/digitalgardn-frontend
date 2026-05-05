import { client } from "@/api/client";

// Recuperer les details d'un freelance public par username
export const getFreelancerByUsername = async (username, page = 1) => {
  const { data } = await client.get(`/api/freelancers/${username}`, {
    params: { page },
  });
  return data?.details ?? { freelancer: null, services: [], meta: null };
};

// Recuperer les avis recus par un freelance
export const getFreelancerAvis = async (username, page = 1) => {
  const { data } = await client.get(`/api/freelancers/${username}/avis`, {
    params: { page },
  });
  return data?.details ?? { avis: [], meta: null };
};
