/**
 * Utilitaires centraux pour gerer les preferences dans localStorage
 */

// Sauvegarder la langue selectionnee
export function saveLanguage(lang) {
  localStorage.setItem("selectedLanguage", lang);
}

// Recuperer la langue sauvegardee (defaut : fr)
export function getLanguage() {
  return localStorage.getItem("selectedLanguage") || "fr";
}
