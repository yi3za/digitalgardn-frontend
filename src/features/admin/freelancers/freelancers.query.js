import { useQuery } from "@tanstack/react-query";
import { getAdminFreelancer, getAdminFreelancerAvis } from "./freelancers.api";

// Profil complet d'un freelance (quel que soit son statut)
export const useAdminFreelancer = (username) =>
  useQuery({
    queryKey: ["admin", "freelancer", username],
    queryFn: () => getAdminFreelancer(username),
    enabled: !!username,
  });

// Avis recus par un freelance (quel que soit son statut)
export const useAdminFreelancerAvis = (username) =>
  useQuery({
    queryKey: ["admin", "freelancer", username, "avis"],
    queryFn: () => getAdminFreelancerAvis(username),
    enabled: !!username,
  });
