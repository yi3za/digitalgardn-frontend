import { AppRouter } from "@/routes/AppRouter";
import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { getMeThunk } from "@/features/auth/auth.thunks";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * Composant principal de l'application
 *
 * Initialise le store Redux
 * Charge l'utilisateur connecte (auth initiale)
 * Affiche le routeur et les notifications
 * On enveloppe AppRouter avec QueryClientProvider pour React Query
 * Devtools pour debug le cache et les requetes
 */
export function App() {
  // Au montage du composant, recuperer l'utilisateur connecte
  useEffect(() => {
    store.dispatch(getMeThunk());
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
