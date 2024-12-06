import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import StockMovement from "../models/stockMovementModel.js";
import StockAlert from "../models/stockAlertModel.js";
import Product from "../models/productModel.js";

const router = express.Router();

// Get stock movements by store
router.get("/movements/:storeId", protect, async (req, res) => {
  try {
    const movements = await StockMovement.find({
      store: req.params.storeId,
    }).sort("-createdAt");
    res.json(movements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add stock movement
router.post("/movements", protect, async (req, res) => {
  try {
    const { product, type, quantity, reason, store } = req.body;

    // Create stock movement
    const movement = await StockMovement.create({
      product,
      type,
      quantity,
      reason,
      store,
    });

    // Update product stock
    const productDoc = await Product.findById(product);
    if (productDoc) {
      productDoc.stock += quantity;
      await productDoc.save();

      // Check for stock alerts
      if (productDoc.stock <= 0) {
        await StockAlert.create({
          product,
          store,
          type: "out_of_stock",
          threshold: 0,
          status: "active",
        });
      } else if (productDoc.stock <= 10) {
        // Configurable threshold
        await StockAlert.create({
          product,
          store,
          type: "low_stock",
          threshold: 10,
          status: "active",
        });
      }
    }

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get stock alerts by store
router.get("/alerts/:storeId", protect, async (req, res) => {
  try {
    const alerts = await StockAlert.find({
      store: req.params.storeId,
      status: "active",
    }).sort("-createdAt");
    res.json(alerts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stock alert
router.put("/alerts/:id", protect, async (req, res) => {
  try {
    const alert = await StockAlert.findById(req.params.id);
    if (alert) {
      alert.status = req.body.status || alert.status;
      const updatedAlert = await alert.save();
      res.json(updatedAlert);
    } else {
      res.status(404).json({ message: "Alert not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
