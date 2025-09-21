const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Project description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  difficulty: { 
    type: String, 
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: '{VALUE} is not a valid difficulty level'
    },
    required: true,
    default: 'Medium'
  },
  category: { 
    type: String, 
    required: [true, 'Project category is required'],
    trim: true
  },
  requirements: [{ 
    type: String,
    trim: true,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  techStack: [{ 
    type: String,
    trim: true,
    maxlength: [50, 'Technology name cannot exceed 50 characters']
  }],
  status: {
    type: String,
    enum: {
      values: ['draft', 'active', 'completed', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft'
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Project must allow at least 1 participant'],
    max: [10, 'Project cannot have more than 10 participants'],
    default: 4
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Project', ProjectSchema);