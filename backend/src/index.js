import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/routes.js'; // <-- all endpoints live here

const app = express();

// --- CORS (allow GH Pages + local dev) ---
const allowedOrigins = [
  'http://localhost:5173',                 // Vite dev (adjust if needed)
  'http://localhost:3000',                 // CRA/Next dev (optional)
  'https://bizznest.github.io',           // <-- your org's GitHub Pages origin
  'https://the-nest-trail.pages.dev',     // Cloudflare Pages deployment
  process.env.FRONTEND_ORIGIN              // optional: custom domain
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);                // allow curl/postman
    return allowedOrigins.includes(origin)
      ? cb(null, true)
      : cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,                                    // set true only if using cookies
  optionsSuccessStatus: 200
}));

// middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// attach routes
app.use('/', routes);
app.use('/inventory', routes)

// start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] listening on http://0.0.0.0:${PORT}`);
});