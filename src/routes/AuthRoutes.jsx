import { Route } from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AuthLayout } from "@/components/layout/AuthLayout";

/**
 * Definit les routes liees à l'authentification
 */
export function AuthRoutes() {
  // Route principale pour l'authentification utilisant le layout AuthLayout
  return (
    <Route element={<AuthLayout />}>
      {/* Route pour la page de connexion */}
      <Route path="login" element={<LoginPage />} />
    </Route>
  );
}
