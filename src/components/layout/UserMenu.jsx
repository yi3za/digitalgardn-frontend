import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOutIcon,
  MessageCircle,
  SettingsIcon,
  UserIcon,
  Wallet,
} from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { AUTH_ROLE } from "@/features/auth/auth.constants";

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
  // Le dashboard n'est accessible qu'aux freelances ayant termine leur onboarding
  const canAccessDashboard =
    user?.role === AUTH_ROLE.FREELANCE && user?.onboarding_termine;
  /**
   * Fonction de deconnexion de l'utilisateur : dispatch de l'action logout
   */
  const logout = async () => {
    try {
      // Appeler le thunk de logout pour deconnecter l'utilisateur
      const { code } = await dispatch(logoutThunk()).unwrap();
      // Afficher message de succes
      toast.success(t(`codes:${code}`));
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
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("user_menu.navigation")}</DropdownMenuLabel>
          {canAccessDashboard && (
            <DropdownMenuItem asChild>
              <Link to="/dashboard">
                <LayoutDashboard />
                {t("user_menu.dashboard")}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/messages">
              <MessageCircle />
              {t("user_menu.messages")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/portefeuille">
              <Wallet />
              {t("user_menu.portefeuille")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/portefeuille/transactions">
              <ArrowLeftRight />
              {t("user_menu.transactions")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("user_menu.account")}</DropdownMenuLabel>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("user_menu.session")}</DropdownMenuLabel>
          <DropdownMenuItem variant="destructive" onClick={logout}>
            <LogOutIcon />
            {t("user_menu.logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
