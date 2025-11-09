import express from 'express';
const router = express.Router();
import { Submission } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const subs = await Submission.findAll();
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sub = await Submission.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Submission not found' });
        res.json(sub);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const sub = await Submission.create(req.body);
        res.status(201).json(sub);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const sub = await Submission.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Submission not found' });
        await sub.update(req.body);
        res.json(sub);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const sub = await Submission.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Submission not found' });
        await sub.destroy();
        res.json({ message: 'Submission deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;