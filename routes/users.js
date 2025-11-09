// routes/users.js
import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import { User, Role } from "../models/index.js";
import { verifyToken } from "../src/middleware/auth.js";
import { verifyAdmin } from "../src/middleware/verifyAdmin.js";

// =========================
// GET جميع المستخدمين - للمسؤول فقط
// =========================
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Role, attributes: ["name"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET مستخدم واحد بالـ ID (يتطلب توكن)
// =========================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Role, attributes: ["name"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// POST تسجيل مستخدم جديد (Register)
// =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // التحقق إذا البريد موجود مسبقاً
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // تشفير كلمة المرور
    const password_hash = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const newUser = await User.create({
      name,
      email,
      password_hash,
      role_id: role_id || 1, // 1 = editor افتراضي
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// PUT تحديث بيانات مستخدم (يتطلب توكن)
// =========================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // فقط المستخدم نفسه أو الأدمن يمكنه التحديث
    if (req.user.role_id !== 2 && req.user.id !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    let updates = { name, email };
    if (password) updates.password_hash = await bcrypt.hash(password, 10);
    if (role_id && req.user.role_id === 2) updates.role_id = role_id; // الأدمن فقط

    await user.update(updates);
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// DELETE حذف مستخدم (يتطلب توكن)
// =========================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // فقط المستخدم نفسه أو الأدمن يمكنه الحذف
    if (req.user.role_id !== 2 && req.user.id !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// DELETE كل المستخدمين - للمسؤول فقط (للتجارب)
// =========================
router.delete("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.destroy({ where: {}, truncate: true });
    res.json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;