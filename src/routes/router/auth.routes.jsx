import { LoginPage } from "@/pages/auth/LoginPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { PasswordResetPage } from "@/pages/auth/PasswordResetPage";

/**
 * Definit les routes liees à l'authentification
 *
 * AuthLayout : layout commun pour toutes les pages d'authentification
 *
 * login : page de connexion
 * register : page d'inscription
 * password-reset : page de demande de reinitialisation du mot de passe
 */
export const authRoutes = {
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
    { path: "password-reset", element: <PasswordResetPage /> },
  ],
};
