const Notification = require("../models/Notification");

exports.getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.userId });
  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json(notification);
};
