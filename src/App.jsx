import AppRouter from "@/routes/AppRouter";
import { store } from "./store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

/**
 * Composant principal de l'application
 *
 * Il initialise le store
 * Affiche le routeur
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-center" />
    </Provider>
  );
}
