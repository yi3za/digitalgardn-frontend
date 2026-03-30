import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  activateAccount,
  deactivateAccount,
  deleteAccount,
  changePassword,
  getCsrfCookie,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  sendResetCode,
  updateInfo,
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
  async (_data, { rejectWithValue }) => {
    try {
      await getCsrfCookie();
      const response = await register(_data);
      const { data } = response ?? {};
      return data;
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
  async (_data, { rejectWithValue }) => {
    try {
      await getCsrfCookie();
      const response = await login(_data);
      const { data } = response ?? {};
      return data;
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
      const { data } = response ?? {};
      return data;
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
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la mise a jour des informations de l'utilisateur
 *
 * Envoie les nouvelles informations de l'utilisateur au backend
 * Le backend met a jour les informations de l'utilisateur
 * Retourne l'utilisateur mis a jour en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const updateInfoThunk = createAsyncThunk(
  "auth/updateInfo",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await updateInfo(_data);
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable du changement de mot de passe de l'utilisateur
 *
 * Envoie l'ancien mot de passe et le nouveau mot de passe au backend
 * Le backend verifie l'ancien mot de passe et met a jour le mot de passe si la verification reussit
 * Retourne une reponse succes en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await changePassword(_data);
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de l'activation du compte utilisateur
 *
 * Appelle l'API d'activation du compte
 * Retourne une reponse succes en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const activateAccountThunk = createAsyncThunk(
  "auth/activateAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await activateAccount();
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la desactivation du compte utilisateur
 *
 * Appelle l'API de desactivation du compte
 * Retourne une reponse succes en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const deactivateAccountThunk = createAsyncThunk(
  "auth/deactivateAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deactivateAccount();
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);

/**
 * Thunk responsable de la suppression du compte utilisateur
 *
 * Appelle l'API de suppression du compte
 * Retourne une reponse succes en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const deleteAccountThunk = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteAccount();
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  },
);
