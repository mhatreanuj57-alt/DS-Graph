# Prim minimum spanning tree

**Lesson ID:** `prim`  
**Section:** Spanning trees  
**Full PDF pages:** 33–35 (combined PDF). **Original source pages:** 21–23 (original source page labels). **Related concept overview:** PDF page 9.

## What this topic is and when it is useful

Prim's algorithm grows one minimum spanning tree outward from a chosen start vertex. At each step, it picks the lightest edge connecting a vertex already in the tree to a vertex outside it.

**From the PDF:** Prim is vertex/tree-centric, commonly implemented with an adjacency list and min-heap. The MST has V−1 edges for a connected graph and minimizes the total edge weight, not the distance from the source to every other vertex.

## Key terms and graph representation

- **Visited / in tree:** vertices already added to the growing tree.
- **Cut edge:** an edge from the current tree to an unvisited vertex.
- **Min-heap:** stores candidate `(weight, vertex)` entries.
- **MST total:** sum of accepted edge weights.
- **Stale candidate:** heap entry for a vertex that has already been added; skip it.

## Method step by step

1. Choose a starting vertex, mark all vertices initially outside the tree, and push `(0,start)` into a min-heap.
2. Pop the lightest candidate `(w,u)`.
3. If `u` is already visited, skip this stale entry. Otherwise mark it visited and add `w` to the MST total (the start's zero contributes nothing).
4. Push each edge `(u,v,w)` to an unvisited neighbor `v` into the heap.
5. Continue until every vertex has joined the tree or the heap empties. For a disconnected graph, restart from another unvisited vertex if constructing a minimum spanning forest.

## Worked example and state changes

**Illustrative execution using the PDF Kruskal edge set:** undirected edges `(0,1,2)`, `(1,2,3)`, `(1,4,5)`, `(0,3,6)`, `(2,4,7)`, `(1,3,8)`, `(3,4,9)`. Start at `0`.

- Add `0` with cost `0`; candidates include `(2,1)` and `(6,3)`.
- Pop `(2,1)`: add vertex `1`, total `2`; offer `(3,2)`, `(5,4)`, `(8,3)`.
- Pop `(3,2)`: add vertex `2`, total `5`; offer `(7,4)` (plus other candidates as applicable).
- Pop `(5,4)`: add vertex `4`, total `10`; skip later candidates for already visited `4`.
- Pop `(6,3)`: add vertex `3`, total `16`.

The resulting tree edges are `(0,1,2)`, `(1,2,3)`, `(1,4,5)`, `(0,3,6)`, with V−1 = 4 edges and total weight **16**. Heap tie order may vary, but the MST total and a valid MST remain the key checks.

## Time and space complexity

With an adjacency list and binary heap, the guide gives **O((V + E) log V)** time (often shortened to O(E log V) for connected graph conventions). Adjacency storage is O(V+E); visited, heap, and related state use O(V) or O(E) worst-case candidate storage.

## Common mistakes and edge cases

- Choosing the smallest edge anywhere in the graph even when it does not touch the current tree; that is closer to Kruskal's strategy.
- Adding all heap entries to the total, including stale entries.
- Forgetting to skip a vertex that is already in the tree.
- Confusing an MST with Dijkstra's shortest-path tree.
- Assuming a disconnected graph can have one tree spanning all vertices.

## Remember this

Prim grows one tree from a start. Repeatedly take the smallest cut edge from the heap, add a new vertex once, and update the frontier.

## Self-check (answers are in the separate answer key)

1. What kind of edge does Prim choose at each step?
2. Why can an already visited vertex popped from the heap be skipped?
3. What is the MST total in the illustrative example?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
