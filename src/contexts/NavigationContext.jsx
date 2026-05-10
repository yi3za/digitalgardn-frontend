import { createContext, useContext } from "react";

// Valeurs par defaut (contexte public)
const defaultPaths = {
  freelancers: "/freelancers",
  services: "/services",
  categories: "/categories",
  competences: "/competences",
  langues: "/langues",
  commandes: "/commandes",
  messages: "/messages",
  avis: "/avis",
  users: "/users",
  isAdmin: false,
};

// Valeurs pour le contexte dashboard freelance
export const DASHBOARD_PATHS = {
  freelancers: "/freelancers",
  services: "/dashboard/services",
  categories: "/categories",
  competences: "/competences",
  langues: "/langues",
  commandes: "/dashboard/commandes",
  messages: "/dashboard/messages",
  avis: "/dashboard/avis",
  users: "/dashboard/users",
  isAdmin: false,
};

// Valeurs pour le contexte admin
export const ADMIN_PATHS = {
  freelancers: "/admin/freelancers",
  services: "/admin/services",
  categories: "/admin/categories",
  competences: "/admin/competences",
  langues: "/admin/langues",
  commandes: "/admin/commandes",
  messages: "/admin/messages",
  avis: "/admin/avis",
  users: "/admin/users",
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
