const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  hostedLink: {
    type: String,
    required: true,
  },
  media: [String], // We'll store file paths
  mentor: {
    type: String,
    required: false,
    default: "Not Assigned",
  },
  sdgs: {
    type: [String],
    required: true,
  },
  teammates: {
    type: [String],
    required: true,
  },
  techStack: {
    type: [String],
    required: true,
  },
  category: {
    // Add this new field
    type: String,
    required: true,
    enum: ["Game", "Website", "Video", "Documentary", "Digital Art"], // Optional: restricts to specific values
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rating: {
    type: Number,
    default: 0.1,
  },
  ratedBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", //change this to pending later when admin page is ready
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
