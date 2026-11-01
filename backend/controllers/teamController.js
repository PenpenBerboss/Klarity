const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const db = require('../config/db');

const PHOTO_DIRECTORY = path.join(__dirname, '..', 'photos');
const MAX_PHOTO_SIZE = 1024 * 1024;
const PHOTO_FORMATS = {
  'image/jpeg': { extension: 'jpg', matches: buffer => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  'image/png': { extension: 'png', matches: buffer => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/gif': { extension: 'gif', matches: buffer => buffer.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/) !== null },
  'image/webp': { extension: 'webp', matches: buffer => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' },
};

async function storeAvatar(dataUrl) {
  const match = /^data:(image\/(?:jpeg|png|gif|webp));base64,((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/.exec(dataUrl);
  if (!match) {
    const error = new Error('La photo doit être une image JPG, PNG, GIF ou WebP valide.');
    error.status = 400;
    throw error;
  }

  const [, contentType, encodedImage] = match;
  const image = Buffer.from(encodedImage, 'base64');
  if (image.length === 0 || image.length > MAX_PHOTO_SIZE) {
    const error = new Error('La photo doit peser 1 Mo maximum.');
    error.status = 400;
    throw error;
  }
  if (!PHOTO_FORMATS[contentType].matches(image)) {
    const error = new Error('Le contenu du fichier ne correspond pas au format de l’image.');
    error.status = 400;
    throw error;
  }

  const filename = `${crypto.randomUUID()}.${PHOTO_FORMATS[contentType].extension}`;
  const filePath = path.join(PHOTO_DIRECTORY, filename);
  await fs.mkdir(PHOTO_DIRECTORY, { recursive: true });
  await fs.writeFile(filePath, image, { flag: 'wx', mode: 0o644 });

  return { filePath, publicUrl: `/api/uploads/photos/${filename}` };
}

async function removeStoredAvatar(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Unable to remove an unreferenced profile photo:', error);
    }
  }
}

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
      'SELECT id, name, email, role, department, bio, avatar_url, load_percentage, status FROM users ORDER BY name ASC'
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
  let uploadedAvatarPath;
  try {
    let avatarUrl = member.avatar_url ?? member.avatarUrl ?? null;
    if (typeof avatarUrl === 'string' && avatarUrl.startsWith('data:')) {
      const storedAvatar = await storeAvatar(avatarUrl);
      uploadedAvatarPath = storedAvatar.filePath;
      avatarUrl = storedAvatar.publicUrl;
    }

    const [result] = await db.query(
      `UPDATE users SET
        name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role),
        department = COALESCE(?, department), load_percentage = COALESCE(?, load_percentage),
        status = COALESCE(?, status), bio = COALESCE(?, bio),
        avatar_url = COALESCE(?, avatar_url)
       WHERE id = ?`,
      [member.name ?? null, member.email ?? null, member.role ?? null,
        member.department ?? null, member.capacity ?? member.load_percentage ?? null,
        member.status ? databaseStatus(member) : null, member.bio ?? null,
        avatarUrl, req.params.id]
    );
    if (result.affectedRows === 0) {
      const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        await removeStoredAvatar(uploadedAvatarPath);
        return res.status(404).json({ error: 'Membre introuvable' });
      }
    }
    res.json({ message: 'Membre mis à jour', avatar_url: avatarUrl });
  } catch (err) {
    if (uploadedAvatarPath) await removeStoredAvatar(uploadedAvatarPath);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Erreur lors de la mise à jour', details: err.status ? undefined : err.message });
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
