import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuItemCustom,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { UserMenu } from "./UserMenu";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "./AuthButtons";
import { Logo } from "./logo";
import { BackButton } from "@/components/shared/BackButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import {
  selectTotalUnreadMessages,
  selectUnreadCommandes,
} from "@/features/notifications/notifications.selectores";

/**
 * Composant Header
 */
export function Header({ dashboard = false }) {
  // Hook pour la traduction
  const { t } = useTranslation(["layout", "codes"]);
  // Hook pour location
  const location = useLocation();
  // Recuperer l'utilisateur et le statut d'authentification
  const { user, status } = useSelector(authSelector);
  // Determiner si on affiche le bouton de retour
  const showBackButton = location.pathname !== "/";
  // Recuperer le nombre total de messages non lus
  const totalUnreadMessages = useSelector(selectTotalUnreadMessages);
  // Recuperer le nombre de commandes non lues
  const unreadCommandes = useSelector(selectUnreadCommandes);

  return (
    <header className="flex justify-between items-center py-4 mb-10">
      <div className="flex items-center gap-2 min-w-1/4">
        {showBackButton && <BackButton />}
        {/* logo */}
        <Logo />
      </div>
      {/* navigation */}
      <NavigationMenu className="min-w-1/2">
        <NavigationMenuList>
          {!dashboard && (
            <NavigationMenuItemCustom content={t("header.home")} to="/" />
          )}
          {dashboard && (
            <>
              <NavigationMenuItemCustom
                content={t("header.dashboard")}
                to="/dashboard"
              />
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {t("header.myBusiness")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-96">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/dashboard/profil">{t("header.profil")}</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/dashboard/services">
                          {t("header.services")}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/dashboard/portefeuille">
                          {t("header.portefeuille")}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/dashboard/portefeuille/transactions">
                          {t("header.transactions")}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}
          {status === AUTH_STATUS.AUTHENTICATED && (
            <>
              <NavigationMenuItemCustom
                content={t("header.messages")}
                to={dashboard ? "/dashboard/messages" : "/messages"}
                badgeCount={totalUnreadMessages}
              />
              <NavigationMenuItemCustom
                content={t("header.commandes")}
                to={dashboard ? "/dashboard/commandes" : "/commandes"}
                badgeCount={unreadCommandes}
              />
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      {/* user actions */}
      <div className="flex justify-end items-center gap-4 min-w-1/4">
        <ThemeToggle />
        <LanguageToggle />
        {status === AUTH_STATUS.AUTHENTICATED ? (
          <UserMenu user={user} t={t} dashboard={dashboard} />
        ) : (
          <AuthButtons t={t} />
        )}
      </div>
    </header>
  );
}
