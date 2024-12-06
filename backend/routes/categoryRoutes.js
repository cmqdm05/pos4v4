import express from 'express';
import Category from '../models/categoryModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get categories by store
router.get('/:storeId', protect, async (req, res) => {
  try {
    const categories = await Category.find({ store: req.params.storeId });
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create category
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, store } = req.body;
    const category = await Category.create({
      name,
      description,
      store
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;