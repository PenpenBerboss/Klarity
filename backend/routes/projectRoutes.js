const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Jalons
router.post('/:projectId/milestones', projectController.addMilestone);
router.patch('/milestones/:id/toggle', projectController.toggleMilestone);

module.exports = router;
