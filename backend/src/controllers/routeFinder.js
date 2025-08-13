import { buildLeaderboard } from '../services/routeFinderAlgorithm.js';

// weights used for optimization
const centers = ["Gilroy", "Salinas", "Watsonville", "Stockton", "Modesto"];
const weights = [
  [0, 2, 1, 4, 3],
  [2, 0, 1, 4, 4],
  [1, 1, 0, 4, 4],
  [4, 4, 4, 0, 2],
  [3, 4, 4, 2, 0],
];

// real miles for reporting
const miles = [
  [0, 33, 22, 103, 88],
  [33, 0, 19, 134, 110],
  [22, 19, 0, 126, 106],
  [103, 134, 126, 0, 31],
  [88, 110, 106, 31, 0],
];

function parseBool(val, def = false) {
  if (val === undefined) return def;
  if (typeof val === 'boolean') return val;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
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

    const result = buildLeaderboard({
      centers,
      weights,
      miles,
      startIdx,
      includeReturn,
      computeTsp,
    });

    
    res.json({
      ok: true,
      start: centers[startIdx],
      includeReturn,
      best: result.best,
      leaderboard: result.leaderboard,
      counts: result.counts,
      ...(result.tspOptimal && { tspOptimal: result.tspOptimal }),
    });
  } catch (err) {
    next(err);
  }
}