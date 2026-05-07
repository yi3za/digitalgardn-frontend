import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";

/**
 * Composant MainLayout
 *
 * Ce composant sert de layout principal pour les pages du site
 */
export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main */}
      <main className="container mx-auto flex flex-col flex-1 gap-2 py-20">
        {/* Outlet rend le composant correspondant a la route enfant */}
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
