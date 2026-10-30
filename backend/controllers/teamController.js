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
      [id, name, email, role || 'Développeur Fullstack', load_percentage || 50, status || 'available']
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
