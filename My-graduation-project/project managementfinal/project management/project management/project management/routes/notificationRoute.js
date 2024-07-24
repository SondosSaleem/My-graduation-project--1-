const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

router.get('/user/:userId/notifications', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const notifications = await notificationService.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

router.post('/notifications/one-to-one', async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const notification = await notificationService.createNotificationOneToOne(from, to, message);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

router.post('/notifications/one-to-many', async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const notifications = await notificationService.createNotificationOneToMany(from, to, message);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;