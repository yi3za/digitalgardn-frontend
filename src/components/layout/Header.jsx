import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
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
import { ArrowLeft } from "lucide-react";

/**
 * Composant Header
 */
export function Header({ dashboard = false }) {
  // Hook pour la traduction
  const { t } = useTranslation(["layout", "codes"]);
  const location = useLocation();
  const navigate = useNavigate();
  // Recuperer l'utilisateur et le statut d'authentification
  const { user, status } = useSelector(authSelector);
  const showBackButton = location.pathname !== "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <header className="flex justify-between items-center py-4 mb-10 relative">
      <div className="flex items-center gap-2 min-w-1/4">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft />
          </Button>
        )}
        {/* logo */}
        <Logo />
      </div>
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
