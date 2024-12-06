import express from 'express';
import Sale from '../models/saleModel.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create sale
router.post('/', protect, async (req, res) => {
  try {
    const { store, items, total, paymentMethod, paymentDetails } = req.body;

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const sale = await Sale.create({
      store,
      items,
      total,
      paymentMethod,
      paymentDetails,
      status: 'completed'
    });

    const populatedSale = await Sale.findById(sale._id).populate('items.product', 'name price');
    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales by store
router.get('/:storeId', protect, async (req, res) => {
  try {
    const sales = await Sale.find({ store: req.params.storeId })
      .populate('items.product', 'name price')
      .sort('-createdAt');
    res.json(sales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales metrics
router.get('/:storeId/metrics', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      store: req.params.storeId,
      status: 'completed',
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const [totalSales, totalOrders] = await Promise.all([
      Sale.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Sale.countDocuments(query),
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales[0]?.total / totalOrders : 0,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Refund sale
router.post('/:id/refund', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.status === 'refunded') {
      return res.status(400).json({ message: 'Sale is already refunded' });
    }

    // Restore product stock
    for (const item of sale.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    sale.status = 'refunded';
    await sale.save();

    const populatedSale = await Sale.findById(sale._id).populate('items.product', 'name price');
    res.json(populatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;