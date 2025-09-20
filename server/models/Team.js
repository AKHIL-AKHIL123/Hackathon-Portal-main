const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
  githubRepo: { type: String },
  commitId: { type: String },
  score: { type: Number },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);