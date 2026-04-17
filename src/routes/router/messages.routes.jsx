import { MessagesPage } from "@/pages/messages/MessagesPage";

/**
 * Definit les routes liees a la messagerie
 *
 * MessagesPage : page principale de la messagerie, affichant la liste des conversations et les messages d'une conversation selectionnee
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
