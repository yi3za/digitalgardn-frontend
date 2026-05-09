import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CommandesPage } from "@/pages/commandes/CommandesPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ServiceCreatePage } from "@/pages/dashboard/services/ServiceCreatePage";
import { ServiceEditPage } from "@/pages/dashboard/services/ServiceEditPage";
import { ServiceShowPage } from "@/pages/dashboard/services/ServiceShowPage";
import { ServicesPage } from "@/pages/dashboard/services/ServicesPage";
import { MessagesPage } from "@/pages/messages/MessagesPage";
import { PortefeuillePage } from "@/pages/portefeuille/PortefeuillePage";
import { TransactionsPage } from "@/pages/portefeuille/TransactionsPage";
import { ProfilPage } from "@/pages/profil/ProfilPage";

/**
 * Definit les routes liees au dashboard freelance
 *
 * DashboardLayout : layout principal du dashboard (protection + structure)
 */
export const dashboardRoutes = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "profil", element: <ProfilPage /> },
    { path: "messages", element: <MessagesPage /> },
    { path: "commandes", element: <CommandesPage dashboard /> },
    { path: "portefeuille", element: <PortefeuillePage /> },
    { path: "portefeuille/transactions", element: <TransactionsPage /> },
    {
      path: "services",
      children: [
        { index: true, element: <ServicesPage /> },
        { path: "create", element: <ServiceCreatePage /> },
        { path: ":slug", element: <ServiceShowPage /> },
        { path: ":slug/edit", element: <ServiceEditPage /> },
      ],
    },
  ],
};
