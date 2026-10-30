const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getTeamMembers);
router.post('/', teamController.addTeamMember);
router.post('/invite', teamController.inviteMember);
router.post('/reassign-tasks', teamController.reassignMemberTasks);
router.put('/:id', teamController.updateTeamMember);
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;
