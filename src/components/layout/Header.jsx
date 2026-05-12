import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { UserMenu } from "./UserMenu";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "./AuthButtons";
import { Logo } from "./logo";
import { BackButton } from "@/components/shared/BackButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Navbar } from "./Navbar";

/**
 * Composant Header
 */
export function Header({ dashboard = false }) {
  // Hook pour la traduction
  const { t } = useTranslation(["layout", "codes"]);
  // Hook pour location
  const location = useLocation();
  // Recuperer l'utilisateur et le statut d'authentification
  const { user, status } = useSelector(authSelector);
  // Determiner si on affiche le bouton de retour
  const showBackButton = location.pathname !== "/";
  // Determiner si l'utilisateur est authentifie
  const isAuthenticated = status === AUTH_STATUS.AUTHENTICATED;

  return (
    <header className="flex justify-between items-center p-4 sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center gap-2 flex-1">
        {showBackButton && <BackButton />}
        <Logo />
      </div>
      <Navbar
        className="flex-1 hidden md:flex"
        dashboard={dashboard}
        t={t}
        isAuthenticated={isAuthenticated}
      />
      <div className="flex justify-end items-center gap-4 flex-1">
        <ThemeToggle />
        <LanguageToggle />
        {isAuthenticated ? (
          <UserMenu user={user} t={t} dashboard={dashboard} />
        ) : (
          <AuthButtons t={t} />
        )}
      </div>
    </header>
  );
}
