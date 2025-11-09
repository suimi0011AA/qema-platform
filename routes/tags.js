import express from 'express';
const router = express.Router();
import { Tag } from '../models/index.js';

// GET كل الـ Tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Tag واحدة
router.get('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST إنشاء Tag جديدة
router.post('/', async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT تحديث Tag
router.put('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        await tag.update(req.body);
        res.json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Tag
router.delete('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        await tag.destroy();
        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;