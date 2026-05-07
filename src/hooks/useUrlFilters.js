import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook pour synchroniser les filtres d'une page avec les parametres de l'URL
 */
export function useUrlFilters({ keys = ["search"] } = {}) {
  // Etat de la page pour la pagination
  const [page, setPage] = useState(1);
  // Utilisation du hook de react-router pour acceder et modifier les parametres de l'URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Stringifie les params pour le useEffect
  const searchParamsString = searchParams.toString();
  // Fonction pour extraire les filtres depuis les parametres de l'URL
  const getFilters = () =>
    Object.fromEntries(
      keys
        .map((key) => [key, searchParams.get(key)])
        .filter(([, value]) => value),
    );
  // Etat local des filtres, initialise depuis l'URL
  const [filters, setFilters] = useState(getFilters);
  useEffect(() => {
    setFilters(getFilters());
    // Notifie le parent que les filtres ont change (utile pour reset la pagination)
    setPage(1);
  }, [searchParamsString]);
  // Handler d'application des filtres
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setSearchParams(newFilters);
    setPage(1);
  };

  return [filters, handleApplyFilters, page, setPage];
}
