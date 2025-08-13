import { Router } from 'express';
import { getLeaderboard } from '../controllers/routeFinder.js';
import { sendMessage } from './llmApi.js';
import sharedInventory from '../../models/sharedInventory.js';


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
router.get('/items', (req, res) => {
  try {
      const items = sharedInventory.listItems();
      res.status(200).json(items);
  } catch (error) {
      console.error('Error fetching items:', error.message);
      res.status(500).json({ error: 'Failed to fetch items' });
  }
});


export default router;