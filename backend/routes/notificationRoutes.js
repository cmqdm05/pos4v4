import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Notification from '../models/notificationModel.js';

const router = express.Router();

// Get notifications for the current user
router.get('/', protect, async (req, res) => {
  try {
    const query = {
      recipient: req.user._id,
      recipientModel: req.user.store ? 'Staff' : 'User'
    };

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(10);

    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
      recipientModel: req.user.store ? 'Staff' : 'User'
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
      recipientModel: req.user.store ? 'Staff' : 'User'
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create system notification
router.post('/system', protect, async (req, res) => {
  try {
    const { message, type = 'system', store, recipientId, recipientModel } = req.body;
    
    const notification = await Notification.create({
      message,
      type,
      store,
      recipient: recipientId || req.user._id,
      recipientModel: recipientModel || (req.user.store ? 'Staff' : 'User')
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;