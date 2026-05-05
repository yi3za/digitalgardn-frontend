import { useQuery } from "@tanstack/react-query";
import { getAdminFreelancer, getAdminFreelancerAvis } from "./freelancers.api";

// Profil complet d'un freelance (quel que soit son statut)
export const useAdminFreelancer = (username, page = 1) =>
  useQuery({
    queryKey: ["admin", "freelancer", username, page],
    queryFn: () => getAdminFreelancer(username, page),
    enabled: !!username,
  });

// Avis recus par un freelance (quel que soit son statut)
export const useAdminFreelancerAvis = (username, page = 1) =>
  useQuery({
    queryKey: ["admin", "freelancer", username, "avis", page],
    queryFn: () => getAdminFreelancerAvis(username, page),
    enabled: !!username,
  });
