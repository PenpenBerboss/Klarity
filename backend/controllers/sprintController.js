const crypto = require('node:crypto');
const db = require('../config/db');

// Récupérer tous les Sprints
exports.getAllSprints = async (req, res) => {
  try {
    const [sprints] = await db.query('SELECT * FROM sprints ORDER BY start_date DESC');
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des sprints', details: err.message });
  }
};

// Créer un Sprint
exports.createSprint = async (req, res) => {
  const { name, status } = req.body;
  const startDate = req.body.startDate || req.body.start_date;
  const endDate = req.body.endDate || req.body.end_date;
  const id = req.body.id || `SPR-${crypto.randomUUID()}`;

  try {
    await db.query(
      'INSERT INTO sprints (id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [id, name, startDate, endDate, status || 'planned']
    );
    res.status(201).json({ message: 'Sprint créé avec succès', sprintId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du sprint', details: err.message });
  }
};

// Mettre à jour un Sprint
exports.updateSprint = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const startDate = req.body.startDate || req.body.start_date;
  const endDate = req.body.endDate || req.body.end_date;

  try {
    await db.query(
      'UPDATE sprints SET name = COALESCE(?, name), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), status = COALESCE(?, status) WHERE id = ?',
      [name ?? null, startDate ?? null, endDate ?? null, status ?? null, id]
    );
    res.json({ message: 'Sprint mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du sprint', details: err.message });
  }
};

// Supprimer un Sprint (réassignation des tâches au Backlog)
exports.deleteSprint = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE tasks SET sprint_id = NULL WHERE sprint_id = ?', [id]);
    await db.query('DELETE FROM sprints WHERE id = ?', [id]);
    res.json({ message: 'Sprint supprimé et tâches remises au backlog' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du sprint', details: err.message });
  }
};
