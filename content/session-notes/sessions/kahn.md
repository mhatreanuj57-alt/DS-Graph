# Topological sort with Kahn’s algorithm

**Lesson ID:** `kahn`  
**Section:** DAGs  
**Full PDF pages:** 43–45 (combined PDF). **Original source pages:** 31–33 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

Topological sorting arranges vertices of a directed acyclic graph (DAG) so every edge `u -> v` places `u` before `v`. Kahn's algorithm is useful for dependency ordering and builds the order by repeatedly removing vertices with indegree zero.

**From the PDF:** if fewer than V vertices are emitted, a directed cycle remains. There may be more than one valid topological order.

## Key terms and graph representation

- **DAG:** directed acyclic graph.
- **Indegree:** number of directed edges entering a vertex.
- **Zero-indegree vertex:** currently has no remaining prerequisites; it can be emitted next.
- **Queue:** stores vertices whose indegree has reached zero.
- **Topological order:** an order where every directed edge points forward in the order.

## Method step by step

1. Calculate indegree for every vertex by counting incoming edges.
2. Enqueue every vertex whose indegree is zero.
3. Remove the front vertex `u`, append it to the output, and inspect each outgoing edge `u -> v`.
4. Decrease `indegree[v]` by one. When it becomes zero, enqueue `v`.
5. At the end, if the output contains V vertices, it is a topological order. If it contains fewer, the graph contains a directed cycle.

## Worked example and state changes

**Example from the PDF:**
`V = {0,1,2,3,4,5}`
`E = {5->0, 5->2, 4->0, 4->1, 2->3, 3->1}`

Initial indegrees: `indegree(0)=2`, `indegree(1)=2`, `indegree(2)=1`, `indegree(3)=1`, `indegree(4)=0`, `indegree(5)=0`. Initial queue is `[4,5]` (this tie-breaking order is stated by the guide).

1. Pop `4`: append it; reduce `indegree(0): 2→1` and `indegree(1): 2→1`.
2. Pop `5`: append it; reduce `indegree(0): 1→0` and enqueue `0`; reduce `indegree(2): 1→0` and enqueue `2`.
3. Pop `0`, then `2`; removing edge `2→3` changes `indegree(3): 1→0`, so enqueue `3`.
4. Pop `3`; `indegree(1): 1→0`, enqueue `1`; finally pop `1`.

Output: `[4,5,0,2,3,1]`, a valid topological order.

## Time and space complexity

With adjacency lists, calculating indegrees scans all vertices and edges, and each edge is decremented once during processing. Total time is **O(V + E)**. The indegree array, queue, and output use **O(V)** auxiliary space, aside from the graph itself.

## Common mistakes and edge cases

- Decreasing indegree for incoming rather than outgoing edges after removing `u`.
- Enqueuing a vertex when indegree is merely small, rather than exactly zero.
- Forgetting that more than one valid order can exist.
- Assuming every directed graph has a topological order; a directed cycle prevents a complete output.
- Processing only one zero-indegree vertex when several are available; any valid choice is fine if dependencies are preserved.

## Remember this

Kahn = indegrees + queue. Remove ready vertices, decrement their outgoing neighbors, and enqueue neighbors when their indegree reaches zero. If fewer than V vertices leave the queue, a cycle blocks the ordering.

## Self-check (answers are in the separate answer key)

1. What must be true of a vertex before Kahn’s algorithm can enqueue it?
2. What does it mean if the final output has fewer than V vertices?
3. Which edge update is performed after removing vertex `u`: update incoming neighbors or outgoing neighbors?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
