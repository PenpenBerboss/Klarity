const crypto = require('node:crypto');
const db = require('../config/db');

function databaseStatus(member) {
  if (member.status === 'invité' || member.status === 'invited') return 'invited';
  const capacity = Number(member.capacity ?? member.load_percentage ?? 0);
  if (capacity >= 100) return 'busy';
  if (capacity <= 0) return 'away';
  return 'available';
}

exports.getTeamMembers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, department, load_percentage, status FROM users ORDER BY name ASC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l’équipe', details: err.message });
  }
};

exports.addTeamMember = async (req, res) => {
  const member = req.body;
  const id = String(member.id || `USR-${crypto.randomUUID()}`);
  try {
    await db.query(
      `INSERT INTO users (id, name, email, role, department, load_percentage, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, member.name, member.email, member.role || 'Développeur Fullstack',
        member.department || 'Général', Number(member.capacity ?? member.load_percentage ?? 0), databaseStatus(member)]
    );
    res.status(201).json({ message: 'Membre ajouté avec succès', userId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout du membre', details: err.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  const member = req.body;
  try {
    const [result] = await db.query(
      `UPDATE users SET
        name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role),
        department = COALESCE(?, department), load_percentage = COALESCE(?, load_percentage),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [member.name ?? null, member.email ?? null, member.role ?? null,
        member.department ?? null, member.capacity ?? member.load_percentage ?? null,
        member.status ? databaseStatus(member) : null, req.params.id]
    );
    if (result.affectedRows === 0) {
      const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Membre introuvable' });
    }
    res.json({ message: 'Membre mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Membre retiré de l’équipe' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du membre', details: err.message });
  }
};

exports.inviteMember = async (req, res) => {
  const { email, role } = req.body;
  const id = `USR-${crypto.randomUUID()}`;
  const inviteToken = `INV-${crypto.randomUUID()}`;
  try {
    await db.query(
      `INSERT INTO users (id, name, email, role, department, load_percentage, status)
       VALUES (?, 'En attente...', ?, ?, 'En attente', 0, 'invited')`,
      [id, email, role || 'Invité']
    );
    const inviteUrl = `${req.protocol}://${req.get('host')}/invite?token=${inviteToken}&email=${encodeURIComponent(email)}`;
    res.status(201).json({ message: 'Invitation générée avec succès', userId: id, inviteToken, inviteUrl });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l’invitation', details: err.message });
  }
};

exports.reassignMemberTasks = async (req, res) => {
  const { sourceAssigneeId, targetAssigneeId, reassignments } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    if (Array.isArray(reassignments)) {
      for (const item of reassignments) {
        const [users] = await connection.query(
          'SELECT id FROM users WHERE id = ? OR name = ? LIMIT 1',
          [item.newAssignee || item.targetAssigneeId, item.newAssignee || item.targetAssigneeId]
        );
        if (!users.length) throw new Error(`Membre introuvable: ${item.newAssignee || item.targetAssigneeId}`);
        await connection.query('UPDATE tasks SET assignee_id = ? WHERE id = ?', [users[0].id, item.taskId]);
      }
    } else if (sourceAssigneeId && targetAssigneeId) {
      await connection.query('UPDATE tasks SET assignee_id = ? WHERE assignee_id = ?', [targetAssigneeId, sourceAssigneeId]);
    }
    await connection.commit();
    res.json({ message: 'Tâches réassignées avec succès' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la réassignation des tâches', details: err.message });
  } finally {
    connection.release();
  }
};
