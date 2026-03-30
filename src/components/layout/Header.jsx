import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { UserMenu } from "./UserMenu";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "./AuthButtons";

/**
 * Composant Header
 */
export function Header() {
  // Hook pour la traduction
  const { t } = useTranslation(["sections", "codes"]);
  // Recuperer l'utilisateur et le statut d'authentification
  const { user, status } = useSelector(authSelector);
  return (
    <header className="flex justify-between items-center py-4">
      {/* logo */}
      <Link to="/" className="text-xl font-medium min-w-1/4">
        Digital<span className="text-primary">Gardn</span>
      </Link>
      {/* navigation */}
      <NavigationMenu className="min-w-1/2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/">{t("header.home")}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
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
