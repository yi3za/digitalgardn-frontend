import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

/**
 * Bouton retour : navigue en arriere
 */
export function BackButton({ fallback = "/", className }) {
  const navigate = useNavigate();
  // Gerer le clic : si l'historique permet de revenir en arriere, le faire, sinon rediriger vers une page de fallback (ex: accueil)
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft />
    </Button>
  );
}
