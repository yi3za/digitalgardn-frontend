import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./auth.constants";

/**
 * Etat initial du slice d'authentification
 *
 * user : informations de l'utilisateur connecte
 * status : etat actuel de la requete d'authentification
 * checked : indique si la verification d'authentification a deja ete effectuee
 * error : contient le message d'erreur en cas d'echec
 */
const initialState = {
  user: null,
  status: AUTH_STATUS.IDLE,
  checked: false,
  error: null,
};

/**
 * Slice pour la gestion de l'authentification
 *
 * name : nom du slice dans le store global
 * initialState : etat initial defini ci-dessus
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
});

// Export du reducer du slice d'authentification
export const authReducer = authSlice.reducer;
