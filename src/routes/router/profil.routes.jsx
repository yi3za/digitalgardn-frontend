import { ProfilLayout } from "@/components/layout/ProfilLayout";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { ProfilPage } from "@/pages/profil/ProfilPage";

export const profilRoutes = {
  element: (
    <ProtectedRoute>
      <ProfilLayout />
    </ProtectedRoute>
  ),
  children: [{ path: "profil", element: <ProfilPage /> }],
};
