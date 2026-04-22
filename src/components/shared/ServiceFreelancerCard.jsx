import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn, getFallbackName } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Carte des informations du freelance lie a un service avec lien vers son profil public
 */
export function ServiceFreelancerCard({
  user,
  t,
  titleKey = "catalog:serviceShow.freelancerSection",
  descriptionKey = "catalog:serviceShow.freelancerSectionDescription",
}) {
  if (!user) return null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t(titleKey)}</CardTitle>
        <CardDescription>{t(descriptionKey)}</CardDescription>
        <CardAction>
          <Button asChild variant="link">
            <Link to={`/freelancers/${user.username}`}>
              <UserRound /> {t("catalog:serviceShow.viewFreelancer")}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>
              {getFallbackName(user.name || user.username) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className={cn("min-w-0")}>
            <p className="font-medium truncate">{user.name || user.username}</p>
            <p className="text-sm text-muted-foreground truncate">
              @{user.username}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
