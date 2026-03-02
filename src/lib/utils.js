import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Assigne les erreurs serveur à chaque champ dans react-hook-form
 */
export function setServerErrors(errors, setError) {
  Object.entries(errors ?? {}).forEach(([field, message]) => {
    setError(field, { type: "server", message: message[0] });
  });
}
