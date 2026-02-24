import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCsrfCookie, getMe, login, logout, register } from "./auth.api";
import { normalizeError } from "./auth.utils";

/**
 * Thunk responsable de l'inscription utilisateur
 *
 * Recupere le cookie CSRF
 * Envoie les donnees au backend
 * Retourne l'utilisateur en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      await getCsrfCookie();
      const response = await register(data);
      const { user } = response?.data ?? {};
      return user;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la connexion de l'utilisateur
 *
 * Recupere le cookie CSRF
 * Envoie les donnees au backend
 * Retourne l'utilisateur en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      await getCsrfCookie();
      const response = await login(data);
      const { user } = response?.data ?? {};
      return user;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la recuperation de l'utilisateur authentifie
 *
 * Recupere les informations de l'utilisateur actuellement connecte
 * Verifie la validite de la session cote backend
 * Retourne l'utilisateur en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const getMeThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMe();
      const { user } = response?.data ?? {};
      return user;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la deconnexion utilisateur
 *
 * Appelle l'API de logout
 * Retourne une erreur normalisee en cas d'echec
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);
