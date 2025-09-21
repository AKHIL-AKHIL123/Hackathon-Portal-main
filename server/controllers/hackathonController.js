const Hackathon = require('../models/Hackathon');
const asyncHandler = require('express-async-handler');

// @desc    Create a new hackathon
// @route   POST /api/hackathons
// @access  Private/Admin
exports.createHackathon = asyncHandler(async (req, res) => {
  const newHackathon = new Hackathon(req.body);
  await newHackathon.save();
  res.status(201).json(newHackathon);
});

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = asyncHandler(async (req, res) => {
  const hackathons = await Hackathon.find().populate('projects');
  res.json(hackathons);
});

// @desc    Get a single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
exports.getHackathonById = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id).populate('projects');
  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found' });
  }
  res.json(hackathon);
});

// @desc    Update a hackathon
// @route   PUT /api/hackathons/:id
// @access  Private/Admin
exports.updateHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );
  
  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }
  
  res.json(hackathon);
});

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private/Admin
exports.deleteHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);
  
  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  await hackathon.deleteOne();
  res.json({ message: 'Hackathon removed' });
});