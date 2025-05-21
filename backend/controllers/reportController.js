const Task = require("../models/Task");
const User = require("../models/User");
const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');

exports.generateReport = async (req, res) => {
  const { type, userId } = req.params;
  const now = new Date();
  let startDate;

  if (type === "daily") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
  } else if (type === "weekly") {
    startDate = new Date(now.setDate(now.getDate() - 7));
  } else if (type === "monthly") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  } else {
    return res.status(400).json({ message: "Invalid report type" });
  }

  const tasks = await Task.find({
    assignedTo: userId,
    createdAt: { $gte: startDate },
  });

  res.json(tasks);
};

exports.getReportSummary = catchAsyncErrors(async (req, res, next) => {
  const { userId, priority } = req.query; // Get filters from query parameters

  // Build match condition based on filters
  const matchCondition = {};
  if (userId) {
    matchCondition.assignedTo = userId;
  }
  if (priority) {
    matchCondition.priority = priority;
  }

  // Task Status Summary
  const taskStatusSummary = await Task.aggregate([
    { $match: matchCondition }, // Apply filter
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1
      }
    }
  ]);

  // Task Priority Summary
  const taskPrioritySummary = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        priority: "$_id",
        count: 1
      }
    }
  ]);

  // Overdue Tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = await Task.find({
    ...matchCondition, // Apply filter
    dueDate: { $lt: today },
    status: { $ne: "Completed" }
  }).populate('assignedTo', 'name email');

  // User Task Summary Table
  const userTaskSummary = await Task.aggregate([
    { $match: matchCondition }, // Apply filter
    {
      $group: {
        _id: "$assignedTo",
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
        pendingTasks: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        // Assuming 'In Progress' tasks are neither completed nor pending
        inProgressTasks: { $sum: { $cond: [{ $and: [{ $ne: ["$status", "Completed"] }, { $ne: ["$status", "Pending"] }] }, 1, 0] } },
      }
    },
    {
      $lookup: {
        from: "users", // The name of the users collection
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    {
      $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true }
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        userName: "$userInfo.name",
        userEmail: "$userInfo.email",
        totalTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        inProgressTasks: 1,
      }
    }
  ]);

  // This Week's Task Count
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeeksTasksCount = await Task.countDocuments({
    ...matchCondition, // Apply filter
    createdAt: { $gte: oneWeekAgo }
  });

  res.status(200).json({
    success: true,
    taskStatusSummary,
    taskPrioritySummary,
    overdueTasks,
    userTaskSummary,
    thisWeeksTasksCount,
  });
});
