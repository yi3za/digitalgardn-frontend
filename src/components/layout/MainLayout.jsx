import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";

/**
 * Composant MainLayout
 *
 * Layout principal de l'application
 */
export function MainLayout() {
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
