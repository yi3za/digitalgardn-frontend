import { client } from "@/api/client";

// Configuration des en-tetes pour les requetes JSON
const contentTypeJson = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Configuration des en-tetes pour les requetes multipart/form-data
const contentTypeMultipart = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

// Recupere le cookie CSRF
export const getCsrfCookie = () => client.get("/sanctum/csrf-cookie");
// Enregistrement d'un nouvel utilisateur
export const register = (data) =>
  client.post("/api/auth/register", data, contentTypeJson);
// Connexion de l'utilisateur
export const login = (data) =>
  client.post("/api/auth/login", data, contentTypeJson);
// Recupere les informations de l'utilisateur authentifie
export const getMe = () => client.get("/api/me");
// Deconnexion de l'utilisateur
export const logout = () => client.post("/api/me/logout");
// Demander le code de reinitialisation le mot de passe
export const sendResetCode = (data) =>
  client.post("/api/auth/forget-password", data, contentTypeJson);
// Reinitialiser le mot de passe avec le code
export const resetPassword = (data) =>
  client.post("/api/auth/reset-password", data, contentTypeJson);
// Upload l'avatar de l'utilisateur
export const uploadAvatar = (data) =>
  client.post("/api/me/upload-avatar", data, contentTypeMultipart);
// Mettre a jour les informations de l'utilisateur
export const updateInfo = (data) =>
  client.patch("/api/me", data, contentTypeJson);
// Changer le mot de passe de l'utilisateur
export const changePassword = (data) =>
  client.post("/api/me/change-password", data, contentTypeJson);
// Finalise l'onboarding de l'utilisateur
export const completeOnboarding = () =>
  client.patch("/api/me/complete-onboarding");
// Changer le role de l'utilisateur vers freelance
export const switchToFreelance = () =>
  client.patch("/api/me/switch-to-freelance");
// Mettre a jour le profil freelance de l'utilisateur
export const updateFreelanceProfil = (data) =>
  client.patch("/api/me/profil", data, contentTypeJson);
// Synchroniser les competences de l'utilisateur freelance
export const syncCompetences = (data) =>
  client.put("/api/me/competences", data, contentTypeJson);
// Activer le compte utilisateur
export const activateAccount = () => client.patch("/api/me/activate-account");
// Desactiver le compte utilisateur
export const deactivateAccount = () =>
  client.patch("/api/me/deactivate-account");
// Supprimer le compte utilisateur
export const deleteAccount = () => client.delete("/api/me");
