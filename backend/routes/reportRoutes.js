const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { getReportSummary } = require("../controllers/reportController");
const { isAuthenticated, authorizeRoles, authenticate } = require("../middlewares/auth");

// Route for generating reports (daily/weekly/monthly) for a given user
router.get("/:type", authenticate, reportController.generateReport);

router.route("/summary").get(isAuthenticated, authorizeRoles("admin"), getReportSummary);

// Route to insert dummy tasks (for testing)
router.post("/insert-dummy", reportController.insertDummyTasks);

module.exports = router;
