const Notification = require('../models/notificationModel');

exports.getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({ to: userId }).populate('from');
    return notifications;
  } catch (error) {
    throw error;
  }
};

exports.createNotificationOneToOne = async (from, to, message) => {
  try {
    const notification = await Notification.create({ from, to, message });
    return notification;
  } catch (error) {
    throw error;
  }
};

exports.createNotificationOneToMany = async (from, to, message) => {
  try {
    const toUsers = Array.isArray(to) ? to : [to];
    const notifications = await Promise.all(
      toUsers.map((userId) => Notification.create({ from, to: userId, message }))
    );
    return notifications;
  } catch (error) {
    throw error;
}
};