const Project = require('../models/Project');
const Hackathon = require('../models/Hackathon');
const asyncHandler = require('express-async-handler');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin or Coordinator
const createProject = asyncHandler(async (req, res) => {
  const { title, description, difficulty, category, hackathonId } = req.body;

  const project = new Project({
    title,
    description,
    difficulty,
    category,
  });

  const createdProject = await project.save();

  // If a hackathonId is provided, add this project to it
  if (hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (hackathon) {
      hackathon.projects.push(createdProject._id);
      await hackathon.save();
    }
  }

  res.status(201).json(createdProject);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
});

module.exports = {
  createProject,
  getProjects,
};