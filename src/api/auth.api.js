import { api } from "./client";

// Recupere le cookie CSRF
export const getCsrfCookie = () => api.get("/sanctum/csrf-cookie");
// Enregistrement d'un nouvel utilisateur
export const register = (data) => api.post("/api/auth/register", data);
// Connexion de l'utilisateur
export const login = (data) => api.post("/api/auth/login", data);
// Recupere les informations de l'utilisateur authentifie
export const getMe = () => api.get("/api/me");
// Deconnexion de l'utilisateur
export const logout = () => api.post("/api/me/logout");
