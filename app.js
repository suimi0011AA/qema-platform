// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {
    sequelize,
    Role,
    User,
    Organization,
    Venue,
    Tag,
    Event,
    EventImage,
    EventTag,
    Submission,
    AuditLog
} from './models/index.js';

// ===== Import Routes =====
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import rolesRoutes from './routes/roles.js';
import organizationsRoutes from './routes/organizations.js';
import venuesRoutes from './routes/venues.js';
import tagsRoutes from './routes/tags.js';
import eventsRoutes from './routes/events.js';
import eventImagesRoutes from './routes/eventImages.js';
import eventTagsRoutes from './routes/eventTags.js';
import submissionsRoutes from './routes/submissions.js';
import auditLogsRoutes from './routes/auditLogs.js';
import programsRoutes from './routes/programs.js';

// ===== Import Middleware =====
import { verifyToken } from './src/middleware/auth.js';

// ===== Initialize Express =====
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====

// 🔹 Routes غير محمية
app.use('/api/auth', authRoutes); // تسجيل الدخول والتسجيل

// 🔹 Routes محمية بالتوكن
app.use('/api/users', verifyToken, usersRoutes);
app.use('/api/roles', verifyToken, rolesRoutes);
app.use('/api/organizations', verifyToken, organizationsRoutes);
app.use('/api/venues', verifyToken, venuesRoutes);
app.use('/api/tags', verifyToken, tagsRoutes);
app.use('/api/events', verifyToken, eventsRoutes);
app.use('/api/eventImages', verifyToken, eventImagesRoutes);
app.use('/api/eventTags', verifyToken, eventTagsRoutes);
app.use('/api/submissions', verifyToken, submissionsRoutes);
app.use('/api/auditLogs', verifyToken, auditLogsRoutes);
app.use('/api/programs', verifyToken, programsRoutes);

// ===== Test Route =====
app.get('/', (req, res) => {
    res.send('API qema is running!');
});

// ===== Sync database and start server =====
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });