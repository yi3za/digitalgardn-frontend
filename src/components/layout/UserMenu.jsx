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
  Spinner,
} from "../ui";
import { logoutThunk } from "@/features/auth/auth.thunks";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";

/**
 * Composant affichant le menu utilisateur
 */
export function UserMenu({ user, t }) {
  // Etat de store indiquant si une requete auth est en cours
  const { loading } = useSelector(authSelector);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  /**
   * Fonction de deconnexion de l'utilisateur : dispatch de l'action logout
   */
  const logout = async () => {
    try {
      // Appeler le thunk de logout pour deconnecter l'utilisateur
      await dispatch(logoutThunk()).unwrap();
      // Afficher message de succes
      toast.success(t("auth:logout.toast.success"));
    } catch ({ code }) {
      // Afficher notification d'erreur en fonction du code retourne
      toast.error(t(`codes:${code}`));
    }
  };

  return loading.logout ? (
    <Spinner className="size-8" />
  ) : (
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
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOutIcon />
          {t("user_menu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
