// src/routes/userRoutes.js
import express from "express";
import { listUsers, getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, listUsers);         // عرض المستخدمين (محمي)
router.get("/:id", verifyToken, getUser);        // عرض مستخدم محدد (محمي)
router.put("/:id", verifyToken, updateUser);     // تعديل (محمي)
router.delete("/:id", verifyToken, deleteUser);  // حذف (محمي)

export default router;