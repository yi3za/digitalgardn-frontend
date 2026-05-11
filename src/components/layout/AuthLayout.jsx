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
      <Card className="w-xl shadow-none">
        <Outlet />
      </Card>
    </div>
  );
}
