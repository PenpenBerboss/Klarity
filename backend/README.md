# 🚀 Backend Klarity (Node.js + Express + MySQL)

Ce dossier contient le serveur backend complet d'API REST développé avec **Node.js**, **Express**, et **MySQL** pour l'application de gestion de projets **Klarity**.

---

## 📁 Structure du Dossier `backend`

```
backend/
├── config/
│   └── db.js                 # Configuration de la connexion MySQL (Pool de connexions mysql2)
├── controllers/
│   ├── projectController.js  # Logique métier des projets & jalons
│   ├── taskController.js     # Logique métier des tâches, sous-tâches & commentaires
│   ├── sprintController.js   # Logique métier des Sprints Agiles
│   ├── teamController.js     # Logique métier de l'équipe
│   ├── notificationController.js # Logique métier des notifications
│   └── settingController.js  # Logique métier des paramètres utilisateur
├── routes/
│   ├── projectRoutes.js      # Routes API pour /api/projects
│   ├── taskRoutes.js         # Routes API pour /api/tasks
│   ├── sprintRoutes.js       # Routes API pour /api/sprints
│   ├── teamRoutes.js         # Routes API pour /api/team
│   ├── notificationRoutes.js # Routes API pour /api/notifications
│   └── settingRoutes.js      # Routes API pour /api/settings
├── .env.example              # Exemple de fichier de variables d'environnement
├── package.json              # Dépendances du projet Node.js
├── schema.sql                # Script DDL de création de la base de données & des tables
├── seed.sql                  # Script DML d'injection des données d'exemple (Cameroun)
├── server.js                 # Point d'entrée principal du serveur Express
└── README.md                 # Guide de démarrage rapide
```

---

## 🛠️ Instructions d'Installation & Lancement Local

### 1. Prérequis
- **Node.js** (v18.0.0 ou supérieur) & **npm**
- Un serveur **MySQL** (ou MariaDB, XAMPP, WampServer, Laragon) en cours d'exécution localement.

---

### 2. Configuration de la Base de Données MySQL

1. Connectez-vous à votre client MySQL (ex: MySQL Workbench, phpMyAdmin, ou ligne de commande MySQL) :
   ```bash
   mysql -u root -p
   ```

2. Pour une base **neuve uniquement**, exécutez **`schema.sql`** pour créer la base de données `klarity` et ses tables. Ce schéma de référence intègre les évolutions antérieures (profil utilisateur, alertes et fuseau horaire `Africa/Douala`). Le script réinitialise les tables : ne l’exécutez pas sur une base contenant des données à conserver. Pour une base existante, adaptez le schéma manuellement afin de préserver ses données.
   ```bash
   mysql -u root -p < schema.sql
   ```

3. Exécutez **`seed.sql`** uniquement pour ajouter les données de démonstration à une base neuve :
   ```bash
   mysql -u root -p < seed.sql
   ```

---

### 3. Installation des Dépendances & Variables d'Environnement

1. Naviguez dans le dossier `backend` :
   ```bash
   cd backend
   ```

2. Installez les packages npm :
   ```bash
   npm install
   ```
   Cette commande installe notamment `dotenv`, utilisé par `server.js` et la configuration MySQL. Si Node affiche `Cannot find module 'dotenv'`, relancez `npm install` depuis le dossier `backend` avant de redémarrer le serveur.

Les photos de profil (JPG, PNG, GIF ou WebP, 1 Mo maximum) sont enregistrées localement dans `backend/photos/`. Leur chemin est enregistré dans MySQL et les fichiers sont servis par l’API ; le dossier doit donc être conservé lors des redémarrages et inclus dans les sauvegardes. Dans un hébergement avec disque éphémère, configurez un volume persistant pour ce dossier.

3. Créez un fichier `.env` basé sur `.env.example` :
   ```bash
   cp .env.example .env
   ```

4. Modifiez les identifiants MySQL dans `.env` selon votre environnement local :
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe_mysql
   DB_NAME=klarity
   DB_PORT=3306
   ```

---

### 4. Démarrage du Serveur Backend

Pour lancer le serveur en mode développement avec rechargement automatique (**Nodemon**) :

```bash
npm run dev
```

Ou en mode production :

```bash
npm start
```

Le serveur sera accessible à l'adresse : **`http://localhost:5000/api`**

À la racine du dépôt, créez aussi `.env.local` à partir de `.env.example` et configurez `BACKEND_URL`. Démarrez ensuite le frontend avec `npm run dev`. Les routes Next `/api/*` relaient maintenant les appels vers Express ; elles ne gardent plus de données mockées en mémoire.

---

## 📡 Endpoints API Principaux

### 📊 Health Check
- `GET /api/health` : Vérifie que le serveur backend et l'API fonctionnent.

### 📂 Projets & Jalons (`/api/projects`)
- `GET /api/projects` : Récupère tous les projets avec leurs jalons et responsable.
- `POST /api/projects` : Crée un nouveau projet.
- `PUT /api/projects/:id` : Met à jour un projet.
- `DELETE /api/projects/:id` : Supprime un projet.
- `POST /api/projects/:projectId/milestones` : Ajoute un jalon.
- `PATCH /api/projects/milestones/:id/toggle` : Bascule le statut d'un jalon (fait/à faire) et met à jour la progression du projet.

### 📋 Tâches & Commentaires (`/api/tasks`)
- `GET /api/tasks` : Récupère toutes les tâches avec leurs sous-tâches, dépendances et commentaires.
- `POST /api/tasks` : Crée une nouvelle tâche.
- `PUT /api/tasks/:id` : Met à jour une tâche.
- `DELETE /api/tasks/:id` : Supprime une tâche.
- `POST /api/tasks/:id/duplicate` : Duplique une tâche.
- `POST /api/tasks/:taskId/comments` : Ajoute un commentaire sur une tâche.

### 🏃 Sprints Agiles (`/api/sprints`)
- `GET /api/sprints` : Récupère les Sprints.
- `POST /api/sprints` : Crée un Sprint.
- `PUT /api/sprints/:id` : Met à jour un Sprint.
- `DELETE /api/sprints/:id` : Supprime un Sprint et réaffecte ses tâches au Backlog.

### 👥 Équipe (`/api/team`)
- `GET /api/team` : Récupère la liste des membres.
- `POST /api/team` : Ajoute un membre à l'équipe.

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` : Récupère les notifications d'un utilisateur.
- `PATCH /api/notifications/:id/read` : Marque une notification comme lue.
- `POST /api/notifications/read-all` : Marque toutes les notifications comme lues.
- `DELETE /api/notifications/clear-all` : Efface toutes les notifications.

### ⚙️ Paramètres (`/api/settings`)
- `GET /api/settings` : Récupère les préférences utilisateur.
- `POST /api/settings` : Sauvegarde/Met à jour les préférences.

### 🚧 Points de blocage (`/api/actionable-tasks`)
- `GET /api/actionable-tasks` : Récupère les alertes enregistrées.
- `POST /api/actionable-tasks` : Crée ou met à jour une alerte.
