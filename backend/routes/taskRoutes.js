const express = require("express");
const router = express.Router();
const {
    createTask,
    assignTask,
  getTasksByUser,
  updateTaskStatus,
  
} = require("../controllers/taskController");


router.get("/user/:userId", getTasksByUser);
router.post("/create", createTask);
router.post("/assign", assignTask);
router.put("/status/:taskId", updateTaskStatus);



module.exports = router;