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
// Build outbound edges for each center, e.g. { Gilroy: [ {from:'Gilroy', to:'Salinas', ...}, ... ], ... }
function buildEdgesByCenter(centers, weights, miles) {
  const byCenter = {};
  for (let i = 0; i < centers.length; i++) {
    const from = centers[i];
    const edges = [];
    for (let j = 0; j < centers.length; j++) {
      if (i === j) continue;
      edges.push({
        from,
        to: centers[j],
        weight: weights[i][j],
        miles: miles[i][j],
      });
    }
    // Sort by weight (then miles) so it's easy to read
    edges.sort((a, b) => (a.weight - b.weight) || (a.miles - b.miles));
    byCenter[from] = edges;
  }
  return byCenter;
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

    const edgesByCenter = buildEdgesByCenter(centers, weights, miles);

    res.json({
      ok: true,
      start: centers[startIdx],
      includeReturn,
      best: result.best,
      leaderboard: result.leaderboard,
      counts: result.counts,
      edgesByCenter, // new: distances from EACH center to the others
      ...(result.tspOptimal && { tspOptimal: result.tspOptimal }),
    });
  } catch (err) {
    next(err);
  }
}