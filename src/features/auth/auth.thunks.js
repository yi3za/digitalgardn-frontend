import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCsrfCookie,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  sendResetCode,
  uploadAvatar,
} from "./auth.api";
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
      const { user } = response?.data?.details ?? {};
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
      const { user } = response?.data?.details ?? {};
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
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMe();
      const { user } = response?.data?.details ?? {};
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
      const response = await logout();
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la demande du code de reinitialisationde du mot de passe
 *
 * Envoie l'email de l'utilisateur au backend
 * Le backend genere un code de verification et l'envoie par email
 * Retourne une reponse succes si le code est envoye
 * Retourne une erreur normalisee en cas d'echec
 */
export const sendResetCodeThunk = createAsyncThunk(
  "auth/sendResetCode",
  async (_data, { rejectWithValue }) => {
    try {
      await getCsrfCookie();
      const response = await sendResetCode(_data);
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la reinitialisation du mot de passe
 *
 * Envoie l'email, le code de verification et le nouveau mot de passe au backend
 * Le backend met a jour le mot de passe si le code est valide
 * Retourne une reponse succes si le code est envoye
 * Retourne une erreur normalisee en cas d'echec
 */
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(_data);
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de l'upload de l'avatar de l'utilisateur
 *
 * Envoie le fichier de l'avatar au backend
 * Le backend stocke le fichier et met a jour l'URL de l'avatar de l'utilisateur
 * Retourne l'utilisateur mis a jour en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const uploadAvatarThunk = createAsyncThunk(
  "auth/uploadAvatar",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await uploadAvatar(_data);
      const { user } = response?.data?.details ?? {};
      return user;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);
