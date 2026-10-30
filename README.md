# Klarity | Pilotage Décisionnel

**Klarity** est une plateforme moderne, complète et intuitive de gestion de projet, de planification agile (Scrum/Kanban), de suivi des jalons et d'analyse de performance d'équipe adaptée aux équipes au Cameroun et à l'international.

---

## 🌟 Fonctionnalités Principales

### 👥 1. Gestion d'Équipe & Invitations par Lien (`TeamTab`)
- **Invitations Fonctionnelles par Lien & Email** :
  - **Génération de Liens Sécurisés** : Génération instantanée d'un URL d'invitation unique avec token cryptographique (`/join?token=INV-...&email=...`).
  - **Bouton Copier en Un Clic** : Copie instantanée dans le presse-papier avec confirmation visuelle (*Lien copié dans le presse-papier !*).
  - **Envoi Direct par Email (`mailto:`)** : Pré-remplissage automatique d'un courriel dans le client mail par défaut contenant le message d'invitation personnalisé et le lien d'accès.
  - **Relance des Invités** : Bouton d'action directe sur les membres au statut *En attente* pour copier à nouveau le lien d'accès.
- **Réassignation Complète des Tâches** (`ReassignModal`) :
  - **Modale Dédiée de Réassignation** : Ouverture à partir du menu d'action d'un collaborateur (*Réassigner les tâches*).
  - **Mode Global** : Re-transfert en masse de l'intégralité des tâches d'un collaborateur vers un autre membre disponible en un seul clic.
  - **Mode Granulaire (Par Tâche)** : Sélection individuelle d'un responsable différent pour chaque tâche spécifique attribuée au membre source.
  - **Mise à Jour Temps Réel** : Synchronisation immédiate des cartes Kanban, des statistiques de charge et du stockage persistant.

---

### 🗄️ 2. Architecture Backend Node.js / Express & MySQL (`/backend`)
- **Structure Complète d'API REST** :
  - `GET /api/team` & `POST /api/team` : Récupération et ajout des collaborateurs.
  - `POST /api/team/invite` : Génération des invitations d'équipe et création de l'enregistrement temporaire.
  - `POST /api/team/reassign-tasks` & `PUT /api/tasks/reassign-bulk` : Réassignation globale ou ciblée des tâches dans la base de données MySQL.
  - `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` : Gestion complète du cycle de vie des tâches, sous-tâches et commentaires.
- **Scripts SQL & Configuration** :
  - `/backend/schema.sql` : Création de la structure relationnelle (`users`, `projects`, `tasks`, `subtasks`, `task_comments`, `task_dependencies`, `sprints`, `settings`).
  - `/backend/seed.sql` : Données de démonstration prêtes à l'emploi avec des collaborateurs camerounais.

---

### 🕒 3. Horloge en Temps Réel & Fuseau Horaire Détecté (`LiveClock`)
- **Affichage Adaptatif** : Affiche l'heure exacte (heures, minutes, secondes) et la date selon les paramètres locaux de l'ordinateur ou du téléphone.
- **Fuseau Horaire Automatique** : Détection automatique du fuseau horaire local (ex: *Africa/Douala (UTC+1)*) dans la barre supérieure (`Topbar`).

---

### 🔔 4. Système de Notifications Intelligent & Temps Réel
- **Centre de Notifications Déroulant** : Accessible via la barre supérieure (`Topbar`) avec badge dynamique de messages non lus.
- **Filtres & Gestion** : Filtrage par statut (Toutes / Non lues), marquage individuel ou global comme lu, suppression ciblé ou effacement total.
- **Déclencheurs d'Alertes Automatiques** :
  - **Tâches & Réassignations** : Notification lors de l'attribution ou de la réassignation d'une tâche, rappels pour les échéances imminentes (< 48 heures), passage de statut (*En revue*, *Terminé*).
  - **Mentions dans les Commentaires** : Notification automatique lorsqu'un utilisateur est mentionné (ex: `@Samuel Mbarga`).
  - **Projets & Jalons** : Confirmation instantanée lors de la validation d'un jalon ou du changement de statut d'un projet.

---

### 📋 5. Gestion Interactive des Tâches (`TasksTab`)
Propose 4 vues interchangeables adaptées aux méthodologies modernes :
- **Vue Kanban** : Colonnes adaptatives (*À faire*, *En cours*, *En revue*, *Terminé*) avec support du glisser-déposer, badges de priorité, indicateurs de dépendances, sous-tâches interactives et menu 3 points complet.
- **Fermeture Intelligente des Cartes / Modales** : Clic en dehors du conteneur (sur le fond assombri) pour fermer instantanément la modale ou la carte ouverte.
- **Timers d'Échéance Dynamiques** (`DeadlineTimerBadge`) : Compte à rebours en temps réel avec variation de couleur selon l'urgence :
  - 🔴 **Rouge clignotant** : En retard
  - 🟠 **Ambre** : Échéance imminente (< 48h)
  - 🔵 / 🟢 **Indigo / Émeraude** : Dans les temps
  - 🟢 **Vert avec coche** : Tâche terminée
- **Vue Chronologique (Timeline / Gantt)** :
  - **Glissement Horizontal par Maintien de Souris** (*Mouse Drag-to-Scroll*) pour faire défiler les jours et mois de manière fluide.
  - Plage étendue sur 60 jours avec boutons de saut temporel (±7 jours, Aujourd'hui).
- **Vue Planning & Sprints (Agile)** :
  - CRUD complet des Sprints (Création, modification du nom et des périodes, clôture de sprint).
  - Backlog réorganisable avec Drag & Drop vers les sprints prévus.
- **Vue Calendrier** : Vue d'ensemble mensuelle calée sur les dates d'échéance.

---

### 📊 6. Tableau de Bord & Indicateurs KPI (`DashboardTab`)
- **Cartes KPI en Temps Réel** : Suivi des projets actifs, tâches en cours, taux de réussite global et niveau de charge de l'équipe.
- **Graphiques de Performance** : Visualisations interactives de la vélocité des sprints, de la santé des projets et de la répartition de la charge de travail.

---

### 📈 7. Rapports & Exportation PDF Fonctionnelle (`ReportsTab`)
- **Exportation PDF Haute Résolution** : Génération instantanée et téléchargement du rapport officiel en PDF (`jsPDF` + `html2canvas`) intégrant les graphiques de santé des projets, de vélocité et de charge d'équipe.

---

### ⚙️ 8. Configuration & Paramètres (`SettingsTab`)
- **Profil & Apparence** : Personnalisation du profil et gestion d'apparence globale (Thème clair, sombre, couleurs d'accentuation, densité).

---

## 🛠️ Stack Technique

- **Front-End** : [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Back-End** : Node.js, Express.js, MySQL (Pilote `mysql2/promise`)
- **Génération PDF** : `jspdf` & `html2canvas`
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Thématisation** : `next-themes` (Support natif du mode sombre)

---

## 📄 Licence

Application développée sous licence propriétaire **Klarity Platform**. Tous droits réservés.
