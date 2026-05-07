import { Navigate, useParams } from "react-router-dom";

/**
 * Page de redirection d'une langue vers la liste des services filtree
 */
export function LangueShowPage() {
  // Recuperation du slug de la langue depuis les params d'URL
  const { slug } = useParams();

  return <Navigate to={`/services?langue=${slug}`} replace />;
}
