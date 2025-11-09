// src/controllers/userController.js
import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const listUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, email, created_at FROM users");
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // لو حد بيعدل حساب غير حسابه: (اختياري) — هنا نسمح فقط للمستخدم نفسه أو للـ admin
    if (req.user.id !== Number(id)) {
      // لو عندك roles في الجدول، استبدلي هذا الشرط بالتحقق من الدور
      return res.status(403).json({ message: "Not permitted to update this user" });
    }

    const fields = [];
    const values = [];
    if (name) { fields.push("name = ?"); values.push(name); }
    if (email) { fields.push("email = ?"); values.push(email); }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashed);
    }
    if (!fields.length) return res.status(400).json({ message: "No fields to update" });

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.execute(sql, values);
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== Number(id)) return res.status(403).json({ message: "Not permitted to delete this user" });

    await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};