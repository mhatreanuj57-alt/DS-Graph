# Undirected cycle detection with BFS

**Lesson ID:** `bfs-cycle`  
**Section:** Cycles  
**Full PDF pages:** 65–67 (combined PDF). **Original source pages:** 53–55 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

In an undirected graph, BFS detects a cycle when it encounters an already visited neighbor that is not the current vertex's parent. This is useful for checking whether an undirected network contains a cycle. The parent exception is necessary because each undirected edge appears from both endpoints in adjacency lists.

**From the PDF:** for multigraphs with parallel edges, track the parent **edge ID**, not just the parent vertex, so a second parallel edge is not accidentally ignored.

## Key terms and graph representation

- **Parent:** the vertex from which the current vertex was first discovered.
- **Visited neighbor:** a neighbor already discovered by BFS.
- **Parent edge:** the tree edge that led to the current vertex; seeing it again is normal in an undirected graph.
- **Cycle:** a closed path; for a simple undirected graph, an already visited non-parent neighbor is the test signal.

## Method step by step

1. Loop over all vertices so disconnected components are covered.
2. For an unseen start, mark it visited and enqueue `(start, parent=-1)`.
3. Pop `(u,parent)` and inspect every neighbor `v`.
4. If `v` is unseen, mark it immediately and enqueue `(v,parent=u)`.
5. If `v` is already visited and `v != parent`, report a cycle. In a multigraph, replace this vertex comparison with incoming-edge-ID comparison.

## Worked example and state changes

**Example from the PDF:** undirected edges `(0—1), (1—2), (2—3), (3—0), (2—4)`. The four vertices `0,1,2,3` form a ring; `4` is attached to `2`. From `0`, examine neighbors in ascending order.

1. Pop `(0,-1)`; discover `1` and `3`. Queue: `[(1,0),(3,0)]`.
2. Pop `(1,0)`; ignore neighbor `0` because it is the parent; discover `2`. Queue: `[(3,0),(2,1)]`.
3. Pop `(3,0)`; ignore `0` (parent). Neighbor `2` is already discovered and is not `3`'s parent `0`.
4. The non-parent visited neighbor proves a cycle: `0—1—2—3—0`.

The edge to the parent is expected; it must not trigger a false positive.

## Time and space complexity

With adjacency lists, each vertex is enqueued once and each undirected edge is inspected from both ends, for **O(V + E)** time. The visited array and queue use **O(V)** auxiliary space.

## Common mistakes and edge cases

- Reporting a cycle just because the current vertex sees its parent again.
- Marking only when a vertex is dequeued, causing duplicate insertions.
- Not checking disconnected components.
- Using parent-vertex comparison for multigraphs with parallel edges; use edge IDs there.
- Applying this undirected rule to a directed graph, where cycle detection requires active-path logic.

## Remember this

BFS queue entries should carry both vertex and parent. An already visited **non-parent** neighbor signals a cycle in a simple undirected graph.

## Self-check (answers are in the separate answer key)

1. Why does an undirected traversal need to ignore the parent neighbor?
2. What condition signals a cycle in the simple-graph BFS method?
3. What should a multigraph implementation track instead of only the parent vertex?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
