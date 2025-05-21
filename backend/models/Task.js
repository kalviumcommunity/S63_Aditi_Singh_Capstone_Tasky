const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "in progress", "completed"], 
    default: "pending" 
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  category: {
    type: String,
    enum: ["development", "design", "testing", "documentation", "other"],
    default: "other"
  },
  tags: [String],
  estimatedHours: Number,
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }],
  attachments: [attachmentSchema],
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Task", taskSchema);
