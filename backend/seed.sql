-- ========================================================
-- SCRIPT D'INSERTION DES DONNÉES INITIALES (SEED DATA)
-- ========================================================

USE klarity_db;

-- 1. Insertion des Utilisateurs
INSERT INTO users (id, name, email, role, load_percentage, status) VALUES
('USR-1', 'Samuel Mbarga', 'samuel.mbarga@klarity.cm', 'Lead Architecte & Fullstack', 75, 'busy'),
('USR-2', 'Chantal Abena', 'chantal.abena@klarity.cm', 'Chef de Projet Senior', 60, 'available'),
('USR-3', 'Emmanuel Nguema', 'emmanuel.nguema@klarity.cm', 'Ingénieur DevOps & Cloud', 80, 'busy'),
('USR-4', 'Nathalie Ekotto', 'nathalie.ekotto@klarity.cm', 'UI/UX Designer', 40, 'available'),
('USR-5', 'Dieudonné Tchato', 'dieudonne.tchato@klarity.cm', 'Développeur Backend', 50, 'away');

-- 2. Insertion des Projets
INSERT INTO projects (id, name, description, manager_id, status, priority, budget, budget_spent, progress, start_date, end_date) VALUES
('PRJ-1', 'Refonte ERP', 'Modernisation complète de la plateforme de gestion ERP entreprise.', 'USR-2', 'on_track', 'high', 12000000.00, 7500000.00, 65, '2026-01-10', '2026-06-30'),
('PRJ-2', 'App Mobile', 'Application mobile iOS/Android pour la bancarisation et paiements.', 'USR-1', 'at_risk', 'critical', 8000000.00, 6200000.00, 45, '2026-02-01', '2026-05-15'),
('PRJ-3', 'Migration Cloud', 'Migration des infrastructures internes vers un Cloud hybride.', 'USR-3', 'on_track', 'high', 20000000.00, 11000000.00, 55, '2026-01-01', '2026-08-31'),
('PRJ-4', 'Site Web', 'Refonte vitrine et portail client institutionnel.', 'USR-4', 'on_track', 'medium', 4000000.00, 3900000.00, 90, '2026-02-15', '2026-03-31'),
('PRJ-5', 'CRM V2', 'Plateforme de gestion de la relation client et prospection.', 'USR-2', 'delayed', 'medium', 9000000.00, 4500000.00, 30, '2026-03-01', '2026-09-30');

-- 3. Insertion des Jalons (Milestones)
INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES
('MLS-1', 'PRJ-1', 'Spécifications fonctionnelles validées', '2026-01-30', TRUE),
('MLS-2', 'PRJ-1', 'Livraison de la version Beta', '2026-04-15', FALSE),
('MLS-3', 'PRJ-2', 'Intégration API Mobile Money Orange & MTN', '2026-03-10', FALSE),
('MLS-4', 'PRJ-3', 'Validation sécurité & Conformité', '2026-05-01', FALSE);

-- 4. Insertion des Sprints
INSERT INTO sprints (id, name, start_date, end_date, status) VALUES
('SPR-1', 'Sprint 1 - MVP Core', '2026-03-01', '2026-03-14', 'active'),
('SPR-2', 'Sprint 2 - UI Refinement', '2026-03-15', '2026-03-28', 'planned');

-- 5. Insertion des Tâches
INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, sprint_id) VALUES
('TSK-1', 'Maquette page accueil', 'Conception des wireframes et prototypes figma', 'PRJ-4', 'USR-4', 'todo', 'high', '2026-03-05', 'SPR-1'),
('TSK-2', 'API Authentification Mobile Money', 'Intégration SDK paiement sécurisé', 'PRJ-2', 'USR-1', 'in_progress', 'critical', '2026-03-01', 'SPR-1'),
('TSK-3', 'Tests E2E & Validation', 'Cahier de recette fonctionnelle', 'PRJ-1', 'USR-2', 'review', 'medium', '2026-03-15', 'SPR-2'),
('TSK-4', 'Configuration CI/CD Kubernetes', 'Script Helm charts et déploiement continu', 'PRJ-3', 'USR-3', 'done', 'high', '2026-03-02', 'SPR-1'),
('TSK-5', 'Design System & Composants', 'Bibliothèque de composants UI réutilisables', 'PRJ-2', 'USR-4', 'in_progress', 'medium', '2026-03-20', NULL),
('TSK-6', 'Rédaction documentation technique', 'Documentation API OpenAPI/Swagger', 'PRJ-5', 'USR-5', 'todo', 'medium', '2026-03-25', NULL);

-- 6. Dépendances entre Tâches
INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES
('TSK-2', 'TSK-1'),
('TSK-3', 'TSK-2');

-- 7. Insertion des Sous-tâches
INSERT INTO subtasks (id, task_id, title, completed) VALUES
('SUB-1', 'TSK-1', 'Zoning wireframe', TRUE),
('SUB-2', 'TSK-1', 'Prototypage Figma', FALSE),
('SUB-3', 'TSK-2', 'Connexion Orange Money', TRUE),
('SUB-4', 'TSK-2', 'Connexion MTN Mobile Money', TRUE),
('SUB-5', 'TSK-2', 'Gestion webhooks de notification', FALSE);

-- 8. Insertion des Commentaires
INSERT INTO task_comments (id, task_id, author_id, text) VALUES
('CMT-1', 'TSK-2', 'USR-1', 'Les webhooks Orange Money nécessitent une validation de certificat SSL.'),
('CMT-2', 'TSK-2', 'USR-2', 'Rappel : La réunion de démonstration avec le client aura lieu vendredi.');

-- 9. Insertion des Notifications Initiales
INSERT INTO notifications (id, user_id, type, title, message, is_read) VALUES
('NTF-1', 'USR-1', 'due_date', 'Échéance imminente', 'La tâche API Authentification Mobile Money arrive à échéance sous peu.', FALSE),
('NTF-2', 'USR-1', 'comment', 'Nouveau commentaire', 'Chantal Abena a commenté sur votre tâche TSK-2.', FALSE),
('NTF-3', 'USR-1', 'system', 'Bienvenue sur Klarity', 'Votre espace de travail est configuré et prêt à l\'emploi.', TRUE);

-- 10. Insertion des Paramètres Utilisateur & Fuseau Horaire
INSERT INTO user_settings (user_id, theme, accent_color, density, language, timezone, date_format, email_notifications, push_notifications) VALUES
('USR-1', 'system', 'indigo', 'comfortable', 'fr', 'Europe/Paris', 'DD/MM/YYYY', TRUE, TRUE);
