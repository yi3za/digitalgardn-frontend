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
| **Export PDF**           | jsPDF                                       |
| **Carrousel**            | Embla Carousel                              |
| **Theme**                | next-themes                                 |
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
  - Ajout des ressources de traduction anglaises pour les principaux modules de l'application.

- ✅ **Gestion des Donnees Asynchrones (TanStack Query)**
  - Utilisation de React Query pour la recuperation et la mise en cache des donnees.
  - Optimisation des performances avec gestion automatique des etats loading et error.
  - Invalidation plus complete des caches apres mutations (commandes, avis, services, portefeuille et donnees admin).

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
  - Skeletons metier pour listes, tables, graphiques, messages, services, taxonomies et details.

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
  - Envoi de fichiers dans les conversations.
  - Affichage des pieces jointes dans les bulles de messages.
  - Rafraichissement des conversations et messages apres envoi.

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
  - Liste des avis recents et cartes de chargement dediees aux widgets du dashboard.
  - Bouton de rafraichissement global pour recharger les donnees principales du dashboard.

- ✅ **Espace Administration**
  - AdminLayout avec navigation laterale et protection par role.
  - Tableau de bord admin : statistiques globales (utilisateurs, services, commandes).
  - Gestion des utilisateurs : liste et modification du statut (actif/inactif/banni).
  - Gestion des services : liste, approbation et rejet.
  - Gestion des commandes : liste avec details.
  - Gestion des categories : CRUD complet avec CategoryFormDialog et selection de parent.
  - Gestion des competences : CRUD complet avec CompetenceFormDialog.
  - Pages admin pour avis, portefeuilles, transactions et langues.
  - Tableau de bord admin enrichi avec activite recente, tendances mensuelles, stats avis et finance plateforme.
  - Navigation admin enrichie avec sections catalogue, finance et toggles theme/langue.
  - Gestion du statut et affichage des badges dans les vues admin.
  - AdminPageHeader : En-tete partage avec bouton refresh et indicateur isFetching.
  - Organisation des features admin par domaine (users/, services/, commandes/, stats/, categories/, competences/).
  - Affichage de la derniere activite et du nombre de jours d'inactivite des utilisateurs.
  - Skeletons dedies aux tables et listes recentes de l'administration.

- ✅ **Navigation Contextuelle et Pages Partagees**
  - NavigationContext centralise les chemins publics, dashboard et admin.
  - Pages de detail reutilisees selon le contexte pour services, freelances, categories et competences.
  - Mini cartes reutilisables pour categories, competences et services.
  - Masquage des actions publiques d'achat et de contact pour les administrateurs.

- ✅ **Catalogue, Langues et Freelances**
  - Module langues complet avec pages publiques, composants, filtres, routes et traductions.
  - Gestion admin des langues avec API, hooks React Query, schema Zod et formulaire dedie.
  - Affichage des langues sur le detail freelance et filtrage des services par langue.
  - Section des meilleurs freelances sur la page d'accueil.
  - Pages de detail categorie et competence basees sur les slugs.

- ✅ **Filtres, Pagination et Synchronisation URL**
  - FilterBar, PaginationBar et SearchBar reutilisables sur les listes.
  - Support generalise des filtres et de la pagination dans les APIs frontend et les hooks React Query.
  - Hook useUrlFilters pour synchroniser les filtres avec l'URL.
  - Filtres admin pour utilisateurs, services, commandes, transactions, avis, portefeuilles, categories, competences et langues.
  - Bouton de rafraichissement centralise dans FilterBar via la prop onRefetch.

- ✅ **Gestion Avancee des Services**
  - ServiceForm multi-etapes pour creation et edition des services.
  - Validation des fichiers existants et nouveaux.
  - Synchronisation des fichiers avec reordonnancement et suppression selective.
  - ServicesTable et ServiceRowActions pour les listes dashboard et admin.
  - FilePickerButton generique pour les selections de fichiers.

- ✅ **Export PDF des Commandes**
  - Generation de facture PDF avec jsPDF.
  - Bouton d'export integre dans la liste des commandes.
  - Traductions dediees pour le contenu de facture.

- ✅ **Theme, Langue et Ergonomie**
  - ThemeProvider avec support du mode sombre.
  - Toggles de theme et de langue dans le header et le layout admin.
  - Persistance de la langue selectionnee dans localStorage.
  - ScrollToTop dans le site principal et l'administration.
  - Barre de navigation extraite dans Navbar avec bouton retour et recherche.
  - Logo, favicon et splash screen anime bases sur l'identite visuelle de l'application.

- ✅ **Profil et Onboarding Ameliores**
  - Gestion de l'avatar existant dans le formulaire profil.
  - Reset du formulaire utilisateur apres modification.
  - Schema avatar avec discriminated union pour differencier avatar existant et nouveau fichier.
  - Scroll ajoute dans la page de configuration freelancer.

---

## Installation et Lancement

Suivez ces etapes pour configurer et lancer le projet sur votre machine locale.

**1. Cloner le projet**

```bash
git clone https://github.com/yi3za/digitalgardn-frontend.git
cd digitalgardn-frontend
copy .env.example .env
npm install
npm run dev
```

**Configuration environnement**

- `VITE_API_BASE_URL` permet de configurer l'URL du backend sans modifier le code source.
