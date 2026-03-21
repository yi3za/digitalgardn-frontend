import { ProfilPage } from "@/pages/profil/ProfilPage";

/**
 * Definit les routes liees au profil utilisateur
 *
 * profil : page principale du profil utilisateur
 */
export const profilRoutes = {
  path: "profil",
  children: [
    {
      index: true,
      element: <ProfilPage />,
    },
  ],
};
