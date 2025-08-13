import { Router } from 'express';
import { getLeaderboard } from '../controllers/routeFinder.js';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Hello world');
});

router.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Leaderboard for hardcoded graph
router.get('/api/routes/graphTraversal', getLeaderboard);

export default router;