import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  console.log("TOKEN FROM HEADER:", token);
  console.log("JWT_SECRET:", JWT_SECRET);

  if (!token) 
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded ID:", decoded.id);

    const user = await User.findByPk(decoded.id);
    console.log("User from DB:", user);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      name: user.name,
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(403).json({ message: "Invalid or expired token", error: err.message });
  }
};