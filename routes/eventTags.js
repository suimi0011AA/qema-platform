import express from 'express';
const router = express.Router();
import { EventTag } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const tags = await EventTag.findAll();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const tag = await EventTag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { event_id, tag_id } = req.body;
        await EventTag.destroy({ where: { event_id, tag_id } });
        res.json({ message: 'EventTag deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;