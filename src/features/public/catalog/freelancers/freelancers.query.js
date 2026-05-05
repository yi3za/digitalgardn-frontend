import { useQuery } from "@tanstack/react-query";
import {
  getTopFreelancers,
  getFreelancerByUsername,
  getFreelancerAvis,
} from "./freelancers.api";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";

// Hook pour recuperer les meilleurs freelances (usage homepage)
export const useTopFreelancers = (limit = 6) =>
  useQuery({
    queryKey: ["top-freelancers", limit],
    queryFn: () => getTopFreelancers(limit),
  });

// Hook pour recuperer un freelance public via username avec pagination
export const useFreelancer = (username, page = 1) => {
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Determination si le freelance recherche est le freelance connecte pour forcer le rafraichissement des donnees a chaque visite
  const isOwner = username === user?.username;

  return useQuery({
    queryKey: ["freelancer", username, page],
    queryFn: () => getFreelancerByUsername(username, page),
    enabled: !!username,
    // Si c'est le profil de l'utilisateur connecte, on veut toujours les donnees a jour, sinon on peut se permettre de ne pas refetch a chaque visite
    refetchOnMount: isOwner ? "always" : false,
  });
};

// Hook pour recuperer les avis recus par un freelance avec pagination
export const useFreelancerAvis = (username, page = 1) =>
  useQuery({
    queryKey: ["freelancer", username, "avis", page],
    queryFn: () => getFreelancerAvis(username, page),
    enabled: !!username,
  });
