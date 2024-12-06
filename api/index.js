import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "../backend/routes/authRoutes.js";
import productRoutes from "../backend/routes/productRoutes.js";
import storeRoutes from "../backend/routes/storeRoutes.js";
import categoryRoutes from "../backend/routes/categoryRoutes.js";
import saleRoutes from "../backend/routes/saleRoutes.js";
import discountRoutes from "../backend/routes/discountRoutes.js";
import inventoryRoutes from "../backend/routes/inventoryRoutes.js";
import roleRoutes from "../backend/routes/roleRoutes.js";
import staffRoutes from "../backend/routes/staffRoutes.js";
import notificationRoutes from "../backend/routes/notificationRoutes.js";
import testRoutes from "../backend/routes/testRoute.js";

dotenv.config();

const app = express();

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://admin:admin@pospos.iohkv.mongodb.net/?retryWrites=true&w=majority&appName=pospos",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test", testRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

export default async function handler(req, res) {
  await connectDB();

  return new Promise((resolve, reject) => {
    app(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}