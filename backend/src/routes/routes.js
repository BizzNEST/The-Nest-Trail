import { Router } from 'express';

const router = Router();

// root route
router.get('/', (_req, res) => {
  res.send('Hello world');
});

// health route
router.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

export default router;