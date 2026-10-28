# Undirected cycle detection with DFS

**Lesson ID:** `dfs-cycle`  
**Section:** Cycles  
**Full PDF pages:** 68–70 (combined PDF). **Original source pages:** 56–58 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

Undirected DFS cycle detection uses the same parent exception as the BFS version but explores with recursion/depth-first order. It is useful for checking whether a simple undirected graph contains a cycle. A cycle exists when DFS finds an already visited neighbor other than the vertex's parent.

**From the PDF:** use an outer loop to inspect every disconnected component. The source's parent-by-vertex approach is for simple graphs; multigraphs require edge IDs to distinguish parallel edges.

## Key terms and graph representation

- **DFS tree parent:** the vertex that made the current vertex first visited.
- **Backtracking:** return after every unvisited neighbor is explored.
- **Visited non-parent neighbor:** the cycle signal for a simple undirected graph.
- **Simple graph:** no parallel edges between the same pair of vertices.

## Method step by step

1. For each unseen vertex, call `dfs(u, parent)` with a sentinel parent at the root.
2. Mark `u` visited.
3. For every neighbor `v`, recurse with parent `u` if `v` is unseen.
4. If `v` is already visited and `v != parent`, return cycle=true.
5. If all neighbors and all components finish without this condition, return false.

## Worked example and state changes

**Example from the PDF:** a four-vertex ring with edges `(1—2), (2—3), (3—4), (4—1)`. Follow adjacency insertion order from this edge list (in particular, `adj[4] = [3,1]`), so at vertex `4` the parent `3` is checked before `1`.

- Enter `1`, parent `-1`; recurse to `2`.
- Enter `2`, parent `1`; skip the already visited parent `1`, recurse to `3`.
- Enter `3`, parent `2`; skip `2`, recurse to `4`.
- At `4`, parent is `3`; neighbor `1` is already visited and is not the parent.
- The edge `4—1` closes cycle `1—2—3—4—1`, so return true up the recursion chain.

## Time and space complexity

Adjacency-list DFS runs in **O(V + E)** time because each vertex is visited once and each edge is checked at most twice. The visited array and worst-case recursion stack require **O(V)** space.

## Common mistakes and edge cases

- Forgetting to carry the parent into recursive calls.
- Treating the parent edge as a cycle.
- Forgetting to continue from unvisited vertices after one component ends.
- Assuming the undirected rule works for directed cycles.
- Using the simple-graph parent condition on a multigraph with parallel edges.

## Remember this

DFS explores deeply, but the cycle rule is still “visited neighbor and not parent.” The root loop is what handles disconnected graphs.

## Self-check (answers are in the separate answer key)

1. What two pieces of state does the DFS cycle helper need in the simple undirected approach?
2. In the ring example, what happens at vertex `4`?
3. Why does the algorithm need an outer loop over vertices?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
