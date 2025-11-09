import express from 'express';
const router = express.Router();
import { Event, User, Organization, Venue, Tag } from '../models/index.js';

// GET كل Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: User, as: 'creator' },
                { model: Organization, as: 'organizer' },
                { model: Venue, as: 'venue' },
                { model: Tag }
            ]
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Event واحدة
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator' },
                { model: Organization, as: 'organizer' },
                { model: Venue, as: 'venue' },
                { model: Tag }
            ]
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST إنشاء Event
router.post('/', async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT تحديث Event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        await event.update(req.body);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;