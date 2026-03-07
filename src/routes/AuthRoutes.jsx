import { Route } from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { PasswordResetPage } from "@/pages/auth/PasswordResetPage";

/**
 * Definit les routes liees à l'authentification
 */
export function AuthRoutes() {
  // Route principale pour l'authentification utilisant le layout AuthLayout
  return (
    <Route element={<AuthLayout />}>
      {/* Route pour la page de connexion */}
      <Route path="login" element={<LoginPage />} />
      {/* Route pour la page d'inscription */}
      <Route path="register" element={<RegisterPage />} />
      {/* Route pour la page de demande de reinitialisation du mot de passe */}
      <Route path="password-reset" element={<PasswordResetPage />} />
    </Route>
  );
}
