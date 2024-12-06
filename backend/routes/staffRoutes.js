import express from "express";
import Staff from "../models/staffModel.js";
import { protect } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// Get staff members by store
router.get("/:storeId", protect, async (req, res) => {
  try {
    const staff = await Staff.find({ store: req.params.storeId })
      .populate("role", "name permissions")
      .select("-password");
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create staff member
router.post("/", protect, async (req, res) => {
  try {
    const { email } = req.body;
    const staffExists = await Staff.findOne({ email });

    if (staffExists) {
      return res.status(400).json({ message: "Staff member already exists" });
    }

    const staff = await Staff.create(req.body);
    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      store: staff.store,
      token: generateToken(staff._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update staff member
router.put("/:id", protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
      staff.name = req.body.name || staff.name;
      staff.email = req.body.email || staff.email;
      staff.role = req.body.role || staff.role;
      staff.status = req.body.status || staff.status;

      if (req.body.password) {
        staff.password = req.body.password;
      }

      const updatedStaff = await staff.save();
      res.json({
        _id: updatedStaff._id,
        name: updatedStaff.name,
        email: updatedStaff.email,
        role: updatedStaff.role,
        store: updatedStaff.store,
        status: updatedStaff.status,
      });
    } else {
      res.status(404).json({ message: "Staff member not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete staff member
router.delete("/:id", protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
      await staff.remove();
      res.json({ message: "Staff member removed" });
    } else {
      res.status(404).json({ message: "Staff member not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Staff login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email }).populate(
      "role",
      "name permissions"
    );

    if (staff && (await staff.matchPassword(password))) {
      staff.lastLogin = new Date();
      await staff.save();

      res.json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        store: staff.store,
        token: generateToken(staff._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
