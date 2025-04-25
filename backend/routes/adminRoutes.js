const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const adminController = require('../controllers/adminController');

// Protect all admin routes
router.use(authenticate);
router.use(authorizeRoles('admin'));

// Stats route
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalProjects: await Project.countDocuments(),
      completedTasks: await Task.countDocuments({ status: 'completed' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

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