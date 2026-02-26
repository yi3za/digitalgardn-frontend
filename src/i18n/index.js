import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Definition des langues et leurs traductions
// resources : objet qui contiendra toutes les traductions pour chaque langue
const resources = {};

// Configuration de i18n pour React
i18n.use(initReactI18next).init({
  // Traductions
  resources,
  // Langue par defaut
  lng: "fr",
  // Echape le texte
  interpolation: { escapeValue: false },
});
