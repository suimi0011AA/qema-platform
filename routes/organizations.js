import express from 'express';
const router = express.Router();
import { Organization } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const orgs = await Organization.findAll();
        res.json(orgs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id);
        if (!org) return res.status(404).json({ error: 'Organization not found' });
        res.json(org);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const org = await Organization.create(req.body);
        res.status(201).json(org);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id);
        if (!org) return res.status(404).json({ error: 'Organization not found' });
        await org.update(req.body);
        res.json(org);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id);
        if (!org) return res.status(404).json({ error: 'Organization not found' });
        await org.destroy();
        res.json({ message: 'Organization deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;