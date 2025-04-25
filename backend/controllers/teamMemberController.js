const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

// Get all team members for an admin
const getAllTeamMembers = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware

        // Find all team members associated with this admin
        const teamMembers = await TeamMember.find({ adminId })
            .populate('userId', 'name email') // Populate user details
            .lean();

        return res.status(200).json({
            success: true,
            data: teamMembers
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching team members',
            error: error.message
        });
    }
};

// Add a new team member
const addTeamMember = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Check if user is already a team member
        const existingMember = await TeamMember.findOne({ userId: user._id, adminId });
        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a team member'
            });
        }

        // Create new team member
        const teamMember = await TeamMember.create({
            userId: user._id,
            adminId
        });

        const populatedMember = await TeamMember.findById(teamMember._id)
            .populate('userId', 'name email')
            .lean();

        return res.status(201).json({
            success: true,
            data: populatedMember
        });
    } catch (error) {
        console.error('Error adding team member:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding team member',
            error: error.message
        });
    }
};

// Delete a team member
const deleteTeamMember = async (req, res) => {
    try {
        const adminId = req.user.id;
        const teamMemberId = req.params.id;

        const teamMember = await TeamMember.findOne({
            _id: teamMemberId,
            adminId
        });

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        await TeamMember.deleteOne({ _id: teamMemberId });

        return res.status(200).json({
            success: true,
            message: 'Team member removed successfully'
        });
    } catch (error) {
        console.error('Error deleting team member:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting team member',
            error: error.message
        });
    }
};

module.exports = {
    getAllTeamMembers,
    addTeamMember,
    deleteTeamMember
}; 