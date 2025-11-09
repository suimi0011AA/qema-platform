// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import pool from "./src/config/db.js"; // فقط لتأكيد أن الملف موجود
import jwt from "jsonwebtoken";

dotenv.config();
console.log("🔑 JWT_SECRET from .env =", process.env.JWT_SECRET);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Qema API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));