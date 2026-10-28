# Graph structures & representations

**Lesson ID:** `graph-structures`  
**Section:** Foundations  
**Full PDF pages:** 80–85 (combined PDF). **Original source pages:** 68–73 (original source page labels). **Related concept overview:** PDF page 3–4.

## What this topic is and when it is useful

A graph is a non-linear data structure for representing entities and their relationships. The guide defines a graph as **G = (V, E)**: `V` is the set of vertices (nodes) and `E` is the set of edges. Graphs are useful when relationships are not naturally a single line or a strict tree: roads between locations, social connections, or one-way dependencies.

**From the PDF:** Edges may be directed or undirected, weighted or unweighted. Graphs may be connected or disconnected, cyclic or acyclic. A tree is a connected, acyclic undirected graph; a forest is a disjoint union of trees. The guide recommends adjacency lists for sparse graphs and matrices when constant-time edge lookup or matrix-shaped input is useful.

## Key terms and graph representation

- **Vertex / node:** one entity, such as city `2`.
- **Edge:** a relationship between two vertices.
- **Directed edge `u -> v`:** travel only in the arrow direction.
- **Undirected edge `u — v`:** the relationship works both ways.
- **Weight:** a numeric cost attached to an edge; no listed weight means unweighted, not weight zero.
- **Adjacency list:** for each vertex, store its neighbors.
- **Adjacency matrix:** a `V × V` table; `matrix[u][v]` indicates whether the edge exists for an unweighted graph.

**Representation from the PDF's five-vertex reference graph:** vertices `{0,1,2,3,4}`, undirected edges `(0,1), (1,2), (1,3), (2,3), (2,4)`.

## Method step by step

1. List every vertex, including isolated vertices.
2. Record each edge once in a canonical edge list; preserve direction and any weight.
3. For an undirected adjacency list, add each edge to both endpoints' neighbor lists. For a directed graph, add `v` to `adj[u]` for `u -> v` only.
4. To build an adjacency matrix for an undirected graph, mark both `[u][v]` and `[v][u]`. For a directed graph, mark only the arrow's cell.
5. Keep algorithm state (`visited`, `parent`, `distance`, `indegree`, `tin`, `low`) separate from the graph topology.

## Worked example and state changes

**Example from the PDF — undirected reference graph**

Edge list: `(0,1), (1,2), (1,3), (2,3), (2,4)`.

Adjacency list:
```text
0: [1]
1: [0, 2, 3]
2: [1, 3, 4]
3: [1, 2]
4: [2]
```

Adjacency matrix, with rows and columns ordered `0,1,2,3,4`:
```text
    0 1 2 3 4
0 [ 0 1 0 0 0 ]
1 [ 1 0 1 1 0 ]
2 [ 0 1 0 1 1 ]
3 [ 0 1 1 0 0 ]
4 [ 0 0 1 0 0 ]
```

Check the state: matrix `[1][3] = 1` because `1—3` exists, and `[3][1] = 1` because this graph is undirected.

## Time and space complexity

For an adjacency list, storage is **O(V + E)** because we store the vertices and their edge incidences; listing neighbors of `u` takes **O(degree(u))**. For an adjacency matrix, storage is **O(V²)** even when few edges exist, while checking whether a particular edge exists takes **O(1)** by direct indexing. In an undirected list, each edge appears in two neighbor lists, which changes a constant factor, not the Big-O bound.

## Common mistakes and edge cases

- Forgetting to add an undirected edge at both endpoints.
- Reversing or ignoring arrow direction in a directed graph.
- Treating a missing weight as a weight of zero.
- Assuming a graph has one root or that all vertices are connected.
- Assuming layout proximity implies an edge; only the explicit edge data determines connectivity.

## Remember this

Choose the representation from the operations you need. Lists are usually a good fit for sparse graphs and neighbor traversal; matrices are useful for dense graphs and constant-time edge lookup. Preserve graph direction, weights, and isolated vertices.

## Self-check (answers are in the separate answer key)

1. What do `V` and `E` mean in `G = (V, E)`?
2. In an undirected adjacency list, how should edge `2—4` be recorded?
3. Which representation uses O(V²) space and supports O(1) edge-existence lookup?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
