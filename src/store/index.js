import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/authSlice";
import { notificationsReducer } from "@/features/notifications/notificationsSlice";

/**
 * Configuration du store Redux principal de l'application
 *
 * auth : gere la partie authentification du state global
 * notifications : gere la partie notifications du state global
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});
