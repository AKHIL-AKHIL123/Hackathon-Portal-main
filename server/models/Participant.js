// models/Participant.js
const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  phone: { type: String, required: true },
  team: { type: String, required: true },
  teamMembers: [{ type: String }], // array of team member names
}, { timestamps: true });

module.exports = mongoose.model('Participant', ParticipantSchema);
