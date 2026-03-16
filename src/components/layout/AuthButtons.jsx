import { Link } from "react-router-dom";
import { Button } from "../ui";

/**
 * Composant qui affiche les boutons de connexion et d'inscription
 */
export function AuthButtons({ t }) {
  return (
    <>
      <Button asChild variant="link">
        <Link to="/login">{t("header.login")}</Link>
      </Button>
      <Button asChild>
        <Link to="/register">{t("header.register")}</Link>
      </Button>
    </>
  );
}
