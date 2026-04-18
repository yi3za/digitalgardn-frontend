import { useQuery } from "@tanstack/react-query";
import { getFreelancerByUsername } from "./freelancers.api";

// Hook pour recuperer un freelance public via username
export const useFreelancer = (username) =>
  useQuery({
    queryKey: ["freelancer", username],
    queryFn: () => getFreelancerByUsername(username),
    enabled: !!username,
  });
