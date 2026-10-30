const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getTeamMembers);
router.post('/', teamController.addTeamMember);
router.put('/:id', teamController.updateTeamMember);

module.exports = router;
