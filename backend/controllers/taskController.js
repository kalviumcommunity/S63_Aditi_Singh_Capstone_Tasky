const Task = require("../models/Task");


exports.getTasksByUser = async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.params.userId });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks for the user' });
    }
  };
  


exports.createTask = async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      const task = new Task({ title, description, dueDate });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  };
  

  
  exports.assignTask = async (req, res) => {
    try {
      const { taskId, userId } = req.body;
  
      // Validate input
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
  // put

  
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
  

      exports.deleteTask = async (req, res) => {
        try {
          const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
          if (!deletedTask) return res.status(404).json({ message: "Task not found" });
          res.json({ message: "Task deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };