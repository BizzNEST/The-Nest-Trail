import { Router } from 'express';
import { getLeaderboard } from '../controllers/routeFinder.js';
import { sendMessage } from './llmApi.js';
import sharedInventory from '../../models/sharedInventory.js';
import sharedStats from '../../models/sharedStats.js';
import sharedToolCallTracker from '../../models/sharedToolCalls.js';

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

// Tool calls polling endpoint
router.get('/api/tool-calls', (req, res) => {
  try {
      const lastId = parseInt(req.query.lastId) || 0;
      const newToolCalls = sharedToolCallTracker.getNewToolCalls(lastId);
      
      // Clean up old tool calls periodically
      sharedToolCallTracker.clearOldToolCalls();
      
      res.json({ toolCalls: newToolCalls });
  } catch (error) {
      console.error('Error fetching tool calls:', error.message);
      res.status(500).json({ error: 'Failed to fetch tool calls' });
  }
});


export default router;