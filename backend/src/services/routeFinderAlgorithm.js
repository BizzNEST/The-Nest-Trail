// ----- helpers -----
function pathSum(path, matrix, includeReturn) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) total += matrix[path[i]][path[i + 1]];
  if (includeReturn) total += matrix[path[path.length - 1]][path[0]];
  return total;
}

function edgesFromPath(path, centers, weights, miles, includeReturn) {
  const edges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    edges.push({
      from: centers[a],
      to: centers[b],
      weight: weights[a][b],
      miles: miles[a][b]
    });
  }
  if (includeReturn) {
    const a = path[path.length - 1], b = path[0];
    edges.push({
      from: centers[a],
      to: centers[b],
      weight: weights[a][b],
      miles: miles[a][b]
    });
  }
  return edges;
}

// ----- enumerate ALL routes (any unvisited next allowed) -----
function enumerateAllRoutes({ startIdx, dist, includeReturn }) {
  const N = dist.length;
  const out = [];

  function dfs(path, unvisited) {
    if (path.length === N) {
      // keep only the weight total here; we enrich with miles later
      out.push({ path: [...path], totalWeight: pathSum(path, dist, includeReturn) });
      return;
    }
    for (const nxt of Array.from(unvisited)) {
      unvisited.delete(nxt);
      path.push(nxt);
      dfs(path, unvisited);
      path.pop();
      unvisited.add(nxt);
    }
  }

  const unvisited = new Set([...Array(N).keys()].filter(i => i !== startIdx));
  dfs([startIdx], unvisited);
  return out;
}

// ----- exact TSP via brute force (weights) -----
function tspBrute({ startIdx, weights, includeReturn }) {
  const N = weights.length;
  const rest = [...Array(N).keys()].filter(i => i !== startIdx);

  const perms = [];
  function heap(a, k = a.length) {
    if (k === 1) return perms.push([...a]);
    heap(a, k - 1);
    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) [a[i], a[k - 1]] = [a[k - 1], a[i]];
      else             [a[0], a[k - 1]] = [a[k - 1], a[0]];
      heap(a, k - 1);
    }
  }
  heap(rest);

  let bestPath = null, bestCost = Infinity;
  for (const p of perms) {
    const path = [startIdx, ...p];
    const cost = pathSum(path, weights, includeReturn);
    if (cost < bestCost) { bestCost = cost; bestPath = path; }
  }
  return { path: bestPath, totalWeight: bestCost };
}

// ----- main API -----
export function buildLeaderboard({
  centers,
  weights,       // used for optimization
  miles,         // used for reporting
  startIdx,
  includeReturn = false,
  computeTsp = false
}) {
  // 1) Enumerate all candidates by weights
  const all = enumerateAllRoutes({ startIdx, dist: weights, includeReturn });

  // 2) Sort by weight (primary objective)
  all.sort((a, b) => a.totalWeight - b.totalWeight);

  // 3) Enrich each route with labels, edges, and miles totals
  const label = (idxPath) => idxPath.map(i => centers[i]);
  const leaderboard = all.map((r, i) => {
    const edges = edgesFromPath(r.path, centers, weights, miles, includeReturn);
    const totalMiles = edges.reduce((s, e) => s + e.miles, 0);
    return {
      rank: i + 1,
      route: label(r.path),
      totalWeight: r.totalWeight,
      totalMiles,
      edges
    };
  });

  // 4) Optional exact TSP (weights) + miles annotation
  let tspOptimal;
  if (computeTsp) {
    const best = tspBrute({ startIdx, weights, includeReturn });
    const edges = edgesFromPath(best.path, centers, weights, miles, includeReturn);
    const totalMiles = edges.reduce((s, e) => s + e.miles, 0);
    tspOptimal = {
      route: label(best.path),
      totalWeight: best.totalWeight,
      totalMiles,
      edges
    };
  }

  return {
    start: centers[startIdx],
    includeReturn,
    best: leaderboard[0] ?? null,
    leaderboard,
    counts: { routes: all.length }, // 24 when N=5
    ...(tspOptimal && { tspOptimal })
  };
}