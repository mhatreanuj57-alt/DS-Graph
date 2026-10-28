# Strongly connected components

**Lesson ID:** `kosaraju`  
**Section:** Critical structure  
**Full PDF pages:** 13–15 (combined PDF). **Original source pages:** 1–3 (original source page labels). **Related concept overview:** PDF page 10.

## What this topic is and when it is useful

A strongly connected component (SCC) in a directed graph is a maximal set of vertices where every vertex can reach every other vertex in the same set. SCC grouping is useful for summarizing mutual reachability in directed networks. Kosaraju's algorithm finds all SCCs with two DFS passes and a graph transpose.

**From the PDF:** first DFS on the original graph pushes vertices on exit/finish time; reverse all edge directions to create the transpose; then process vertices in stack order and run DFS in the transpose from each still-unvisited vertex to extract one SCC.

## Key terms and graph representation

- **Strong reachability:** every ordered pair of vertices in the component is mutually reachable.
- **Finish-time stack:** vertices are pushed when the first DFS call exits.
- **Transpose graph `Gᵀ`:** every edge `u→v` becomes `v→u`.
- **SCC:** a maximal mutually reachable vertex set.
- **Component DAG:** if each SCC is collapsed to one component node, inter-component edges form a DAG.

## Method step by step

1. On original graph `G`, run DFS from every unseen vertex. Push each vertex only after all outgoing neighbors finish.
2. Build `Gᵀ` by reversing every directed edge.
3. Clear the visited state for the second pass.
4. Pop vertices from the finish stack. If a popped vertex is unseen in `Gᵀ`, run DFS from it and collect all reached vertices as one SCC.
5. Continue until the stack is empty. Each second-pass DFS tree forms one component.

## Worked example and state changes

**Illustrative directed graph:** `0→1`, `1→2`, `2→0`, `2→3`, `3→4`, `4→3`, `4→5`.

- Vertices `{0,1,2}` are mutually reachable around the directed cycle `0→1→2→0`.
- Vertices `{3,4}` are mutually reachable through `3→4` and `4→3`.
- Vertex `{5}` is a singleton SCC: it can be reached from `4`, but the graph contains no route from `5` back to `4`.

The first DFS pass records finish order; after edge reversal, popping the stack and traversing the transpose extracts `{0,1,2}`, then `{3,4}`, then `{5}` (the precise vertex order inside a component depends on neighbor order).

## Time and space complexity

First DFS is **O(V+E)**, transposing all edges is **O(V+E)**, and second DFS is **O(V+E)**. Total time remains **O(V + E)**. The transpose graph takes O(V+E) space; stack, visited array, and component collection take O(V) additional space.

## Common mistakes and edge cases

- Forgetting to push after DFS finishes; the order must be based on finish time, not entry time.
- Reversing only some edges when building the transpose.
- Not resetting visited state before the second DFS pass.
- Running the second pass on the original graph instead of `Gᵀ`.
- Confusing a one-way reachable set with an SCC; strong connectivity requires mutual reachability.

## Remember this

Kosaraju = **finish-time stack on G → transpose G → DFS in stack-pop order**. Every second-pass DFS in the transpose yields one SCC.

## Self-check (answers are in the separate answer key)

1. When is a vertex pushed onto Kosaraju’s first-pass stack?
2. How is `Gᵀ` constructed from edge `u→v`?
3. Why is `{5}` a separate SCC in the illustrative graph?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
