import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";

/**
 * Configuration du store Redux principal de l'application
 *
 * auth : gere la partie authentification du state global
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
