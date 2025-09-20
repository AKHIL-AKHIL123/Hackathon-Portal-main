const Hackathon = require('../models/Hackathon');

// @desc    Create a new hackathon
// @route   POST /api/hackathons
// @access  Private/Admin
exports.createHackathon = async (req, res) => {
  try {
    const newHackathon = new Hackathon(req.body);
    await newHackathon.save();
    res.status(201).json(newHackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().populate('projects');
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('projects');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a hackathon
// @route   PUT /api/hackathons/:id
// @access  Private/Admin
exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private/Admin
exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json({ message: 'Hackathon removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};