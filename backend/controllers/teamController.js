const db = require('../config/db');

// Récupérer les membres de l'équipe
exports.getTeamMembers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users ORDER BY name ASC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipe', details: err.message });
  }
};

// Ajouter un membre d'équipe
exports.addTeamMember = async (req, res) => {
  const { name, email, role, load_percentage, status } = req.body;
  const id = `USR-${Date.now().toString().slice(-4)}`;

  try {
    await db.query(
      'INSERT INTO users (id, name, email, role, load_percentage, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, role || 'Développeur Fullstack', load_percentage || 50, status || 'disponible']
    );

    res.status(201).json({ message: 'Membre ajouté avec succès', userId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du membre', details: err.message });
  }
};

// Mettre à jour un membre
exports.updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, role, load_percentage, status } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role), load_percentage = COALESCE(?, load_percentage), status = COALESCE(?, status) WHERE id = ?',
      [name, role, load_percentage, status, id]
    );

    res.json({ message: 'Membre mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message });
  }
};

// Supprimer un membre
exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Membre retiré de l\'équipe' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du membre', details: err.message });
  }
};

// Inviter un membre par email avec lien
exports.inviteMember = async (req, res) => {
  const { email, role } = req.body;
  const inviteToken = `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const userId = `USR-${Date.now().toString().slice(-4)}`;
  const inviteUrl = `${req.protocol}://${req.get('host')}/invite?token=${inviteToken}&email=${encodeURIComponent(email)}`;

  try {
    await db.query(
      'INSERT INTO users (id, name, email, role, load_percentage, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, 'En attente...', email, role || 'Invité', 0, 'invité']
    );

    res.status(201).json({
      message: 'Invitation générée avec succès',
      userId,
      inviteToken,
      inviteUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'invitation', details: err.message });
  }
};

// Réassigner les tâches d'un membre à d'autres membres
exports.reassignMemberTasks = async (req, res) => {
  const { sourceAssigneeId, targetAssigneeId, reassignments } = req.body;

  try {
    if (reassignments && Array.isArray(reassignments)) {
      // Réassignation spécifique par tâche: [{ taskId, targetAssigneeId }]
      for (const item of reassignments) {
        await db.query('UPDATE tasks SET assignee_id = ? WHERE id = ?', [item.targetAssigneeId, item.taskId]);
      }
    } else if (sourceAssigneeId && targetAssigneeId) {
      // Mass reassign
      await db.query('UPDATE tasks SET assignee_id = ? WHERE assignee_id = ?', [targetAssigneeId, sourceAssigneeId]);
    }

    res.json({ message: 'Tâches réassignées avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la réassignation des tâches', details: err.message });
  }
};
