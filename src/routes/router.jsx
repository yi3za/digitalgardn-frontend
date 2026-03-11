import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { HomePage } from "@/pages/HomePage";

/**
 * Creation du routeur principal de l'application
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  authRoutes,
]);
