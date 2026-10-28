# Breadth-first search

**Lesson ID:** `bfs`  
**Section:** Traversal  
**Full PDF pages:** 75–79 (combined PDF). **Original source pages:** 63–67 (original source page labels). **Related concept overview:** PDF page 5.

## What this topic is and when it is useful

Breadth-first search (BFS) visits a graph in layers from a start vertex. It is useful for reachability and for finding a path with the fewest edges in an **unweighted** graph.

**From the PDF:** BFS uses a FIFO queue and a visited tracker. Mark a node visited when it is enqueued, not later when it is removed, to prevent duplicate queue entries. A single-source traversal visits only the source's connected/reachable region; an outer loop is needed to cover a disconnected graph.

## Key terms and graph representation

- **Queue / FIFO:** first in, first out; the earliest discovered vertex is expanded first.
- **Visited:** means a vertex has already been discovered/enqueued.
- **Distance `dist[v]`:** fewest edges from the start in an unweighted graph.
- **Parent:** the vertex that first discovered `v`; parent pointers can reconstruct one shortest path.
- **Neighbor order:** the order in which neighbors are examined. It can change the traversal order without changing BFS distances.

## Method step by step

1. Create `visited`, `dist`, and optionally `parent` arrays; initialize distances to infinity/unknown.
2. Mark the source visited, set its distance to `0`, and enqueue it.
3. While the queue is not empty, remove its front vertex `u`.
4. For every neighbor `v` of `u`, if `v` is unseen: mark it visited immediately, set `dist[v] = dist[u] + 1`, set `parent[v] = u`, and enqueue it.
5. If full graph coverage is required, start another BFS from each still-unvisited vertex.

## Worked example and state changes

**Source consistency note:** the introductory module's BFS trace on PDF page 5 shows vertex `0` discovering `1,2`, while the canonical reference graph on PDF pages 3–4 lists only edge `(0,1)` incident to `0`. The appendix BFS section explicitly gives a different graph, `(0,1), (0,2), (1,3), (2,3), (2,4)`. To avoid blending examples, the trace below follows that appendix edge list only.

**Example from the PDF appendix.** Start at `0` and examine neighbors in ascending numeric order.

| Removed | Newly discovered | Queue after expansion | Distance updates |
|---|---|---|---|
| `0` | `1, 2` | `[1,2]` | `d[1]=1, d[2]=1` |
| `1` | `3` | `[2,3]` | `d[3]=2` |
| `2` | `4` (`3` already seen) | `[3,4]` | `d[4]=2` |
| `3` | none | `[4]` | none |
| `4` | none | `[]` | none |

Visit order: `0,1,2,3,4`. One shortest path to `3` is `0 -> 1 -> 3` (two edges); another equal-length path is `0 -> 2 -> 3`.

## Time and space complexity

With adjacency lists, time is **O(V + E)** when the whole graph is covered: each vertex is enqueued once and each edge is inspected a constant number of times. Auxiliary space is **O(V)** for the visited/distance/parent arrays and queue. For a matrix representation, neighbor scanning adds another factor because each popped vertex may scan an entire row.

## Common mistakes and edge cases

- Marking `visited` only when dequeuing, allowing a vertex to be queued repeatedly.
- Claiming BFS finds minimum total weight in a weighted graph; its guarantee is minimum edge count when edges are unweighted/equal-cost.
- Reporting one traversal order as the only valid order without stating neighbor order.
- Forgetting disconnected components when the task asks to cover every vertex.
- Confusing queue order with sorted order; BFS uses discovery order, not global numeric sorting.

## Remember this

BFS = FIFO queue + mark-on-enqueue. It explores all vertices at distance `k` before expanding vertices at distance `k+1`; this is why it finds fewest-edge paths in unweighted graphs.

## Self-check (answers are in the separate answer key)

1. Which data structure makes BFS first-in, first-out?
2. When should a newly discovered vertex be marked visited?
3. Under ascending neighbor order, what are the BFS distances from `0` in the example graph to vertices `1`, `2`, and `3`?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
