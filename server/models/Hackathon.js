const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description must be less than 1000 characters']
  },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  registrationDeadline: { type: Date, required: [true, 'Registration deadline is required'] },
  maxTeamSize: { type: Number, required: [true, 'Max team size is required'], min: 1, max: 20, default: 5 },
  rules: [{ type: String, maxlength: [500, 'Rule must be less than 500 characters'] }],
  prizes: [{ type: String, maxlength: [200, 'Prize description must be less than 200 characters'] }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', HackathonSchema);