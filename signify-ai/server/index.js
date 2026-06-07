import 'dotenv/config';
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { sessionsLimiter } from './middleware/rateLimit.js';
import healthRoute from './routes/health.js';
import groqRoute from './routes/groq.js';
import sessionsRoute from './routes/sessions.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Route Declarations
app.use('/api/health', healthRoute);
app.use('/api/groq', groqRoute);
app.use('/api/sessions', sessionsLimiter, sessionsRoute);

// Basic 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[SIGNIFY SERVER] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
