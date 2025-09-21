const express = require('express');
const router = express.Router();
const { getTeams, getTeamById, updateTeam } = require('../controllers/teamController');
const authMiddleware = require('../middleware/auth');
const { validateTeamUpdate } = require('../middleware/validation'); // Assuming you will add this validation

router.route('/')
  .get(getTeams);

router.route('/:id')
  .get(getTeamById)
  // Apply the same spread operator pattern for validation
  .put(authMiddleware(['coordinator', 'admin']), ...validateTeamUpdate, updateTeam);

module.exports = router;