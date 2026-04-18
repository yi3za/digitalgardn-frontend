import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { UserMenu } from "./UserMenu";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "./AuthButtons";
import { Logo } from "./logo";

/**
 * Composant Header
 */
export function Header({ dashboard = false }) {
  // Hook pour la traduction
  const { t } = useTranslation(["sections", "codes"]);
  // Recuperer l'utilisateur et le statut d'authentification
  const { user, status } = useSelector(authSelector);

  return (
    <header className="flex justify-between items-center py-4 border-b mb-10">
      {/* logo */}
      <Logo />
      {/* navigation */}
      <NavigationMenu className="min-w-1/2">
        <NavigationMenuList>
          {!dashboard ? (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/">{t("header.home")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/dashboard">{t("header.dashboard")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
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
                        <Link to="/dashboard/messages">
                          {t("header.messages")}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      {/* user actions */}
      <div className="flex justify-end items-center gap-4 min-w-1/4">
        {status === AUTH_STATUS.AUTHENTICATED ? (
          <UserMenu user={user} t={t} />
        ) : (
          <AuthButtons t={t} />
        )}
      </div>
    </header>
  );
}
