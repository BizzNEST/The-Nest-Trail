import { Router } from 'express';
import { sendMessage } from './llmApi.js';

const router = Router();

// root route
router.get('/', (_req, res) => {
  res.send('Hello world');
});

// health route
router.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// LLM API route
router.post('/api/chat', sendMessage);


export default router;