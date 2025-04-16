const express = require("express");
const router = express.Router();
const {
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

router.post("/create", createEvent);
router.get("/:userId", getUserEvents);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

module.exports = router;
