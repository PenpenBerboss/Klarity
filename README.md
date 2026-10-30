# Klarity | Pilotage Décisionnel

**Klarity** est une plateforme moderne, complète et intuitive de gestion de projet, de planification agile (Scrum/Kanban), de suivi des jalons et d'analyse de performance d'équipe adaptée aux équipes au Cameroun et à l'international.

---

## 🌟 Fonctionnalités Principales

### 🕒 1. Horloge en Temps Réel & Fuseau Horaire Détecté (`LiveClock`)
- **Affichage Adaptatif** : Affiche l'heure exacte (heures, minutes, secondes) et la date selon les paramètres locaux de l'ordinateur ou du téléphone.
- **Fuseau Horaire Automatique** : Détection automatique du fuseau horaire local (ex: *Africa/Douala (UTC+1)*) dans la barre supérieure (`Topbar`).

### 🔔 2. Système de Notifications Intelligent & Temps Réel
- **Centre de Notifications Déroulant** : Accessible via la barre supérieure (`Topbar`) avec badge dynamique de messages non lus.
- **Filtres & Gestion** : Filtrage par statut (Toutes / Non lues), marquage individuel ou global comme lu, suppression ciblé ou effacement total.
- **Déclencheurs d'Alertes Automatiques** :
  - **Tâches** : Attribution d'une nouvelle tâche, rappels pour les échéances imminentes (< 48 heures), passage de statut (ex: *En revue*, *Terminé*).
  - **Mentions dans les Commentaires** : Notification automatique lorsqu'un utilisateur est mentionné (ex: `@Samuel Mbarga`).
  - **Projets** : Assignation en tant que manager, alerte de changement de statut critique (*À risque* ou *En retard*).
  - **Jalons (Milestones)** : Confirmation instantanée lors de la validation d'un jalon d'un projet géré.

---

### 📋 3. Gestion Interactive des Tâches (`TasksTab`)
Propose 4 vues interchangeables adaptées aux méthodologies modernes :
- **Vue Kanban** : Colonnes adaptatives (*À faire*, *En cours*, *En revue*, *Terminé*) avec support du glisser-déposer, badges de priorité, indicateurs de dépendances, sous-tâches interactives et menu 3 points complet (Éditer, Dupliquer, Changer statut/priorité/assigné, Supprimer).
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

### 📊 4. Tableau de Bord & Indicateurs KPI (`DashboardTab`)
- **Cartes KPI en Temps Réel** : Suivi des projets actifs, tâches en cours, taux de réussite global et niveau de charge de l'équipe.
- **Graphiques de Performance** : Visualisations interactives de la vélocité des sprints, de la santé des projets et de la répartition de la charge de travail.

---

### 📈 5. Rapports & Exportation PDF Fonctionnelle (`ReportsTab`)
- **Exportation PDF Haute Résolution** : Génération instantanée et téléchargement du rapport officiel en PDF (`jsPDF` + `html2canvas`) intégrant les graphiques de santé des projets, de vélocité et de charge d'équipe.
- **Notification de Confirmation** : Envoi d'une alerte lors de l'exportation réussie du document PDF.

---

### 📂 6. Gestion Avancée des Projets & Jalons (`ProjectsTab`)
- **Gestion du Cycle de Vie des Projets** : Création, édition, suivi du budget, archivage et suppression de projets.
- **Suivi Dynamique des Jalons (Milestones)** : Ajout rapide, édition inline du titre/date, et calcul automatique de la progression globale du projet.

---

### 👥 7. Gestion d'Équipe Camerounaise (`TeamTab`)
- **Annuaire des Membres** : Affichage des collaborateurs (Samuel Mbarga, Chantal Abena, Emmanuel Nguema, Nathalie Ekotto, Dieudonné Tchato), rôles, niveau de charge et disponibilité.

---

### ⚙️ 8. Configuration & Paramètres (`SettingsTab`)
- **Profil & Apparence** : Personnalisation du profil et gestion d'apparence globale (Thème clair, sombre, couleurs d'accentuation, densité).

---

## 🛠️ Stack Technique

- **Framework Front-End** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styles & Design** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Génération PDF** : `jspdf` & `html2canvas`
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Thématisation** : `next-themes` (Support natif du mode sombre)

---

## 📄 Licence

Application développée sous licence propriétaire **Klarity Platform**. Tous droits réservés.
