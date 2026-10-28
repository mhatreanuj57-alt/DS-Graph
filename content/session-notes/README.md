# Graph Data Structures — Session Notes

Beginner-friendly notes for the 22 requested DS-Graph lessons, based on `Graph_Data_Structures_Professional_Guide.pdf`.

## How page references work

- **Full PDF pages** means the 1–85 page count of the supplied combined PDF.
- **Original source pages** means the page labels listed in the PDF's source page map for the original appendix item. The PDF's introductory learning module occupies pages 1–12; the original reference appendix begins at full-PDF page 13.
- **Module overview** points to the related concept pages in the PDF's first 12 pages when they provide shared context.

## Evidence and teaching examples

Each lesson separates what the supplied PDF states from the worked walkthrough. Examples are marked either **from the PDF** or **illustrative**. Illustrative examples are constructed teaching inputs; their specific values are not attributed to the PDF. No outside research is used. Neighbor order is stated wherever it affects BFS/DFS traces. Weighted algorithms include edge weights and explicit distance/cost updates. `tin` is discovery time; `low` is the earliest discovery time reachable under the DFS subtree/back-edge rule described in the guide.

## Table of contents

### Foundations

- [graph-structures — Graph structures & representations](sessions/graph-structures.md)

### Traversal

- [bfs — Breadth-first search](sessions/bfs.md)
- [dfs — Depth-first search](sessions/dfs.md)

### Connectivity

- [provinces — Number of provinces](sessions/provinces.md)
- [dsu — Disjoint set union](sessions/dsu.md)

### Grid graphs

- [flood-fill — Flood fill](sessions/flood-fill.md)
- [islands — Number of islands](sessions/islands.md)
- [rotting-oranges — Rotting oranges](sessions/rotting-oranges.md)

### DAGs

- [kahn — Topological sort with Kahn’s algorithm](sessions/kahn.md)
- [course-schedule — Course schedule](sessions/course-schedule.md)
- [topo-dfs — Topological sort with DFS](sessions/topo-dfs.md)

### Cycles

- [directed-cycle — Directed cycle detection](sessions/directed-cycle.md)
- [bfs-cycle — Undirected cycle detection with BFS](sessions/bfs-cycle.md)
- [dfs-cycle — Undirected cycle detection with DFS](sessions/dfs-cycle.md)

### Shortest paths

- [dijkstra — Dijkstra shortest paths](sessions/dijkstra.md)
- [bellman-ford — Bellman–Ford](sessions/bellman-ford.md)
- [flights — Cheapest flights with K stops](sessions/flights.md)

### Spanning trees

- [kruskal — Kruskal minimum spanning tree](sessions/kruskal.md)
- [prim — Prim minimum spanning tree](sessions/prim.md)

### Critical structure

- [articulation — Articulation points](sessions/articulation.md)
- [bridges — Bridges in a network](sessions/bridges.md)
- [kosaraju — Strongly connected components](sessions/kosaraju.md)

- [Separate self-check answer key](ANSWER_KEY.md)

## Notes conventions

- Every session is self-contained and includes a topic description, graph model/terms, step-by-step method, worked state trace, complexity, pitfalls, a short summary, and three self-check questions.
- The answer key is separate; lesson files intentionally do not reveal the answers next to each question.
- In any source inconsistency or example switch, the notes identify the exact example graph and do not silently merge examples.
