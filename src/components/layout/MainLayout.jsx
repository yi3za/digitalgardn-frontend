import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";

/**
 * Composant MainLayout
 *
 * Layout principal de l'application
 */
export function MainLayout() {
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Abonnements en temps reel
  useRealtimeSubscriptions(user?.id);

  return (
    <div className="container mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main */}
      <main className="flex flex-col flex-1">
        {/* Outlet rend le composant correspondant a la route enfant */}
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
