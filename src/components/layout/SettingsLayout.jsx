import { Card } from "@/components/ui";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_ROLE } from "@/features/auth/auth.constants";

/**
 *  Layout racine des pages de parametres
 *  Fournit isAdmin, user et loading aux pages enfants via useOutletContext()
 *  Encapsule les pages dans une Card commune
 */
export function SettingsLayout() {
  const { user, loading } = useSelector(authSelector);
  const isAdmin = user?.role === AUTH_ROLE.ADMIN;

  return (
    <Card className="shadow-none border-none">
      <Outlet context={{ isAdmin, user, loading }} />
    </Card>
  );
}
