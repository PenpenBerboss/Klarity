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
  const theme = req.body.theme;
  const accent_color = req.body.accent_color ?? req.body.accentColor;
  const density = req.body.density;
  const email_notifications = req.body.email_notifications ?? req.body.emailNotifications;
  const push_notifications = req.body.push_notifications ?? req.body.pushNotifications;
  const timezone = req.body.timezone;
  const language = req.body.language;
  const date_format = req.body.date_format ?? req.body.dateFormat;

  try {
    await db.query(
      `INSERT INTO user_settings
         (user_id, theme, accent_color, density, language, timezone, date_format, email_notifications, push_notifications)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         theme = COALESCE(?, theme),
         accent_color = COALESCE(?, accent_color),
         density = COALESCE(?, density),
         language = COALESCE(?, language),
         timezone = COALESCE(?, timezone),
         date_format = COALESCE(?, date_format),
         email_notifications = COALESCE(?, email_notifications),
         push_notifications = COALESCE(?, push_notifications)`,
      [userId, theme || 'system', accent_color || 'indigo', density || 'comfortable',
        language || 'fr', timezone || 'Africa/Douala', date_format || 'DD/MM/YYYY',
        email_notifications ?? true, push_notifications ?? true,
        theme, accent_color, density, language, timezone, date_format, email_notifications, push_notifications]
    );

    res.json({ message: 'Paramètres mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres', details: err.message });
  }
};
