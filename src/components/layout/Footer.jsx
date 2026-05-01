import { APP_NAME } from "@/lib/config";
import { useTranslation } from "react-i18next";

/**
 * Composant Footer
 */
export function Footer() {
  // Hook pour la traduction
  const { t } = useTranslation("layout");
  return (
    <footer className="h-20 flex justify-center items-center">
      {t("footer.copyright")} {APP_NAME} — {t("footer.built_with")}
    </footer>
  );
}
