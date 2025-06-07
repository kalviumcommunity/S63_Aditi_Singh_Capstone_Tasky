const Task = require("../models/Task");
const multer = require('multer');
const path = require('path');
const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose'); // Import mongoose

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tasks')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// New function to mark tasks as overdue
const updateOverdueTasks = async (userId = null) => {
  const now = new Date();
  const filter = {
    status: 'pending',
    dueDate: { $lt: now },
  };

  // If a userId is provided, filter overdue tasks relevant to that user
  if (userId) {
    filter.$or = [
      { assignedTo: new mongoose.Types.ObjectId(userId) },
      { createdBy: new mongoose.Types.ObjectId(userId) }
    ];
  }

  try {
    const result = await Task.updateMany(
      filter,
      { $set: { status: 'overdue' } }
    );
    console.log(`Marked ${result.nModified} tasks as overdue for user ${userId || 'all'}.`);
  } catch (error) {
    console.error('Error marking overdue tasks:', error);
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    // Call updateOverdueTasks before fetching tasks for user
    await updateOverdueTasks(req.params.userId);
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('dependencies', 'title status');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks for the user' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    // Get the logged-in admin's user ID (using req.user.id)
    const adminUserId = req.user.id; // Corrected from _id to id
    console.log('Fetching tasks for admin userId:', adminUserId); // Log the user ID

    // Call updateOverdueTasks for the admin before fetching all tasks
    await updateOverdueTasks(adminUserId);

    // Find tasks created by the admin user
    const filter = { createdBy: adminUserId };
    console.log('Applying filter:', filter); // Log the filter

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('dependencies', 'title status');

    console.log('Found tasks:', tasks.length); // Log the number of tasks found

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching admin tasks:', error);
    res.status(500).json({ error: 'Failed to fetch admin tasks' });
  }
};

exports.createTask = async (req, res) => {
  // 1. Check for authenticated user using session
  if (!req.session || !req.session.user || !req.session.user._id) {
    console.error('Error creating task: User not authenticated (Session check failed).');
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  let taskData;
  // Safely Parse req.body.task
  try {
    if (!req.body.task) {
       console.error('Error creating task: req.body.task is missing.');
       return res.status(400).json({ error: 'Task data is missing from request body.' });
    }
    taskData = JSON.parse(req.body.task);
  } catch (error) {
    console.error('Error parsing task JSON:', error);
    return res.status(400).json({ error: 'Invalid task data format.' });
  }

  // Extract Data and Robust Parsing for Nested Fields
  const {
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    category,
    tags,
    estimatedHours,
    dependencies
  } = taskData;

  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      // Ensure dueDate is a valid Date object
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      category,
      // Safely ensure tags and dependencies are arrays
      tags: Array.isArray(tags) ? tags : [],
      estimatedHours,
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      // Include createdBy from session user
      createdBy: req.session.user._id // Use session user ID
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error saving task to database:', error);
    // Improve Error Responses
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Task validation errors:', messages);
      return res.status(400).json({ error: messages });
    } else if (error.kind === 'ObjectId') {
       console.error('Invalid ObjectId in task data:', error.message);
       return res.status(400).json({ error: 'Invalid ID format for assigned user or dependencies.' });
    } else {
      // For other errors, send a generic 500 response
      res.status(500).json({ error: 'Failed to create task due to server error.' });
    }
  }
};

exports.addAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.attachments.push({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      uploadedBy: req.user._id
    });

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({ error: 'Failed to add attachment' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.comments.push({
      user: req.user._id,
      content
    });

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;

    if (!taskId || !userId) {
      return res.status(400).json({ error: 'taskId and userId are required' });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// Update Task (Admin)
exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  // You might want to add validation or restrictions on what fields can be updated
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    task,
  });
});

// Delete Task (Admin)
exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task Deleted Successfully",
  });
});

// Get Task Details
exports.getTaskDetails = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('dependencies', 'title status');

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  res.status(200).json({
    success: true,
    task,
  });
});

// New function to get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is correctly populated from JWT

    // Mark overdue tasks before calculating stats
    await updateOverdueTasks(userId);

    const now = new Date();

    // Aggregation pipeline to get task statistics
    const filter = { assignedTo: userId }; // Always filter by assignedTo
    console.log('Applying filter for task stats:', filter); // Add logging

    // Get total tasks
    const totalTasks = await Task.countDocuments(filter);

    // Get completed tasks
    const completedTasks = await Task.countDocuments({ ...filter, status: 'completed' });

    // Get pending tasks
    const pendingTasks = await Task.countDocuments({ ...filter, status: 'pending' });

    // Get in progress tasks
    const inProgressTasks = await Task.countDocuments({ ...filter, status: 'in progress' });

    // Get overdue tasks (tasks that are pending and past due date)
    const overdueTasks = await Task.countDocuments({
      ...filter,
      status: 'pending',
      dueDate: { $lt: now }
    });

    console.log('Fetched stats:', { totalTasks, completedTasks, pendingTasks, overdueTasks }); // Add logging

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
};

// New function to get admin task progress statistics (Restored and Corrected)
exports.getAdminTaskProgress = async (req, res) => {
  try {
    // Get the logged-in admin's user ID (using req.user.id)
    const adminUserId = req.user.id; // Corrected from _id to id

    // Define the filter for tasks created by or assigned to the admin
    const filter = {
      $or: [
        { createdBy: adminUserId },
        { assignedTo: adminUserId }
      ]
    };

    // Calculate overall completion
    const totalTasks = await Task.countDocuments(filter);
    const completedTasks = await Task.countDocuments({ ...filter, status: 'completed' });
    const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate this week's completion
    const startOfTodayUTC = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    const startOfWeekUTC = new Date(startOfTodayUTC);
    startOfWeekUTC.setUTCDate(startOfTodayUTC.getUTCDate() - startOfTodayUTC.getUTCDay()); // Adjust to the start of the week (Sunday)

    const weeklyFilter = {
      ...filter,
      createdAt: { $gte: startOfWeekUTC }
    };

    const totalWeeklyTasks = await Task.countDocuments(weeklyFilter);
    const completedWeeklyTasks = await Task.countDocuments({ ...weeklyFilter, status: 'completed' });
    const weeklyCompletion = totalWeeklyTasks > 0 ? Math.round((completedWeeklyTasks / totalWeeklyTasks) * 100) : 0;

    res.status(200).json({
      overallCompletion,
      weeklyCompletion
    });
  } catch (error) {
    console.error('Error fetching admin task progress:', error);
    res.status(500).json({ error: 'Failed to fetch admin task progress' });
  }
};

      