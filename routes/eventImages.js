import express from 'express';
const router = express.Router();
import { EventImage } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const images = await EventImage.findAll();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const image = await EventImage.findByPk(req.params.id);
        if (!image) return res.status(404).json({ error: 'EventImage not found' });
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const image = await EventImage.create(req.body);
        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const image = await EventImage.findByPk(req.params.id);
        if (!image) return res.status(404).json({ error: 'EventImage not found' });
        await image.update(req.body);
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const image = await EventImage.findByPk(req.params.id);
        if (!image) return res.status(404).json({ error: 'EventImage not found' });
        await image.destroy();
        res.json({ message: 'EventImage deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;