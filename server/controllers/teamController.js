const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({})
    .populate('members', 'name email')
    .populate('project', 'title');
  res.json(teams);
});

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('members', 'name email')
    .populate('project', 'title');

  if (team) {
    res.json(team);
  } else {
    res.status(404);
    throw new Error('Team not found');
  }
});

// @desc    Update a team (e.g., assign project, coordinator)
// @route   PUT /api/teams/:id
// @access  Private/Coordinator
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (team) {
    team.project = req.body.project || team.project;
    team.coordinator = req.body.coordinator || team.coordinator;
    // add more updatable fields if needed

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } else {
    res.status(404);
    throw new Error('Team not found');
  }
});

module.exports = {
  getTeams,
  getTeamById,
  updateTeam,
};
