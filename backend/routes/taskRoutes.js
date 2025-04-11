const express = require("express");
const router = express.Router();
const {
  
  getTasksByUser,
  
} = require("../controllers/taskController");


router.get("/user/:userId", getTasksByUser);
router.post("/create", createTask);


module.exports = router;