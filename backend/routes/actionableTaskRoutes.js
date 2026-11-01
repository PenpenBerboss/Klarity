const express = require('express');
const router = express.Router();
const actionableTaskController = require('../controllers/actionableTaskController');

router.get('/', actionableTaskController.getAll);
router.post('/', actionableTaskController.save);

module.exports = router;
