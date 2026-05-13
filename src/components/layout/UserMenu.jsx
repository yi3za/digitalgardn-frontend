import {
  ArrowLeftRight,
  Home,
  LayoutDashboard,
  LogOutIcon,
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
import { ACCOUNT_STATUS, AUTH_ROLE } from "@/features/auth/auth.constants";
import { disconnectEcho } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import { resetNotifications } from "@/features/notifications/notificationsSlice";

// Couleurs des badges de statut utilisateur
const USER_STATUS_BADGE_COLORS = {
  [ACCOUNT_STATUS.ACTIF]: "bg-green-500",
  [ACCOUNT_STATUS.INACTIF]: "bg-yellow-500",
  [ACCOUNT_STATUS.BANNI]: "bg-red-500",
};

/**
 * Composant affichant le menu utilisateur
 */
export function UserMenu({ user, t, dashboard }) {
  // Recupere queryClient
  const queryClient = useQueryClient();
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
      // Initial le count de les commandes a 0
      dispatch(resetNotifications());
      // Netoyage le cache des donnees
      queryClient.clear();
      // Deconnecter Echo pour fermer la connexion websocket en temps reel
      disconnectEcho();
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
          <AvatarBadge className={USER_STATUS_BADGE_COLORS[user?.status]} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canAccessDashboard && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("user_menu.navigation")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={dashboard ? "/" : "/dashboard"}>
                {dashboard ? <Home /> : <LayoutDashboard />}
                {t(`user_menu.${dashboard ? "accueil" : "dashboard"}`)}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("user_menu.finances")}</DropdownMenuLabel>
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
