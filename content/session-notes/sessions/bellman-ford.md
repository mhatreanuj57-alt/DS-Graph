# Bellman–Ford

**Lesson ID:** `bellman-ford`  
**Section:** Shortest paths  
**Full PDF pages:** 36–38 (combined PDF). **Original source pages:** 24–26 (original source page labels). **Related concept overview:** PDF page 8.

## What this topic is and when it is useful

Bellman–Ford computes single-source shortest-path distances and is useful when negative edge weights may occur. It also detects a negative-weight cycle reachable from the source.

**From the PDF:** relax every edge V−1 times because a simple shortest path can contain at most V−1 edges. Then perform another pass; if any reachable edge can still improve a distance, a reachable negative cycle exists.

## Key terms and graph representation

- **Edge list:** explicit list of directed edges `(u,v,w)` to scan each round.
- **Relaxation:** if `dist[u]` is finite and `dist[u]+w < dist[v]`, set `dist[v]=dist[u]+w`.
- **Negative edge:** an edge whose weight is less than zero; Bellman–Ford can handle it.
- **Negative cycle:** a cycle whose total weight is negative, allowing cost to keep decreasing by repeating it.
- **Reachable negative cycle:** a negative cycle that can be reached from the source; this is what the standard source-based extra pass detects.

## Method step by step

1. Initialize `dist[source]=0` and every other distance to infinity.
2. Repeat V−1 rounds; in each round scan every edge `(u,v,w)`.
3. Only relax from `u` if `dist[u]` is finite. Update `dist[v]` when `dist[u]+w` is smaller.
4. Do one extra scan of all edges. If a reachable edge can still improve a distance, report a reachable negative cycle.
5. Otherwise, the final distances are shortest-path distances for vertices reachable from the source.

## Worked example and state changes

**Illustrative weighted directed graph:** `0→1 (4)`, `0→2 (5)`, `1→2 (-2)`, `2→3 (3)`, `1→3 (4)`. Source = `0`; use this edge order for the displayed round.

Initial `d=[0,∞,∞,∞]`.

**Round 1:**
- `0→1 (4)`: `d[1]: ∞→4`.
- `0→2 (5)`: `d[2]: ∞→5`.
- `1→2 (-2)`: `4 + (-2) = 2`, so `d[2]: 5→2`.
- `2→3 (3)`: `2+3=5`, so `d[3]: ∞→5`.
- `1→3 (4)`: candidate `4+4=8`, so keep `d[3]=5`.

After round 1: `[0,4,2,5]`. Further rounds make no improvement. The extra pass also finds no improvement, so no reachable negative cycle is detected in this example.

## Time and space complexity

Bellman–Ford scans E edges for each of V−1 rounds and once more for cycle detection: **O(VE)** time. Distance storage uses **O(V)** auxiliary space, aside from the edge list/graph. It may be slower than Dijkstra on non-negative weights, but it can handle negative edges.

## Common mistakes and edge cases

- Relaxing from a vertex whose distance is infinity, which can create invalid numbers or overflow.
- Running fewer than V−1 rounds without a stated early-stop optimization.
- Forgetting the extra pass for negative-cycle detection.
- Reporting any negative edge as a negative cycle; a negative edge alone is allowed.
- Misinterpreting the extra pass: it indicates a negative cycle reachable from the chosen source, not necessarily a disconnected negative cycle.

## Remember this

Bellman–Ford permits negative edges. Relax all edges V−1 times, then scan once more: a further improvement from a reachable vertex signals a reachable negative-weight cycle.

## Self-check (answers are in the separate answer key)

1. Why are V−1 full relaxation rounds sufficient for shortest simple paths?
2. Can Bellman–Ford process a negative edge?
3. What does an improvement on the extra pass indicate?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
