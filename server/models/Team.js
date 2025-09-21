const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    minlength: [3, 'Team name must be at least 3 characters'],
    maxlength: [50, 'Team name must be less than 50 characters']
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
  githubRepo: { type: String },
  commitId: { type: String },
  score: { type: Number, default: 0, min: 0 },
  feedback: { type: String, maxlength: [500, 'Feedback must be less than 500 characters'] },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);