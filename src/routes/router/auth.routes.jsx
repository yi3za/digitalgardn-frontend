import { LoginPage } from "@/pages/auth/LoginPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { PasswordResetPage } from "@/pages/auth/PasswordResetPage";

/**
 * Definit les routes liees à l'authentification
 *
 * AuthLayout : layout commun pour toutes les pages d'authentification
 */
export const authRoutes = {
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
    { path: "password-reset", element: <PasswordResetPage /> },
  ],
};
