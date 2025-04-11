const Task = require("../models/Task");


exports.getTasksByUser = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
};


