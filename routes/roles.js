import express from 'express';
const router = express.Router();
import { Role } from '../models/index.js';

// GET كل الـ Roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Role واحدة بالـ ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST إنشاء Role جديدة
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const newRole = await Role.create({ name });
        res.status(201).json(newRole);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT تحديث Role
router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        await role.update({ name: req.body.name });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE حذف Role
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        await role.destroy();
        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;