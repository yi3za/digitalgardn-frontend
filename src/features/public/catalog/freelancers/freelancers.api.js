import { client } from "@/api/client";

// Recuperer les details d'un freelance public par username
export const getFreelancerByUsername = async (username) => {
  const { data } = await client.get(`/api/freelancers/${username}`);
  return data?.details ?? { freelancer: null, services: [] };
};
