import {
  NavigationMenu,
  NavigationMenuItemCustom,
  NavigationMenuItemsCustom,
  NavigationMenuList,
} from "../ui";
import {
  selectTotalUnreadMessages,
  selectUnreadCommandes,
} from "@/features/notifications/notifications.selectores";
import { useSelector } from "react-redux";

// Liens de navigation publics
export const publicLinks = [
  { key: "services", to: "/services" },
  { key: "categories", to: "/categories" },
  { key: "competences", to: "/competences" },
  { key: "langues", to: "/langues" },
];

// Liens de navigation pour mon business
const myBusinessLinks = [
  { key: "profil", to: "profil" },
  { key: "mesServices", to: "services" },
  { key: "portefeuille", to: "portefeuille" },
  { key: "transactions", to: "portefeuille/transactions" },
];

/**
 * Composant Navbar
 */
export function Navbar({ className, dashboard = false, t, isAuthenticated }) {
  // Recuperer le nombre total de messages non lus
  const totalUnreadMessages = useSelector(selectTotalUnreadMessages);
  // Recuperer le nombre de commandes non lues
  const unreadCommandes = useSelector(selectUnreadCommandes);

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {!dashboard && (
          <>
            <NavigationMenuItemCustom content={t("header.home")} to="/" />
            <NavigationMenuItemsCustom
              triggerLabel={t("header.catalog")}
              items={publicLinks.map((link) => ({
                label: t(`header.${link.key}`),
                to: link.to,
              }))}
            />
          </>
        )}
        {dashboard && (
          <>
            <NavigationMenuItemCustom
              content={t("header.dashboard")}
              to="/dashboard"
            />
            <NavigationMenuItemsCustom
              triggerLabel={t("header.myBusiness")}
              items={myBusinessLinks.map((link) => ({
                label: t(`header.${link.key}`),
                to: `/dashboard/${link.to}`,
              }))}
            />
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
