# Digitalgardn Frontend

Interface utilisateur de l'application Digitalgardn, une plateforme de mise en relation entre des milliers de freelances et des clients du monde entier. Ce projet est initialise avec Vite et utilisera un framework JavaScript moderne (React).

---

## Technologies et Librairies

| Categorie                | Technologie / Librairie                     |
| ------------------------ | ------------------------------------------- |
| **Framework & Build**    | React 19, Vite                              |
| **Gestion d'etat**       | Redux Toolkit, React-Redux                  |
| **Gestion des Donnees**  | TanStack Query (v5)                         |
| **Routage**              | React Router DOM                            |
| **Formulaires**          | React Hook Form                             |
| **Validation de Schema** | Zod                                         |
| **Appels API**           | Axios (Intercepteurs & Gestion centralisee) |
| **UI & Style**           | Tailwind CSS, Shadcn/UI, Lucide React       |
| **Notifications**        | Sonner                                      |
| **Internationalisation** | i18next, react-i18next                      |
| **Temps Reel**           | Laravel Echo, Pusher-js                     |
| **Graphiques**           | Recharts                                    |
| **Carrousel**            | Embla Carousel                              |
| **Environnement**        | Node.js v22.17.1, npm 10.9.2                |

---

## Fonctionnalites Implementees

- ✅ **Architecture Robuste et Modulaire**
  - Organisation du code par fonctionnalites pour une maintenance simplifiee.
  - Utilisation de hooks et d'utilitaires pour un code propre et reutilisable.

- ✅ **Systeme d'Authentification Complet**
  - Inscription, connexion, deconnexion et recuperation des informations de l'utilisateur.
  - Flux securise de reinitialisation de mot de passe en plusieurs etapes.

- ✅ **Gestion d'Etat Centralisee**
  - Etat de l'application previsible et maintenable.
  - Gestion complete du cycle de vie des appels API asynchrones.

- ✅ **Formulaires Intelligents et Experience Utilisateur (UX)**
  - Validation des donnees en temps reel et gestion centralisee des erreurs.
  - Focus automatique sur les champs invalides et desactivation pendant le chargement.

- ✅ **Interface Utilisateur (UI) Moderne et Reactive**
  - Bibliotheque de composants d'interface coherents et reutilisables.
  - Systeme de notifications global pour les retours utilisateur et indicateurs de chargement.

- ✅ **Internationalisation (i18n)**
  - Application entierement traduisible avec gestion des textes de l'interface et des messages d'erreur.

- ✅ **Gestion des Donnees Asynchrones (TanStack Query)**
  - Utilisation de React Query pour la recuperation et la mise en cache des donnees.
  - Optimisation des performances avec gestion automatique des etats loading et error.

- ✅ **Espace Profil & Parametres Utilisateur**
  - Gestion de Profil : Mise a jour des informations et upload d'avatar.
  - Interface Controlee : Utilisation de Sheet (Shadcn) avec etat controle (activeSheet).
  - Zone de Danger : Actions sensibles avec dialogues de confirmation et gestion des erreurs.

- ✅ **Composants UI Avances & UX**
  - WaitButton & useWait : Hook personnalise pour gerer les delais sur les actions critiques.
  - CustomFormField : Standardisation des entrees avec validation Zod integree.

- ✅ **Nouveaux Composants UI**
  - SkillBadges : Composant reutilisable pour l'affichage des badges categories et competences avec lien.
  - AvatarIdentity : Composant unifie pour l'affichage des avatars et identites utilisateur.
  - Table : Composant table complet (TableHeader, TableBody, TableHead, TableRow, TableCell).
  - Select : Composant select accessible base sur Radix UI.
  - DataLoading / DataError / DataEmpty : Etats de donnees standardises et reutilisables.

- ✅ **Routage & Layout Restructures**
  - SiteLayout : Layout global encapsulant les pages publiques.
  - AdminRoute : Guard de route protegeant l'espace administration par role.
  - SettingsLayout : Layout dedie aux parametres utilisant useOutletContext pour partager les donnees.
  - Masquage des elements de navigation pour les utilisateurs non authentifies.

- ✅ **Portefeuille & Transactions**
  - Page Transactions avec historique des operations du portefeuille.
  - Composants TRANSACTION_TYPE pour l'affichage typee des transactions.
  - Liens vers Portefeuille et Transactions dans le menu utilisateur et le header.
  - Routes dashboard dediees pour le portefeuille et ses transactions.

- ✅ **Systeme de Commandes Complet**
  - Pages, routes et composants complets pour la gestion des commandes.
  - Flux d'achat avec ServicePurchaseDialog et ServiceInstructionsDialog.
  - Menu d'actions dynamique avec transitions de statuts selon le role (vendeur/acheteur).
  - Affichage du statut de commande dans ConversationItem et ChatWindow.

- ✅ **Messagerie Avancee**
  - Badge de messages non lus par conversation.
  - Liaison conversations-commandes avec affichage du statut dans l'en-tete.
  - Compteur de messages non lus initialise en temps reel.

- ✅ **Notifications & Temps Reel**
  - Slice Redux pour les notifications globales avec badge dans le header.
  - Hook useRealtimeSubscriptions pour la gestion globale des canaux WebSocket.
  - Abonnements temps reel : commandes, messages, portefeuille.
  - Invalidation automatique du cache TanStack Query lors des evenements broadcast.

- ✅ **Systeme d'Avis**
  - Composants et schemas pour la creation d'avis apres commande terminee.
  - Affichage de la liste des avis avec note sur la page de detail du service.
  - Saisie d'avis integree directement en fin de conversation.

- ✅ **Tableau de Bord Freelance**
  - Page et composants du tableau de bord avec statistiques.
  - Visualisations graphiques via Recharts.
  - Invalidation intelligente du cache lors des mutations.

- ✅ **Espace Administration**
  - AdminLayout avec navigation laterale et protection par role.
  - Tableau de bord admin : statistiques globales (utilisateurs, services, commandes).
  - Gestion des utilisateurs : liste et modification du statut (actif/inactif/banni).
  - Gestion des services : liste, approbation et rejet.
  - Gestion des commandes : liste avec details.
  - Gestion des categories : CRUD complet avec CategoryFormDialog et selection de parent.
  - Gestion des competences : CRUD complet avec CompetenceFormDialog.
  - AdminPageHeader : En-tete partage avec bouton refresh et indicateur isFetching.
  - Organisation des features admin par domaine (users/, services/, commandes/, stats/, categories/, competences/).

---

## Installation et Lancement

Suivez ces etapes pour configurer et lancer le projet sur votre machine locale.

**1. Cloner le projet**

```bash
git clone https://github.com/yi3za/digitalgardn-frontend.git
cd digitalgardn-frontend
npm install
npm run dev
```
