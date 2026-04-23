import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
 *
 * dashboard : page principale du dashboard (vue globale, statistiques, etc.)
 * dashboard/services : liste des services du freelance
 * dashboard/services/create : page de creation d'un nouveau service
 * dashboard/services/:slug : page privee de visualisation d'un service du freelance, y compris les brouillons
 * dashboard/services/:slug/edit : page de modification d'un service existant (identifie par son slug)
 * dashboard/profil : page de modification du profil du freelance
 * dashboard/portefeuille : page de gestion du portefeuille du freelance (solde, transactions, etc.)
 * dashboard/portefeuille/transactions : page de l'historique complet des transactions du portefeuille
 * dashboard/messages : page de messagerie du freelance (liste des conversations + messages d'une conversation selectionnee)
 */
export const dashboardRoutes = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "profil", element: <ProfilPage /> },
    { path: "portefeuille", element: <PortefeuillePage /> },
    { path: "portefeuille/transactions", element: <TransactionsPage /> },
    { path: "messages", element: <MessagesPage /> },
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
