const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assumes you have a User model
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // assumes you have a Project model
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // coordinator is also a user
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
