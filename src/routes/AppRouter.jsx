import { BrowserRouter, Routes } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";

/**
 * Composant responsable de la configuration du routage global
 *
 * - Enveloppe l'application avec BrowserRouter
 * - Definit les differentes routes disponibles
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Injection des routes d'authentification */}
        {AuthRoutes()}
      </Routes>
    </BrowserRouter>
  );
}
