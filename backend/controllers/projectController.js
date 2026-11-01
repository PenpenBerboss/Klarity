const crypto = require('node:crypto');
const db = require('../config/db');

async function findManagerId(connection, project) {
  if (project.manager_id) return project.manager_id;
  if (!project.manager) return null;
  const [users] = await connection.query('SELECT id FROM users WHERE name = ? LIMIT 1', [project.manager]);
  return users[0]?.id || null;
}

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT p.*, u.name AS manager_name
      FROM projects p
      LEFT JOIN users u ON p.manager_id = u.id
      ORDER BY p.created_at DESC
    `);
    for (const project of projects) {
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

exports.createProject = async (req, res) => {
  const connection = await db.getConnection();
  const project = req.body;
  const id = project.id || `PRJ-${crypto.randomUUID()}`;
  try {
    await connection.beginTransaction();
    const managerId = await findManagerId(connection, project);
    await connection.query(
      `INSERT INTO projects
        (id, name, description, manager_id, status, budget, budget_spent, progress, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project.name, project.description || '', managerId, project.status || 'on_track',
        project.totalBudget ?? project.budget ?? 0, project.budget ?? 0, project.progress || 0,
        project.startDate || null, project.dueDate || project.endDate || null]
    );
    for (const milestone of project.milestones || []) {
      await connection.query(
        'INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES (?, ?, ?, ?, ?)',
        [milestone.id || `MLS-${crypto.randomUUID()}`, id, milestone.title, milestone.date || milestone.dueDate, Boolean(milestone.completed)]
      );
    }
    await connection.commit();
    res.status(201).json({ message: 'Projet créé avec succès', projectId: id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la création du projet', details: err.message });
  } finally {
    connection.release();
  }
};

exports.updateProject = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;
  const project = req.body;
  try {
    await connection.beginTransaction();
    const managerId = await findManagerId(connection, project);
    const [result] = await connection.query(
      `UPDATE projects SET
        name = COALESCE(?, name), description = COALESCE(?, description),
        manager_id = COALESCE(?, manager_id), status = COALESCE(?, status),
        budget = COALESCE(?, budget), budget_spent = COALESCE(?, budget_spent),
        progress = COALESCE(?, progress), end_date = COALESCE(?, end_date)
       WHERE id = ?`,
      [project.name ?? null, project.description ?? null, managerId, project.status ?? null,
        project.totalBudget ?? null, project.budget ?? null, project.progress ?? null,
        project.dueDate || project.endDate || null, id]
    );
    if (project.milestones) {
      await connection.query('DELETE FROM milestones WHERE project_id = ?', [id]);
      for (const milestone of project.milestones) {
        await connection.query(
          'INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES (?, ?, ?, ?, ?)',
          [milestone.id || `MLS-${crypto.randomUUID()}`, id, milestone.title, milestone.date || milestone.dueDate, Boolean(milestone.completed)]
        );
      }
    }
    await connection.commit();
    if (result.affectedRows === 0) {
      const [rows] = await connection.query('SELECT id FROM projects WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json({ message: 'Projet mis à jour avec succès' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la mise à jour du projet', details: err.message });
  } finally {
    connection.release();
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du projet', details: err.message });
  }
};

exports.addMilestone = async (req, res) => {
  const id = `MLS-${crypto.randomUUID()}`;
  try {
    await db.query(
      'INSERT INTO milestones (id, project_id, title, due_date, completed) VALUES (?, ?, ?, ?, false)',
      [id, req.params.projectId, req.body.title, req.body.dueDate]
    );
    res.status(201).json({ message: 'Jalon ajouté avec succès', milestoneId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout du jalon', details: err.message });
  }
};

exports.toggleMilestone = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT completed, project_id FROM milestones WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Jalon non trouvé' });
    const completed = !rows[0].completed;
    await db.query('UPDATE milestones SET completed = ? WHERE id = ?', [completed, req.params.id]);
    const [milestones] = await db.query('SELECT completed FROM milestones WHERE project_id = ?', [rows[0].project_id]);
    const progress = Math.round(milestones.filter(item => item.completed).length / milestones.length * 100);
    await db.query('UPDATE projects SET progress = ? WHERE id = ?', [progress, rows[0].project_id]);
    res.json({ message: 'Statut du jalon mis à jour', completed });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du jalon', details: err.message });
  }
};
