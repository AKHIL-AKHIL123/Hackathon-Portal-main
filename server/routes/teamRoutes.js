const express = require('express');
const router = express.Router();
const { getTeams, getTeamById, updateTeam } = require('../controllers/teamController');
const authMiddleware = require('../middleware/auth');
const { validate, teamValidations } = require('../middleware/validation');

// Get all teams
router.route('/')
  .get(getTeams);

// Get or update a specific team
router.route('/:id')
  .get(getTeamById)
  .put(
    authMiddleware(['coordinator', 'admin']),   // role-based auth
    validate(teamValidations.update),           // validation middleware
    updateTeam                                  // controller
  );

module.exports = router;
