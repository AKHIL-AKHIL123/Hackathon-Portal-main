const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  requirements: [{ type: String }],
  techStack: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);