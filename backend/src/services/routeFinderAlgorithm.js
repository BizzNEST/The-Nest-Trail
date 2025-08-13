
// ----- cost helper -----
function pathCost(path, dist, includeReturn) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) total += dist[path[i]][path[i + 1]];
  if (includeReturn) total += dist[path[path.length - 1]][path[0]];
  return total;
}

// ----- enumerate ALL routes (any unvisited next) -----
function enumerateAllRoutes({ startIdx, dist, includeReturn }) {
  const N = dist.length;
  const out = [];

  function dfs(path, unvisited) {
    if (path.length === N) {
      out.push({ path: [...path], total: pathCost(path, dist, includeReturn) });
      return;
    }

    // IMPORTANT: iterate a snapshot so we can mutate the Set safely
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

// ----- exact TSP via brute force (fine for N=5) -----
function tspBrute({ startIdx, dist, includeReturn }) {
  const N = dist.length;
  const rest = [...Array(N).keys()].filter(i => i !== startIdx);

  const perms = [];
  function heap(a, k = a.length) {
    if (k === 1) return perms.push([...a]);
    heap(a, k - 1);
    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) [a[i], a[k - 1]] = [a[k - 1], a[i]];
      else [a[0], a[k - 1]] = [a[k - 1], a[0]];
      heap(a, k - 1);
    }
  }
  heap(rest);

  let bestPath = null, bestCost = Infinity;
  for (const p of perms) {
    const path = [startIdx, ...p];
    const cost = pathCost(path, dist, includeReturn);
    if (cost < bestCost) { bestCost = cost; bestPath = path; }
  }
  return { path: bestPath, total: bestCost };
}

// ----- main API -----
export function buildLeaderboard({ centers, dist, startIdx, includeReturn = false, computeTsp = false }) {
  const all = enumerateAllRoutes({ startIdx, dist, includeReturn });
  all.sort((a, b) => a.total - b.total);

  const label = (idxPath) => idxPath.map(i => centers[i]);
  const leaderboard = all.map((r, i) => ({
    rank: i + 1,
    total: r.total,
    route: label(r.path),
  }));

  let tspOptimal;
  if (computeTsp) {
    const best = tspBrute({ startIdx, dist, includeReturn });
    tspOptimal = { total: best.total, route: label(best.path) };
  }

  return {
    start: centers[startIdx],
    includeReturn,
    best: leaderboard[0] ?? null,         // (feel free to rename back to constrainedBest)
    leaderboard,
    counts: { routes: all.length },       // for 5 nodes: 4! = 24
    ...(tspOptimal && { tspOptimal }),
  };
}