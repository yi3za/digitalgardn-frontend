import { normalizeError } from "@/features/auth/auth.utils";
import i18n from "@/i18n";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Assigne les erreurs serveur à chaque champ dans react-hook-form
 * shouldFocus : applique automatiquement le focus sur le champ qui contient une erreur
 */
export function setServerErrors(errors, setError) {
  const errorsArray = Object.entries(errors ?? {});
  if (errorsArray.length === 0) return;
  const firstElement = errorsArray[0][0];
  errorsArray.forEach(([field, message]) => {
    setError(
      field,
      { type: "server", message: message[0] },
      { shouldFocus: field === firstElement },
    );
  });
}

/**
 * Formate une date en affichant le mois et l'annee dans la langue courante de l'application
 *
 * Utilise l'API Intl.DateTimeFormat pour le formatage de la date
 *
 * i18n.language : langue courante de l'application pour le formatage de la date
 * month: "long" : affiche le nom complet du mois
 * year: "numeric" : affiche l'annee en chiffres
 */
export const formatDate = (date) =>
  !date
    ? null
    : new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
      }).format(new Date(date));

/**
 * Genere une nom fallback a partit du parametre name
 *
 * Exemple : "yaaza aitbah" => "YZ"
 */
export const getFallbackName = (name) =>
  !name
    ? null
    : name
        .split(" ")
        .map((w) => (w.trim() ? w[0].toUpperCase() : ""))
        .join("");

/**
 * Creer un thunk pour une fonction API
 *
 * type : type du thunk
 * apiFn : fonction API a executer
 * Retourne le resultat de la fonction API en cas de succes
 * Retourne une erreur normalisee en cas d'echec
 */
export const createApiThunk = (type, apiFn) =>
  createAsyncThunk(type, async (_data, { rejectWithValue }) => {
    try {
      const response = await apiFn(_data);
      const { data } = response ?? {};
      return data;
    } catch ({ response }) {
      const normalisedError = normalizeError(response);
      return rejectWithValue(normalisedError);
    }
  });

/**
 * Met en majuscule la premiere lettre d'une chaine de caracteres.
 * Exemple: "hello" → "Hello"
 */
export const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
