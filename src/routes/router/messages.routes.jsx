import { MessagesPage } from "@/pages/messages/MessagesPage";

/**
 * Definit les routes liees a la messagerie
  */
export const messagesRoutes = {
  path: "messages",
  children: [
    {
      index: true,
      element: <MessagesPage />,
    },
  ],
};
