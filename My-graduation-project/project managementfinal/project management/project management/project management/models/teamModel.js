const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'taskModel'
    }],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true // Assuming each team must have a manager
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("teamModel", teamSchema);
