import axios from "axios";

/**
 * Creation d'une instance Axios configuree pour communiquer avec le backend
 */
export const api = axios.create({
  // URL de base du serveur backend
  baseURL: "http://localhost:8000",
  // Definition des en-tetes HTTP envoyes avec chaque requete
  headers: {
    // Indique que les reponses attendues sont au format JSON
    Accept: "application/json",
  },
  // Permet l'envoi automatique des cookies
  withCredentials: true,
  // Ajout automatiquement le token CSRF dans les requetes protegees
  withXSRFToken: true,
});
