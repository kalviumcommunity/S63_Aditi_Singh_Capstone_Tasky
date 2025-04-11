const Task = require("../models/Task");


exports.getTasksByUser = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
};


exports.createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const task = new Task({ title, description, dueDate });
    await task.save();
    res.status(201).json(task);
  };