import { createSelector } from "@reduxjs/toolkit";

// Selecteur de base pour les notifications
const selectNotifications = (state) => state.notifications;

// Selecteur pour les messages non lus par conversation
export const selectUnreadMessages = createSelector(
  selectNotifications,
  (notifications) => notifications.unreadMessages,
);

// Selecteur pour le total des messages non lus (toutes conversations)
export const selectTotalUnreadMessages = createSelector(
  selectUnreadMessages,
  (unreadMessages) =>
    Object.values(unreadMessages).reduce((total, count) => total + count, 0),
);

// Selecteur pour les messages non lus d'une conversation specifique
export const selectUnreadMessagesByConversation = (conversationId) =>
  createSelector(
    selectUnreadMessages,
    (unreadMessages) => unreadMessages[conversationId] ?? 0,
  );

// Selecteur pour les commandes non lues
export const selectUnreadCommandes = createSelector(
  selectNotifications,
  (notifications) => notifications.unreadCommandes,
);
