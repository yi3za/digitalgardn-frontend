# Digitalgardn Frontend

Interface utilisateur de l'application Digitalgardn, une plateforme de mise en relation entre des milliers de freelances et des clients du monde entier. Ce projet est initialise avec Vite et utilisera un framework JavaScript moderne (React).

---

## Technologies et Librairies

| Categorie                | Technologie / Librairie                                       |
| ------------------------ | ------------------------------------------------------------- |
| **Framework & Build**    | React 19, Vite                                                |
| **Gestion d'etat**       | Redux Toolkit, React-Redux                                    |
| **Gestion des Donnees**  | TanStack Query (v5)                                           |
| **Routage**              | React Router DOM                                              |
| **Formulaires**          | React Hook Form                                               |
| **Validation de Schema** | Zod                                                           |
| **Appels API**           | Axios (Intercepteurs & Gestion centralisee)                   |
| **UI & Style**           | Tailwind CSS, Shadcn/UI, Lucide React                         |
| **Notifications**        | Sonner                                                        |
| **Internationalisation** | i18next, react-i18next                                        |
| **Environnement**        | Node.js v22.17.1, npm 10.9.2                                  |

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

---

## Installation et Lancement

Suivez ces etapes pour configurer et lancer le projet sur votre machine locale.

**1. Cloner le projet**

```bash
git clone https://github.com/VOTRE_NOM/digitalgardn-frontend.git
cd digitalgardn-frontend
npm install
npm run dev
```
