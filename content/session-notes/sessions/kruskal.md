# Kruskal minimum spanning tree

**Lesson ID:** `kruskal`  
**Section:** Spanning trees  
**Full PDF pages:** 26–29 (combined PDF). **Original source pages:** 14–17 (original source page labels). **Related concept overview:** PDF page 9.

## What this topic is and when it is useful

Kruskal's algorithm builds a minimum spanning tree (MST) by considering all edges in non-decreasing weight order and accepting only edges that connect different components.

**From the PDF:** it is an edge-centric greedy method that uses DSU to reject cycle-forming edges. A connected graph's MST has V−1 edges; if the graph is disconnected, the natural result is a minimum spanning forest.

## Key terms and graph representation

- **Spanning tree:** connects all vertices with no cycle and exactly V−1 edges.
- **MST:** a spanning tree with minimum total edge weight.
- **Greedy choice:** consider the lightest remaining edge first.
- **DSU `find`/`union`:** determine whether the endpoints already belong to the same component and merge them if not.
- **Cycle-forming edge:** rejected when both endpoints have the same DSU representative.

## Method step by step

1. Represent each undirected edge as `(u,v,w)` and sort all edges by weight ascending.
2. Initialize DSU so each vertex is its own component.
3. For each edge in order, find the representatives of `u` and `v`.
4. If representatives differ, accept the edge, union their sets, and add `w` to the total; otherwise reject it because it would form a cycle.
5. Stop after accepting V−1 edges for a connected graph. If fewer can be accepted, the graph is disconnected and the accepted edges form a forest.

## Worked example and state changes

**Example from the PDF's five-vertex Kruskal trace.** Sorted edge weights are `2,3,5,6,7,8,9`:

| Edge | Weight | Decision | Running total |
|---|---:|---|---:|
| `(0,1)` | 2 | accept; merge components | 2 |
| `(1,2)` | 3 | accept; merge | 5 |
| `(1,4)` | 5 | accept; merge | 10 |
| `(0,3)` | 6 | accept; all 5 vertices connected | 16 |
| `(2,4)` | 7 | reject; endpoints already connected | 16 |
| `(1,3)` | 8 | reject; would form a cycle | 16 |
| `(3,4)` | 9 | reject; would form a cycle | 16 |

Accepted MST edges: `(0,1),(1,2),(1,4),(0,3)`. There are V−1 = 4 accepted edges and total weight **16**.

## Time and space complexity

Sorting dominates: **O(E log E)** time, with DSU operations adding near-linear/amortized-near-constant work per edge. DSU arrays use O(V) space and the input edge list uses O(E). The guide also notes O(E log V) as an equivalent common bound for typical graph-size relationships.

## Common mistakes and edge cases

- Forgetting to sort edges by weight.
- Accepting an edge whose endpoints already share a DSU component.
- Stopping after considering V−1 edges rather than after **accepting** V−1 edges.
- Applying a spanning-tree result to a disconnected graph without noting it is a forest.
- Confusing Kruskal's minimum total tree cost with shortest paths from a particular source.

## Remember this

Kruskal is global and edge-first: sort, test DSU roots, accept only when roots differ, union, and stop when V−1 edges have been accepted (for a connected graph).

## Self-check (answers are in the separate answer key)

1. In what order does Kruskal examine edges?
2. Why is edge `(2,4)` of weight 7 rejected in the PDF trace?
3. How many edges does an MST on V connected vertices contain?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
