const db = require('../config/db');

// Récupérer les paramètres d'un utilisateur
exports.getUserSettings = async (req, res) => {
  const userId = req.query.userId || 'USR-1';
  try {
    const [settings] = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    if (settings.length === 0) {
      return res.json({ theme: 'system', accent_color: 'indigo', density: 'comfortable', email_notifications: true, push_notifications: true });
    }
    res.json(settings[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des paramètres', details: err.message });
  }
};

// Mettre à jour les paramètres d'un utilisateur
exports.updateUserSettings = async (req, res) => {
  const userId = req.body.userId || 'USR-1';
  const { theme, accent_color, density, email_notifications, push_notifications } = req.body;

  try {
    await db.query(
      `INSERT INTO user_settings (user_id, theme, accent_color, density, email_notifications, push_notifications)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         theme = COALESCE(?, theme),
         accent_color = COALESCE(?, accent_color),
         density = COALESCE(?, density),
         email_notifications = COALESCE(?, email_notifications),
         push_notifications = COALESCE(?, push_notifications)`,
      [userId, theme || 'system', accent_color || 'indigo', density || 'comfortable', email_notifications ?? true, push_notifications ?? true, theme, accent_color, density, email_notifications, push_notifications]
    );

    res.json({ message: 'Paramètres mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres', details: err.message });
  }
};
