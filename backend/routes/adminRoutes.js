const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const adminController = require('../controllers/adminController');
const taskController = require('../controllers/taskController');
const TeamMember = require('../models/TeamMember');

// Protect all admin routes
router.use(authenticate);
router.use(authorizeRoles('admin'));

// Stats route
router.get('/stats', async (req, res) => {
  try {
    const adminUserId = req.user.id;

    // Count tasks created by this admin
    const totalCreatedTasks = await Task.countDocuments({ createdBy: adminUserId });
    const completedCreatedTasks = await Task.countDocuments({ createdBy: adminUserId, status: 'completed' });
    const inProgressCreatedTasks = await Task.countDocuments({ createdBy: adminUserId, status: 'in progress' });
    
    // Count users managed by this admin (team members)
    const managedUsersCount = await TeamMember.countDocuments({ adminId: adminUserId });

    const stats = {
      totalTasks: totalCreatedTasks,
      completedTasks: completedCreatedTasks,
      inProgressTasks: inProgressCreatedTasks,
      totalUsers: managedUsersCount,
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// New route for admin task progress
router.get('/task-progress', taskController.getAdminTaskProgress);

// Recent activity route
router.get('/recent-activity', async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
});

// Add user by email
router.post('/users/add-by-email', adminController.addUserByEmail);

module.exports = router; 