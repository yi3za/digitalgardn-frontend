import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";

/**
 * Composant affichant le menu utilisateur
 */
export function UserMenu({ user, t }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatar_url} alt={user.username} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((w) => w[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("user_menu.label")}</DropdownMenuLabel>
        <DropdownMenuItem>
          <UserIcon />
          {t("user_menu.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          {t("user_menu.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          {t("user_menu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
