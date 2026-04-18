import { useQuery } from "@tanstack/react-query";
import { getFreelancerByUsername } from "./freelancers.api";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";

// Hook pour recuperer un freelance public via username
export const useFreelancer = (username) => {
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Determination si le freelance recherche est le freelance connecte pour forcer le rafraichissement des donnees a chaque visite
  const isOwner = username === user?.username;

  return useQuery({
    queryKey: ["freelancer", username],
    queryFn: () => getFreelancerByUsername(username),
    enabled: !!username,
    // Si c'est le profil de l'utilisateur connecte, on veut toujours les donnees a jour, sinon on peut se permettre de ne pas refetch a chaque visite
    refetchOnMount: isOwner ? "always" : false,
  });
};
