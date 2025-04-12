const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");

router.get("/:type/:userId", generateReport); // type = daily, weekly, monthly

module.exports = router;
