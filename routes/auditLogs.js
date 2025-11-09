import express from 'express';
const router = express.Router();
import { AuditLog } from '../models/index.js';

router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.findAll();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const log = await AuditLog.create(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;