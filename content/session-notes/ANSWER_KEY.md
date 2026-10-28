# Self-check Answer Key

Answers are grouped by lesson ID. The questions themselves are in each session note.

## Foundations

### `graph-structures` — Graph structures & representations

1. `V` is the set of vertices/nodes; `E` is the set of edges/relationships.
2. Record it at both endpoints: `adj[2]` includes `4` and `adj[4]` includes `2`.
3. An adjacency matrix; it uses O(V²) space and checks a specific edge in O(1).

## Traversal

### `bfs` — Breadth-first search

1. A FIFO queue.
2. Immediately when it is enqueued/discovered.
3. `d[1]=1`, `d[2]=1`, and `d[3]=2`.

### `dfs` — Depth-first search

1. It backtracks/returns from that call to the previous vertex in the recursive path.
2. The DFS call stack (or an explicit DFS stack) is LIFO.
3. Vertex `4` is visited next after DFS returns to `2`.

## Connectivity

### `provinces` — Number of provinces

1. It starts a new traversal and increments the province count by one.
2. Each vertex can scan all V entries in its matrix row, leading to O(V²) total work.
3. 3 provinces: `{0,1}`, `{2}`, and `{3}`.

### `dsu` — Disjoint set union

1. The representative/root of the set containing `x`.
2. Do nothing; the elements are already in the same set.
3. Path compression and union by rank or size.

## Grid graphs

### `flood-fill` — Flood fill

1. Compare with the original color at the starting cell, captured before changes.
2. Otherwise the recolor may not change any cell and cannot be relied on as a visited marker; an early return avoids repeated processing.
3. No. Under four-neighbor rules, diagonal contact alone does not connect cells.

### `islands` — Number of islands

1. A connected component of land cells in the implicit grid graph.
2. 3 islands.
3. O(RC), because the grid has R×C cells and each is considered a constant number of times.

### `rotting-oranges` — Rotting oranges

1. All initial sources spread simultaneously; enqueuing them together models the same start time.
2. Once per complete BFS layer, because one layer equals one minute.
3. `-1`.

## DAGs

### `kahn` — Topological sort with Kahn’s algorithm

1. Its current indegree must be zero.
2. Not all vertices could be removed; a directed cycle remains.
3. Update outgoing neighbors of the removed vertex.

### `course-schedule` — Course schedule

1. `1 → 3`, because course `1` is the prerequisite for course `3`.
2. It currently has no remaining incoming prerequisite edge and is ready to take.
3. If all V courses are emitted, a schedule exists; fewer than V indicates a cycle prevents completion.

### `topo-dfs` — Topological sort with DFS

1. After all its outgoing neighbors have been handled, when its DFS call exits.
2. A directed back edge to the current active DFS path; it indicates a cycle.
3. Reverse the finish list.

## Cycles

### `directed-cycle` — Directed cycle detection

1. `pathVisited` identifies vertices that are currently on the active recursion path; `visited` only says they have been encountered.
2. No. An edge to a completed vertex alone is not evidence of a directed cycle.
3. `2 → 1`, because vertex `1` is still active when DFS examines the edge.

### `bfs-cycle` — Undirected cycle detection with BFS

1. An undirected edge is present in the adjacency lists of both endpoints, so the current vertex normally sees its parent again.
2. An already visited neighbor that is not the current vertex’s parent.
3. The incoming parent edge ID, so parallel edges can be distinguished.

### `dfs-cycle` — Undirected cycle detection with DFS

1. The visited state and the parent vertex passed to each recursive call.
2. It sees vertex `1` as visited and not its parent `3`, so the ring closes a cycle.
3. To start DFS from any remaining unseen vertex and cover disconnected components.

## Shortest paths

### `dijkstra` — Dijkstra shortest paths

1. All edge weights must be non-negative.
2. Candidate `dist[u] + w(u,v)`, compared with current `dist[v]`.
3. The route `0→2→1` costs `1+2=3`, which improves the direct route cost of 4.

### `bellman-ford` — Bellman–Ford

1. A shortest simple path uses at most V−1 edges; each full round can propagate information one edge further.
2. Yes. Bellman–Ford supports negative edges.
3. A reachable edge can still reduce a distance, indicating a reachable negative-weight cycle.

### `flights` — Cheapest flights with K stops

1. At most K+1 = 3 flight edges.
2. A route with more edges can be cheaper but violate the stop cap, while another cost may use fewer edges; budget/rounds must be represented.
3. 600, via `0→2→3` using two edges.

## Spanning trees

### `kruskal` — Kruskal minimum spanning tree

1. In non-decreasing (ascending) edge weight order.
2. Its endpoints are already in the same DSU component, so accepting it would create a cycle.
3. V−1 edges.

### `prim` — Prim minimum spanning tree

1. The lightest edge that crosses from the current tree to an unvisited vertex.
2. It has already joined the tree, so adding it again would not add a new vertex or MST edge.
3. 16.

## Critical structure

### `articulation` — Articulation points

1. `tin[u]` is when `u` was first discovered; `low[u]` is the earliest discovery time reachable from its DFS subtree under the tree-edge/back-edge rule.
2. `low[v] >= tin[u]` for any DFS child `v`.
3. When it has more than one DFS-tree child.

### `bridges` — Bridges in a network

1. `low[v] > tin[u]`.
2. Back edges in the triangle let the descendants reach an ancestor, so the triangle edges do not disconnect the component when removed.
3. `tin` is the vertex’s discovery timestamp; `low` summarizes the earliest reachable discovery time under the DFS subtree/back-edge rule.

### `kosaraju` — Strongly connected components

1. When the DFS call exits, after all outgoing neighbors have been explored.
2. Replace it with `v→u`.
3. It is reachable from `4`, but there is no directed path back from `5` to the other vertices, so its SCC is the singleton `{5}`.

---

[Back to table of contents](README.md)
