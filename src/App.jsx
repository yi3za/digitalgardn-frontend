import { AppRouter } from "@/routes/AppRouter";
import { store } from "./store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { getMeThunk } from "./features/auth/auth.thunks";

/**
 * Composant principal de l'application
 *
 * Initialise le store Redux
 * Charge l'utilisateur connecte (auth initiale)
 * Affiche le routeur et les notifications
 */
export function App() {
  // Au montage du composant, recuperer l'utilisateur connecte
  useEffect(() => {
    store.dispatch(getMeThunk());
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-center" />
    </Provider>
  );
}
