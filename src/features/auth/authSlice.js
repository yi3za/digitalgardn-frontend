import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./auth.constants";
import {
  sendResetCodeThunk,
  getMeThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  resetPasswordThunk,
} from "./auth.thunks";

/**
 * Etat initial du slice d'authentification
 *
 * user : informations de l'utilisateur connecte
 * status : etat actuel de l'authentification
 * loading : indique si une requete est en cours
 * error : contient le message d'erreur en cas d'echec
 */
const initialState = {
  user: null,
  status: AUTH_STATUS.IDLE,
  loading: false,
  error: null,
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
        state.error = null;
        state.loading = true;
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.error = payload;
        state.loading = false;
      });
    // loginThunk
    builder
      .addCase(loginThunk.pending, (state) => {
        state.user = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.error = payload;
        state.loading = false;
      });
    // getMeThunk
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.user = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.loading = false;
      })
      .addCase(getMeThunk.rejected, (state, { payload }) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.error = payload;
        state.loading = false;
      });
    // logoutThunk
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.loading = false;
      })
      .addCase(logoutThunk.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      });
    // sendResetCodeThunk
    builder
      .addCase(sendResetCodeThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(sendResetCodeThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendResetCodeThunk.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      });
    // resetPasswordThunk
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      });
  },
});

// Export du reducer du slice d'authentification
export const authReducer = authSlice.reducer;
