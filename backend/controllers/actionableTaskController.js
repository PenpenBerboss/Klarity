const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT id, title, project, assignee, status, reason, impact FROM actionable_tasks ORDER BY created_at DESC'
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes', details: err.message });
  }
};

exports.save = async (req, res) => {
  const task = req.body;
  try {
    await db.query(
      `INSERT INTO actionable_tasks (id, title, project, assignee, status, reason, impact)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), project = VALUES(project),
         assignee = VALUES(assignee), status = VALUES(status), reason = VALUES(reason), impact = VALUES(impact)`,
      [task.id, task.title, task.project, task.assignee, task.status, task.reason, task.impact]
    );
    res.json({ message: 'Alerte enregistrée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’alerte', details: err.message });
  }
};
