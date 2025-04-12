const Event = require("../models/Event");

// Create a new event
exports.createEvent = async (req, res) => {
  const { userId, title, description, date, time, reminder } = req.body;
  try {
    const event = new Event({ userId, title, description, date, time, reminder });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all events for a user
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
