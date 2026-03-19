import { ItemsSection } from "@/components/sections/ItemsSection";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useSelector } from "react-redux";

/**
 * Page d'accueil de l'application avec message de bienvenue
 * Affiche "(authentifie)" si l'utilisateur est connecte
 */
export function HomePage() {
  const { status } = useSelector(authSelector);
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  return (
    <>
      <p className="text-center p-5 bg-green-500 text-white">
        Bienvenue sur DigitalGardn Une plateforme qui connecte les clients et
        les freelances.
        {status === AUTH_STATUS.AUTHENTICATED && (
          <span className="mx-3">(authentifie)</span>
        )}
      </p>
      <ItemsSection itemsQuery={categoriesQuery} name="categories" />
      <ItemsSection itemsQuery={competencesQuery} name="competences" />
    </>
  );
}
