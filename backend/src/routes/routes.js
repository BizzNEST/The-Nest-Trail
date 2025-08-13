import { Router } from 'express';
import { sendMessage } from './llmApi.js';
import sharedInventory from '../../models/sharedInventory.js';

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