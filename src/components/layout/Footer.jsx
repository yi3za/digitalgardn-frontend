import { useTranslation } from "react-i18next";

/**
 * Composant Footer
 */
export function Footer() {
  // Hook pour la traduction
  const { t } = useTranslation("sections");
  return (
    <footer className="h-20 flex justify-center items-center">
      {t("footer.copyright")} DigitalGarden — {t("footer.built_with")}
    </footer>
  );
}
