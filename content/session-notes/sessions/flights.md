# Cheapest flights with K stops

**Lesson ID:** `flights`  
**Section:** Shortest paths  
**Full PDF pages:** 22–23 (combined PDF). **Original source pages:** 10–11 (original source page labels). **Related concept overview:** PDF page 8.

## What this topic is and when it is useful

Cheapest Flights Within K Stops finds the minimum cost from a source to a destination subject to a stop/edge-count limit. The graph is directed and weighted; the stop constraint must remain part of the algorithm state.

**From the PDF:** a path with K intermediate stops can contain at most K+1 flight edges. Ordinary Dijkstra can discard a route that costs a little more but uses fewer stops, so the limit must be modeled explicitly.

## Key terms and graph representation

- **Flight edge `u→v (cost)`:** a directed transition with a price.
- **Intermediate stop:** a city visited between source and destination; the source and destination do not count as intermediate stops.
- **Edge budget:** at most `K+1` edges when at most K stops are allowed.
- **Layer/round:** routes using a fixed number of edges.
- **Distance snapshot:** a copy of the previous round's costs, useful for ensuring each round adds at most one edge.

## Method step by step

1. Build a directed weighted adjacency list or edge list.
2. Set `dist[source]=0`, others to infinity.
3. Repeat up to `K+1` rounds. In each round, relax edges using the distances from the start of that round (a copy/snapshot), so a round can add only one flight edge.
4. Keep the lowest total cost found for each vertex within the allowed edge budget.
5. Return `dist[destination]`, or `-1` if it remains infinity. Do not silently let paths use more than K+1 edges.

## Worked example and state changes

**Illustrative weighted flights graph:** `0→1 (100)`, `0→2 (500)`, `1→2 (100)`, `2→3 (100)`, `1→3 (600)`. Source `0`, destination `3`, `K=1`; therefore at most `K+1=2` edges are allowed.

Initialize `d=[0,∞,∞,∞]`.

- **Round 1 (at most 1 edge):** from source `0`, `d[1]: ∞→100`, `d[2]: ∞→500`. Snapshot now `[0,100,500,∞]`.
- **Round 2 (at most 2 edges, using the previous snapshot):** via `1→2`, candidate `100+100=200`, so `d[2]: 500→200`; via `1→3`, candidate `100+600=700`; via `2→3` from the prior-round cost `500`, candidate `600`, so `d[3]: ∞→600`.

Best destination cost within two edges is **600**, via `0→2→3`. The cheaper partial path `0→1→2` costs 200 but does not reach the destination within the two-edge budget.

## Time and space complexity

A layered relaxation strategy takes **O(K E)** time as summarized by the guide (often described with an edge-budget-dependent number of rounds). Graph storage is **O(V + E)**. A distance array plus a copied previous-round array takes **O(V)** extra space. Be careful whether a particular implementation loops K or K+1 times; K stops means up to K+1 flight edges.

## Common mistakes and edge cases

- Treating K stops as K edges; the edge budget is K+1.
- Using a single best cost without tracking the remaining stop/edge budget.
- Allowing multiple edges to cascade in one round when the intended invariant is “at most one extra edge per round.”
- Returning `0` or infinity when the destination is unreachable, rather than the problem's required `-1` convention.
- Confusing number of visited cities with number of intermediate stops.

## Remember this

Stop-limited shortest paths need cost **and** edge/stops state. With K intermediate stops, allow at most K+1 flight edges; use rounds/snapshots so the cap is respected.

## Self-check (answers are in the separate answer key)

1. With K=2 intermediate stops, what is the maximum number of flight edges?
2. Why is an unconstrained single distance per node potentially insufficient for this problem?
3. In the illustrative example with K=1, what is the cheapest permitted cost to reach vertex `3`?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
