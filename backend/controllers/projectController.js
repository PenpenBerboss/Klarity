const db = require('../config/db');

// Récupérer tous les projets avec leurs jalons et responsable
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT p.*, u.name AS manager_name 
      FROM projects p 
      LEFT JOIN users u ON p.manager_id = u.id 
      ORDER BY p.created_at DESC
    `);

    // Récupérer les jalons pour chaque projet
    for (let project of projects) {
      const [milestones] = await db.query(
        'SELECT id, title, due_date AS dueDate, completed FROM milestones WHERE project_id = ? ORDER BY due_date ASC',
        [project.id]
      );
      project.milestones = milestones;
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des projets', details: err.message });
  }
};

// Créer un nouveau projet
exports.createProject = async (req, res) => {
  const { name, description, manager_id, status, priority, budget, start_date, end_date, milestones } = req.body;
  const id = `PRJ-${Date.now().toString().slice(-4)}`;

  try {
    await db.query(
      `INSERT INTO projects (id, name, description, manager_id, status, priority, budget, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description || '', manager_id || null, status || 'on_track', priority || 'medium', budget || 0, start_date || null, end_date || null]
    );

    if (milestones && Array.isArray(milestones)) {
      for (let m of milestones) {
        const mId = `MLS-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
        await db.query(
          'INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES (?, ?, ?, ?, ?)',
          [mId, id, m.title, m.dueDate, m.completed || false]
        );
      }
    }

    res.status(201).json({ message: 'Projet créé avec succès', projectId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du projet', details: err.message });
  }
};

// Mettre à jour un projet
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, priority, budget, budget_spent, progress } = req.body;

  try {
    await db.query(
      `UPDATE projects 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           status = COALESCE(?, status), 
           priority = COALESCE(?, priority), 
           budget = COALESCE(?, budget), 
           budget_spent = COALESCE(?, budget_spent), 
           progress = COALESCE(?, progress) 
       WHERE id = ?`,
      [name, description, status, priority, budget, budget_spent, progress, id]
    );

    res.json({ message: 'Projet mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du projet', details: err.message });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du projet', details: err.message });
  }
};

// Ajouter un jalon à un projet
exports.addMilestone = async (req, res) => {
  const { projectId } = req.params;
  const { title, dueDate } = req.body;
  const mId = `MLS-${Date.now().toString().slice(-4)}`;

  try {
    await db.query(
      'INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES (?, ?, ?, ?, false)',
      [mId, projectId, title, dueDate]
    );

    res.status(201).json({ message: 'Jalon ajouté avec succès', milestoneId: mId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du jalon', details: err.message });
  }
};

// Basculer la complétion d'un jalon
exports.toggleMilestone = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT completed, project_id FROM milestones WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Jalon non trouvé' });

    const newStatus = !rows[0].completed;
    await db.query('UPDATE milestones SET completed = ? WHERE id = ?', [newStatus, id]);

    // Re-calculer la progression du projet
    const projectId = rows[0].project_id;
    const [allMls] = await db.query('SELECT completed FROM milestones WHERE project_id = ?', [projectId]);
    if (allMls.length > 0) {
      const completedCount = allMls.filter(m => m.completed).length;
      const progressPercentage = Math.round((completedCount / allMls.length) * 100);
      await db.query('UPDATE projects SET progress = ? WHERE id = ?', [progressPercentage, projectId]);
    }

    res.json({ message: 'Statut du jalon mis à jour', completed: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du jalon', details: err.message });
  }
};
