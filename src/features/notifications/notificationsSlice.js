import { createSlice } from "@reduxjs/toolkit";

// Etat initial du slice de notifications
const initialState = {
  unreadMessages: {},
  unreadCommandes: 0,
};

/**
 * Slice pour la gestion des notifications de l'utilisateur
 *
 * name : nom du slice dans le store global
 * initialState : etat initial defini ci-dessus
 * reducers : permet de definir les actions synchrones pour mettre a jour l'etat
 */
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setConversationMessages: (state, action) => {
      const { conversationId, count } = action.payload;
      state.unreadMessages[conversationId] = count;
    },
    incrementCommandes: (state) => {
      state.unreadCommandes += 1;
    },
    resetCommandes: (state) => {
      state.unreadCommandes = 0;
    },
  },
});

// Export des actions du slice de notifications
export const { setConversationMessages, incrementCommandes, resetCommandes } =
  notificationsSlice.actions;
// Export du reducer du slice de notifications pour l'inclure dans le store global
export const notificationsReducer = notificationsSlice.reducer;
