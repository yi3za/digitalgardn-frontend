import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Composant ScrollToTop
 */
export function ScrollToTop() {
  // Hook pour la location
  const { pathname } = useLocation();
  // A chaque changement de route, on scroll en haut de la page
  useEffect(() => {
    // Si on est deja en haut de la page, on ne fait rien
    if (window.scrollY === 0) return;
    // Sinon, on scroll en haut de la page avec une animation fluide
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}
