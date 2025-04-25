const User = require('../models/User');
const TeamMember = require('../models/TeamMember');

const addUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user.id; // Changed from _id to id to match the JWT token

    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Check if user is already in admin's team
    const existingTeamMember = await TeamMember.findOne({
      email: email,
      adminId: adminId
    });

    if (existingTeamMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already in your team'
      });
    }

    // Add user to admin's team
    const teamMember = new TeamMember({
      userId: user._id,
      adminId: adminId, // Use the admin's ID from the request
      email: user.email,
      role: 'user'
    });

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'User added to team successfully'
    });

  } catch (error) {
    console.error('Error adding user by email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addUserByEmail
}; 