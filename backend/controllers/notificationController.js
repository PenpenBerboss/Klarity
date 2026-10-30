const db = require('../config/db');

// Récupérer les notifications d'un utilisateur
exports.getNotifications = async (req, res) => {
  const userId = req.query.userId || 'USR-1';
  try {
    const [notifications] = await db.query(
      'SELECT id, type, title, message, is_read AS `read`, link, created_at AS timestamp FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications', details: err.message });
  }
};

// Créer une notification
exports.createNotification = async (req, res) => {
  const { user_id, type, title, message, link } = req.body;
  const id = `NTF-${Date.now().toString().slice(-4)}`;

  try {
    await db.query(
      'INSERT INTO notifications (id, user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?, ?)',
      [id, user_id || 'USR-1', type || 'system', title, message, link || '#']
    );
    res.status(201).json({ message: 'Notification créée', notificationId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la notification', details: err.message });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    res.json({ message: 'Notification marquée comme lue' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du marquage', details: err.message });
  }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
  const userId = req.body.userId || 'USR-1';
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du marquage', details: err.message });
  }
};

// Effacer toutes les notifications
exports.clearAllNotifications = async (req, res) => {
  const userId = req.body.userId || 'USR-1';
  try {
    await db.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
    res.json({ message: 'Toutes les notifications ont été effacées' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'effacement', details: err.message });
  }
};
