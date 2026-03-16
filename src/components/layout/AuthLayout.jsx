import { Outlet } from "react-router-dom";
import { Card } from "../ui";

/**
 * Composant AuthLayout
 *
 * Ce layout est utilise pour les pages d'authentification
 */
export function AuthLayout() {
  return (
    <div className="flex justify-center items-center flex-1">
      {/* Card */}
      <Card className="w-xl">
        {/* Outlet rend le composant correspondant a la route enfant */}
        <Outlet />
      </Card>
    </div>
  );
}
