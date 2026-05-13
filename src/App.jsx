import { AppRouter } from "@/routes/AppRouter";
import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui";
import { useEffect } from "react";
import { getMeThunk } from "@/features/auth/auth.thunks";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

// Composant racine de l'application
export function App() {
  // Charger les donnees utilisateur au demarrage
  useEffect(() => {
    store.dispatch(getMeThunk());
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AppRouter />
          <Toaster position="top-center" />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
