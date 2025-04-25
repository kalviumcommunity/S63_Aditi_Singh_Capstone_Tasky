const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { getAllTeamMembers, addTeamMember, deleteTeamMember } = require('../controllers/teamMemberController');

// Protected routes - requires authentication
router.get('/', authenticate, getAllTeamMembers);
router.post('/', authenticate, addTeamMember);
router.delete('/:id', authenticate, deleteTeamMember);

module.exports = router; 