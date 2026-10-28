# Articulation points

**Lesson ID:** `articulation`  
**Section:** Critical structure  
**Full PDF pages:** 16–18 (combined PDF). **Original source pages:** 4–6 (original source page labels). **Related concept overview:** PDF page 10.

## What this topic is and when it is useful

An articulation point (cut vertex) is a vertex whose removal increases the number of connected components. It helps identify single vertices whose failure can split a network.

**From the PDF:** Tarjan's DFS uses discovery times `tin` and low-link values `low`. For a non-root vertex `u`, if a DFS child `v` has `low[v] >= tin[u]`, `u` is an articulation point. The DFS root is special: it is an articulation point only if it has more than one DFS-tree child.

## Key terms and graph representation

- **`tin[u]`:** the timestamp when DFS first discovers `u`.
- **`low[u]`:** the earliest discovery time reachable from `u`'s DFS subtree using tree edges and at most one back edge, as the guide's overview describes it.
- **DFS-tree child:** a vertex first reached by a recursive DFS call from `u`.
- **Back edge:** an edge to an already visited non-parent vertex; it can lower `low`.
- **Root special case:** the DFS root has no parent and uses the child-count rule.

## Method step by step

1. Run DFS in each connected component; on entry to `u`, set `tin[u] = low[u] = timer` and increase the timer.
2. Count each DFS-tree child of `u`.
3. For a visited neighbor that is not the parent, update `low[u] = min(low[u], tin[neighbor])`.
4. After recursively exploring a child `v`, update `low[u] = min(low[u], low[v])`.
5. If `u` is not the root and `low[v] >= tin[u]` for any child `v`, mark `u` as an articulation point. If `u` is the root, mark it only when it has more than one DFS-tree child.

## Worked example and state changes

**Illustrative chain:** `0—1—2—3`, with DFS starting at `0` and visiting the next numbered neighbor first.

Discovery and low values are:

| Vertex | `tin` | `low` after return from child | Test |
|---|---:|---:|---|
| `0` | 0 | 0 | root has one DFS child → not an articulation point |
| `1` | 1 | 1 | child `2` has `low[2]=2 >= tin[1]=1` → articulation point |
| `2` | 2 | 2 | child `3` has `low[3]=3 >= tin[2]=2` → articulation point |
| `3` | 3 | 3 | no DFS child to test |

Removing `1` separates `{0}` from `{2,3}`; removing `2` separates `{0,1}` from `{3}`. In this chain, vertices `1` and `2` are articulation points.

## Time and space complexity

Each vertex and edge is examined a constant number of times in DFS, so time is **O(V + E)**. The adjacency list is O(V+E); `tin`, `low`, visited/result arrays and recursion stack use O(V) extra space. The PDF's algorithm is linear-time and uses O(V) auxiliary state beyond the graph.

## Common mistakes and edge cases

- Confusing `tin` (when discovered) with `low` (earliest reachable discovery time under the DFS/back-edge rule).
- Using `>` instead of `>=` for a non-root articulation point.
- Applying the non-root rule to the DFS root instead of counting root children.
- Updating `low[u]` with a neighbor's `low` for a back edge; the back-edge update uses the neighbor's `tin`.
- Assuming the parent-by-vertex code safely handles parallel edges; a multigraph should track edge IDs.

## Remember this

For non-root `u`, any child `v` with `low[v] >= tin[u]` makes `u` a cut vertex. The DFS root is a cut vertex only when it has more than one DFS-tree child. `tin` and `low` are different states.

## Self-check (answers are in the separate answer key)

1. What does `tin[u]` record, and how is it different from `low[u]`?
2. What is the non-root articulation condition for a DFS child `v`?
3. When is the DFS root an articulation point?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
