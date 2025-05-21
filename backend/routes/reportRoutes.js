const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");
const { getReportSummary } = require("../controllers/reportController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

router.get("/:type/:userId", generateReport);

router.route("/summary").get(isAuthenticated, authorizeRoles("admin"), getReportSummary);

module.exports = router;
