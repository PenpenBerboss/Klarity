const express = require('express');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingRoutes = require('./routes/settingRoutes');
const actionableTaskRoutes = require('./routes/actionableTaskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/api/uploads/photos', express.static(path.join(__dirname, 'photos'), {
  dotfiles: 'deny',
  index: false,
  maxAge: '1d',
}));

// Routes API
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/actionable-tasks', actionableTaskRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Klarity Express & MySQL opérationnel', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Une erreur interne est survenue sur le serveur API.' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Serveur Backend Klarity en cours d'exécution sur le port ${PORT}`);
  console.log(`🔗 URL API : http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
