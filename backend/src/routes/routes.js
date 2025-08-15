import { Router } from 'express';
import { getLeaderboard } from '../controllers/routeFinder.js';
import { sendMessage } from './llmApi.js';
import sharedInventory from '../../models/sharedInventory.js';
import sharedStats from '../../models/sharedStats.js';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Hello world');
});

router.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});


// Leaderboard for hardcoded graph between centers
router.get('/api/routes/graphTraversal', getLeaderboard);

// LLM API route
router.post('/api/chat', sendMessage);

// Inventory API route
router.get('/api/items', (req, res) => {
  try {
      const items = sharedInventory.listItems();
      res.status(200).json(items);
  } catch (error) {
      console.error('Error fetching items:', error.message);
      res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/api/stats', (req, res) => {
  try {
      const stats = sharedStats.getStats();
      res.status(200).json(stats);
  } catch (error) {
      console.error('Error fetching stats:', error.message);
      res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


export default router;