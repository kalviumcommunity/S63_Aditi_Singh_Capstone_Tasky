const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    createTask,
    assignTask,
  getTasksByUser,
  updateTaskStatus,
  addAttachment,
  addComment,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskDetails,
  getTaskStats
} = require("../controllers/taskController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");
const { isAuthenticated } = require("../middlewares/auth");

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

router.get("/user/:userId", authenticate, getTasksByUser);
router.get("/all", authenticate, authorizeRoles("admin"), getAllTasks);
router.post("/create", isAuthenticated, authorizeRoles("admin"), upload.none(), createTask);
router.post("/assign", assignTask);
router.put("/status/:taskId", authenticate, updateTaskStatus);
router.post("/:taskId/attachments", upload.single('file'), addAttachment);
router.post("/:taskId/comments", addComment);
router.route("/admin/task/:id").put(isAuthenticated, authorizeRoles("admin"), updateTask);
router.route("/admin/task/:id").delete(isAuthenticated, authorizeRoles("admin"), deleteTask);
router.route("/task/:id").get(isAuthenticated, getTaskDetails);
router.get("/stats", authenticate, getTaskStats);

module.exports = router;