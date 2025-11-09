import express from 'express';
const router = express.Router();
import { Venue } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const venues = await Venue.findAll();
        res.json(venues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findByPk(req.params.id);
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        res.json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        res.status(201).json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const venue = await Venue.findByPk(req.params.id);
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        await venue.update(req.body);
        res.json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const venue = await Venue.findByPk(req.params.id);
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        await venue.destroy();
        res.json({ message: 'Venue deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;