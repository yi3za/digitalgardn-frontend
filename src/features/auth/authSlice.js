import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./auth.constants";
import { getMeThunk, loginThunk, registerThunk } from "./auth.thunks";

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
  errors: null,
};

/**
 * Slice pour la gestion de l'authentification
 *
 * name : nom du slice dans le store global
 * initialState : etat initial defini ci-dessus
 * extraReducers : permet de gerer les actions asynchrones
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // registerThunk
    builder
      .addCase(registerThunk.pending, (state) => {
        state.user = null;
        state.status = AUTH_STATUS.LOADING;
        state.checked = false;
        state.errors = null;
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.checked = true;
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.checked = true;
        state.errors = payload;
      });
    // loginThunk
    builder
      .addCase(loginThunk.pending, (state) => {
        state.user = null;
        state.status = AUTH_STATUS.LOADING;
        state.checked = false;
        state.errors = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.checked = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.checked = true;
        state.errors = payload;
      });
    // getMeThunk
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.user = null;
        state.status = AUTH_STATUS.LOADING;
        state.checked = false;
        state.errors = null;
      })
      .addCase(getMeThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.checked = true;
      })
      .addCase(getMeThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.checked = true;
        state.errors = payload;
      });
  },
});

// Export du reducer du slice d'authentification
export const authReducer = authSlice.reducer;
