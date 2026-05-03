import { getFallbackName } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, Button } from "../ui";
import { useNavigate } from "react-router-dom";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Affiche l'avatar d'un utilisateur avec lien vers le profil freelancer si applicable
 */
export function AvatarIdentity({ user }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Base paths selon le contexte (public ou admin)
  const { freelancers: freelancersBasePath } = useNavigationPaths();
  // Genere un nom fallback
  const fallbackName = getFallbackName(user?.name);
  // Determine si l'utilisateur est un freelancer
  const isFreelancer = user?.role === AUTH_ROLE.FREELANCE;
  // Gestion du clic pour naviguer vers le profil freelancer
  const handleClick = (e) => {
    if (isFreelancer) {
      navigate(`${freelancersBasePath}/${user?.username}`);
    }
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage
          src={user?.avatar_url}
          alt={user?.username}
          title={user?.username}
        />
        <AvatarFallback>{fallbackName}</AvatarFallback>
      </Avatar>
      <Button
        variant="link"
        className={`p-0 flex flex-col gap-0 items-start ${!isFreelancer ? "pointer-events-none" : ""}`}
        onClick={handleClick}
      >
        <span>{user?.name}</span>
        <span className="text-gray-500">@{user?.username}</span>
      </Button>
    </div>
  );
}
