import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuItemCustom,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui";
import { Link } from "react-router-dom";
import {
  selectTotalUnreadMessages,
  selectUnreadCommandes,
} from "@/features/notifications/notifications.selectores";
import { useSelector } from "react-redux";

// Liens de navigation publics
export const publicLinks = [
  { key: "home", to: "/" },
  { key: "services", to: "/services" },
  { key: "categories", to: "/categories" },
  { key: "competences", to: "/competences" },
  { key: "langues", to: "/langues" },
];

// Liens de navigation pour mon business
const myBusinessLinks = [
  { key: "profil", to: "/dashboard/profil" },
  { key: "mesServices", to: "/dashboard/services" },
  { key: "portefeuille", to: "/dashboard/portefeuille" },
  { key: "transactions", to: "/dashboard/portefeuille/transactions" },
];

/**
 * Composant Navbar
 */
export function Navbar({ dashboard = false, t, isAuthenticated }) {
  // Recuperer le nombre total de messages non lus
  const totalUnreadMessages = useSelector(selectTotalUnreadMessages);
  // Recuperer le nombre de commandes non lues
  const unreadCommandes = useSelector(selectUnreadCommandes);

  return (
    <NavigationMenu className="min-w-1/2">
      <NavigationMenuList>
        {!dashboard && (
          <>
            {publicLinks.map((link) => (
              <NavigationMenuItemCustom
                key={link.key}
                content={t(`header.${link.key}`)}
                to={link.to}
              />
            ))}
          </>
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
                  {myBusinessLinks.map((link) => (
                    <li key={link.key}>
                      <NavigationMenuLink asChild>
                        <Link to={link.to}>{t(`header.${link.key}`)}</Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        )}
        {isAuthenticated && (
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
  );
}
