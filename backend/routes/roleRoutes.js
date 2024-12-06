import express from "express";
import Role from "../models/roleModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get roles by store
router.get("/:storeId", protect, async (req, res) => {
  try {
    const roles = await Role.find({ store: req.params.storeId });
    res.json(roles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create role
router.post("/", protect, async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update role
router.put("/:id", protect, async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      Object.assign(role, req.body);
      const updatedRole = await role.save();
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete role
router.delete("/:id", protect, async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      if (role.isDefault) {
        return res.status(400).json({ message: "Cannot delete default role" });
      }
      await role.remove();
      res.json({ message: "Role removed" });
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
