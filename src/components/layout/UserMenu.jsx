import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
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
import { Link } from "react-router-dom";
import { getFallbackName } from "@/lib/utils";

/**
 * Composant affichant le menu utilisateur
 */
export function UserMenu({ user, t }) {
  // Etat de store indiquant si une requete auth est en cours
  const { loading } = useSelector(authSelector);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'utilisateur
  const avatarFallback = getFallbackName(user?.name);
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
        <Avatar size="lg" className="cursor-pointer overflow-visible">
          <AvatarImage
            src={user?.avatar_url}
            alt={user?.username}
            title={user?.username}
            className="rounded-full"
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("user_menu.label")}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/profil">
            <UserIcon />
            {t("user_menu.profil")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <SettingsIcon />
            {t("user_menu.settings")}
          </Link>
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
