import { client, contentTypeJson } from "@/api/client";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Instance singleton de Echo pour la gestion des connexions websocket a Reverb
let echoInstance = null;

export const isRealtimeEnabled = () =>
  Boolean(import.meta.env.VITE_REVERB_APP_KEY);

/**
 * Retourne une instance singleton de Echo configuree pour Reverb.
 */
export const getEcho = () => {
  if (echoInstance) return echoInstance;
  console.log("Initialisation de la connexion websocket pour Reverb...");
  // Si la fonctionnalite de temps reel n'est pas active, ne pas creer d'instance Echo
  if (!isRealtimeEnabled()) {
    return null;
  }
  // Pusher est requis par Echo pour le websocket
  window.Pusher = Pusher;
  // Creation de l'instance Echo avec la configuration de Reverb
  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? "127.0.0.1",
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (channel) => ({
      authorize: async (socketId, callback) => {
        try {
          console.log("Authentification au canal websocket Reverb...");
          // Assure l'existence du cookie CSRF pour l'endpoint de channel auth.
          await client.get("/sanctum/csrf-cookie");
          // Appeler l'endpoint d'authentification de canal de Reverb pour obtenir les credentials d'abonnement
          const response = await client.post(
            "/broadcasting/auth",
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            contentTypeJson,
          );
          // Passer les credentials a Echo pour finaliser l'abonnement au canal
          callback(null, response.data);
        } catch (error) {
          callback(error);
        }
      },
    }),
  });
  // Retourner l'instance Echo creee
  return echoInstance;
};

/**
 * Ferme proprement la connexion websocket.
 */
export const disconnectEcho = () => {
  if (!echoInstance) return;
  // Deconnecter Echo pour fermer la connexion websocket
  echoInstance.disconnect();
  echoInstance = null;
};
