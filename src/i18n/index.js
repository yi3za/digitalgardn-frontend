import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr } from "./locales/fr";

// Definition des langues et leurs traductions
// resources : objet qui contiendra toutes les traductions pour chaque langue
const resources = { fr };

// Configuration de i18n pour React
i18n.use(initReactI18next).init({
  // Traductions
  resources,
  // Langue par defaut
  lng: "fr",
  // Echape le texte
  interpolation: { escapeValue: false },
});

// Export de l'instance i18next initialisee
export default i18n;
