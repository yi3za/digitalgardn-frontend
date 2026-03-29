import { client } from "@/api/client";

// Recupere le cookie CSRF
export const getCsrfCookie = () => client.get("/sanctum/csrf-cookie");
// Enregistrement d'un nouvel utilisateur
export const register = (data) => client.post("/api/auth/register", data);
// Connexion de l'utilisateur
export const login = (data) => client.post("/api/auth/login", data);
// Recupere les informations de l'utilisateur authentifie
export const getMe = () => client.get("/api/me");
// Deconnexion de l'utilisateur
export const logout = () => client.post("/api/me/logout");
// Demander le code de reinitialisation le mot de passe
export const sendResetCode = (data) => client.post("/api/auth/forget-password", data);
// Reinitialiser le mot de passe avec le code
export const resetPassword = (data) => client.post("/api/auth/reset-password", data);
// Upload l'avatar de l'utilisateur
export const uploadAvatar = (data) =>
  client.post("/api/me/upload-avatar", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
// Mettre a jour les informations de l'utilisateur 
export const updateInfo = (data) => client.patch("/api/me", data);
// Changer le mot de passe de l'utilisateur
export const changePassword = (data) => client.post("/api/me/change-password", data);
// Activer le compte utilisateur
export const activateAccount = () => client.patch("/api/me/activate-account");
// Desactiver le compte utilisateur
export const deactivateAccount = () => client.patch("/api/me/deactivate-account");
// Supprimer le compte utilisateur
export const deleteAccount = () => client.delete("/api/me");