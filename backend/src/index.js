import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/routes.js'; // <-- all endpoints live here

const app = express();

// middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(cors());

// attach routes
app.use('/', routes);

// start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`[Backend] listening on http://localhost:${PORT}`);
});