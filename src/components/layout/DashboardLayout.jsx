import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  DASHBOARD_PATHS,
  NavigationContext,
} from "@/contexts/NavigationContext";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout du dashboard Freelance
 *
 * Ce composant sert de couche de protection pour toutes les routes du dashboard freelance.
 */
export function DashboardLayout() {
  // Recuperation l'utilisateur
  const { user } = useSelector(authSelector);
  // Verification le role
  if (user.role !== AUTH_ROLE.FREELANCE) return <Navigate to="/" replace />;

  return (
    <NavigationContext.Provider value={DASHBOARD_PATHS}>
      <div className="flex flex-col min-h-screen">
        <Header dashboard />
        <main className="container mx-auto flex flex-col flex-1 gap-2 py-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
}
