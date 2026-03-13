import { QueryClient } from "@tanstack/react-query";

/**
 * Creation d'un QueryClient global pour tout le projet
 *
 * staleTime : Temps pendant lequel les donnees sont considerees "fraiches"
 * cacheTime : Temps pendant lequel les donnees restant en cache avant d'etre supprimees
 * retry : Nombre de tentatives en cas d'echec d'une requete
 * refetchOnWindowFocus : Ne pas relancer la requete automatiquement quand l'utilisateur revient sur l'onglet
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
