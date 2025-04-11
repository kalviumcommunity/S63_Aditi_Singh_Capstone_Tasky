const Task = require("../models/Task");

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
