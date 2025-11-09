// routes/programs.js
import express from "express";
const router = express.Router();
import { Program }  from "../models/index.js"; 
import { verifyToken } from "../src/middleware/auth.js";
import { verifyAdmin } from "../src/middleware/verifyAdmin.js";

// =========================
// GET كل البرامج (أي مستخدم موثق)
// =========================
router.get("/", verifyToken, async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET برنامج واحد بالـ ID
// =========================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: "Program not found" });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// POST إنشاء برنامج جديد (Admins only)
// =========================
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    const program = await Program.create({ name, description, start_date, end_date });
    res.status(201).json({ message: "Program created", program });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// PUT تحديث برنامج (Admins only)
// =========================
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    await program.update(req.body);
    res.json({ message: "Program updated", program });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// DELETE برنامج (Admins only)
// =========================
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    await program.destroy();
    res.json({ message: "Program deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;