import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";

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
        {/* login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
