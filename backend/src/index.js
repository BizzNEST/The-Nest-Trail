import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(cors());

// root route
app.get('/', (_req, res) => {
  res.send('Hello world');
});

// example API route
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`[Backend] listening on http://localhost:${PORT}`);
});