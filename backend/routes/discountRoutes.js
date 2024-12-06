import express from 'express';
import Discount from '../models/discountModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get discounts by store
router.get('/:storeId', protect, async (req, res) => {
  try {
    const discounts = await Discount.find({ store: req.params.storeId })
      .sort('-createdAt');
    res.json(discounts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create discount
router.post('/', protect, async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update discount
router.put('/:id', protect, async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (discount) {
      Object.assign(discount, req.body);
      const updatedDiscount = await discount.save();
      res.json(updatedDiscount);
    } else {
      res.status(404).json({ message: 'Discount not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete discount
router.delete('/:id', protect, async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (discount) {
      await discount.remove();
      res.json({ message: 'Discount removed' });
    } else {
      res.status(404).json({ message: 'Discount not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;