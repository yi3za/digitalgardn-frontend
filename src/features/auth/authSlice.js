import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./auth.constants";
import { withLoadingAndError } from "./auth.matchers";
import {
  activateAccountThunk,
  completeOnboardingThunk,
  deactivateAccountThunk,
  deleteAccountThunk,
  getMeThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  switchToFreelanceThunk,
  updateInfoThunk,
  uploadAvatarThunk,
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
  loading: {},
  error: {},
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
    // Gestion de l'inscription de l'utilisateur
    builder
      .addCase(
        registerThunk.fulfilled,
        (state, { payload: { details: { user } } }) => {
          state.user = user;
          state.status = AUTH_STATUS.AUTHENTICATED;
        },
      )
      .addCase(registerThunk.rejected, (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
      });
    // Gestion de la connexion de l'utilisateur
    builder
      .addCase(
        loginThunk.fulfilled,
        (state, { payload: { details: { user } } }) => {
          state.user = user;
          state.status = AUTH_STATUS.AUTHENTICATED;
        },
      )
      .addCase(loginThunk.rejected, (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
      });
    // Gestion de la deconnexion de l'utilisateur
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    });
    // Gestion de la recuperation de l'utilisateur authentifie
    builder
      .addCase(
        getMeThunk.fulfilled,
        (state, { payload: { details: { user } } }) => {
          state.user = user;
          state.status = AUTH_STATUS.AUTHENTICATED;
        },
      )
      .addCase(getMeThunk.rejected, (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
      });
    // Gestion de l'upload de l'avatar de l'utilisateur
    builder.addCase(
      uploadAvatarThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion de la mise a jour des informations de l'utilisateur
    builder.addCase(
      updateInfoThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion de la finalisation de l'onboarding utilisateur
    builder.addCase(
      completeOnboardingThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion du changement de role vers freelance
    builder.addCase(
      switchToFreelanceThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion de la mise a jour du profil freelance de l'utilisateur
    builder.addCase(
      updateFreelanceProfilThunk.fulfilled,
      (state, { payload: { details: { profil } } }) => {
        state.user.profil = profil;
      },
    );
    // Gestion de l'activation du compte de l'utilisateur
    builder.addCase(
      activateAccountThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion de la desactivation du compte de l'utilisateur
    builder.addCase(
      deactivateAccountThunk.fulfilled,
      (state, { payload: { details: { user } } }) => {
        state.user = user;
      },
    );
    // Gestion de la suppression du compte de l'utilisateur
    builder.addCase(deleteAccountThunk.fulfilled, (state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    });
    // Ajout des matchers pour gerer les etats de chargement et d'erreur de toutes les actions du slice
    withLoadingAndError(builder);
  },
});

// Export du reducer du slice d'authentification
export const authReducer = authSlice.reducer;
