const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only be added once to an admin's team
teamMemberSchema.index({ userId: 1, adminId: 1 }, { unique: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember; 