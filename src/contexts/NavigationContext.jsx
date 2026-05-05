import { createContext, useContext } from "react";

// Valeurs par defaut (contexte public)
const defaultPaths = {
  freelancers: "/freelancers",
  services: "/services",
  categories: "/categories",
  competences: "/competences",
  isAdmin: false,
};

// Valeurs pour le contexte dashboard freelance
export const DASHBOARD_PATHS = {
  freelancers: "/freelancers",
  services: "/dashboard/services",
  categories: "/categories",
  competences: "/competences",
  isAdmin: false,
};

// Valeurs pour le contexte admin
export const ADMIN_PATHS = {
  freelancers: "/admin/freelancers",
  services: "/admin/services",
  categories: "/admin/categories",
  competences: "/admin/competences",
  isAdmin: true,
};

/**
 * Creation du contexte de navigation avec les chemins par defaut
 */
export const NavigationContext = createContext(defaultPaths);

/**
 * Hook pour consommer les base paths dans n'importe quel composant
 */
export function useNavigationPaths() {
  return useContext(NavigationContext);
}
