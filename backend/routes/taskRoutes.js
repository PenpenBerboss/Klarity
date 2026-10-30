const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/reassign-bulk', taskController.reassignTasksBulk);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/duplicate', taskController.duplicateTask);

// Commentaires
router.post('/:taskId/comments', taskController.addComment);

module.exports = router;
