
import { buildLeaderboard } from '../services/routeFinderAlgorithm.js';

const centers = ["G", "SL", "W", "ST", "M"];
const dist = [
  [0, 2, 1, 4, 3],
  [2, 0, 1, 4, 4],
  [1, 1, 0, 4, 4],
  [4, 4, 4, 0, 2],
  [3, 4, 4, 2, 0],
];

function parseBool(val, def = false) {
  if (val === undefined) return def;
  if (typeof val === 'boolean') return val;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1';
}

export async function getLeaderboard(req, res, next) {
  try {
    const { start } = req.query;
    const includeReturn = parseBool(req.query.includeReturn, false);
    const computeTsp = parseBool(req.query.computeTsp, true);

    const startIdx = start ? centers.indexOf(start) : 0;
    if (start && startIdx === -1) {
      return res.status(400).json({ ok: false, error: `start must be one of: ${centers.join(', ')}` });
    }

    const result = buildLeaderboard({ centers, dist, startIdx, includeReturn, computeTsp });
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
}