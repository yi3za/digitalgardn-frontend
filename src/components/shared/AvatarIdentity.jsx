import { getFallbackName } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, Button } from "../ui";
import { Link } from "react-router-dom";

/**
 * Affiche l'avatar d'un utilisateur
 */
export function AvatarIdentity({ user }) {
  // Genere un nom fallback
  const fallbackName = getFallbackName(user?.name);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="cursor-pointer">
        <AvatarImage
          src={user?.avatar_url}
          alt={user?.username}
          title={user?.username}
        />
        <AvatarFallback>{fallbackName}</AvatarFallback>
      </Avatar>
      <Button
        asChild
        variant="link"
        className="p-0 flex flex-col gap-0 items-start"
      >
        <Link to={`/freelancers/${user?.username}`}>
          <span>{user?.name}</span>
          <span className="text-gray-500">@{user?.username}</span>
        </Link>
      </Button>
    </div>
  );
}
