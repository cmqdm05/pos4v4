import express from 'express';
import Store from '../models/storeModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create store
router.post('/', protect, async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const store = await Store.create({
      name,
      address,
      phone,
      owner: req.user._id
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's stores
router.get('/', protect, async (req, res) => {
  try {
    // If staff, return only their assigned store
    if (req.user.store) {
      const store = await Store.findById(req.user.store);
      res.json([store]);
    } else {
      // If regular user, return all their stores
      const stores = await Store.find({ owner: req.user._id });
      res.json(stores);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get store by id
router.get('/:id', protect, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user is authorized to access this store
    if (req.user.store) {
      // Staff can only access their assigned store
      if (req.user.store.toString() !== store._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to access this store' });
      }
    } else {
      // Regular users can only access their owned stores
      if (store.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to access this store' });
      }
    }

    res.json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update store
router.put('/:id', protect, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Only store owner can update store
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this store' });
    }

    store.name = req.body.name || store.name;
    store.address = req.body.address || store.address;
    store.phone = req.body.phone || store.phone;

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete store
router.delete('/:id', protect, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Only store owner can delete store
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this store' });
    }

    await store.remove();
    res.json({ message: 'Store removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;