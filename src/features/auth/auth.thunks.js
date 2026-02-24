import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCsrfCookie, login, register } from "./auth.api";
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
