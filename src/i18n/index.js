import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr } from "./locales/fr";
import { getLanguage, saveLanguage } from "@/lib/storage";

// Ressources de traduction disponibles
const resources = { fr };

// Recuperer la langue sauvegardee ou utiliser le defaut
const initialLanguage = getLanguage();

// Initialiser i18next avec la langue active
i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  interpolation: { escapeValue: false },
});

// Sauvegarder automatiquement la langue a chaque changement
i18n.on("languageChanged", (language) => {
  saveLanguage(language);
});

export default i18n;
