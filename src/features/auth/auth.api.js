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
