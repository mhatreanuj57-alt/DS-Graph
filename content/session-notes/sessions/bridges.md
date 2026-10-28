# Bridges in a network

**Lesson ID:** `bridges`  
**Section:** Critical structure  
**Full PDF pages:** 19–21 (combined PDF). **Original source pages:** 7–9 (original source page labels). **Related concept overview:** PDF page 10.

## What this topic is and when it is useful

A bridge is an undirected edge whose removal increases the number of connected components. Bridge detection is useful for finding single connections whose failure would split a network. Tarjan's DFS finds bridges by checking whether a child subtree can reach the parent or an ancestor through a back edge.

**From the PDF:** for DFS tree edge `(u,v)` with child `v`, the bridge condition is **`low[v] > tin[u]`**. This is a strict greater-than test, unlike the non-root articulation-point test.

## Key terms and graph representation

- **`tin[u]`:** discovery timestamp of vertex `u`.
- **`low[u]`:** earliest discovery time reachable from the subtree of `u` by tree edges and at most one back edge.
- **Tree edge `(u,v)`:** DFS discovers child `v` from `u`.
- **Back edge:** a non-tree edge to a previously discovered non-parent vertex.
- **Bridge:** the tree edge is a sole connection from the child's subtree to the rest of the component.

## Method step by step

1. Start DFS from every unvisited vertex; assign `tin[u] = low[u]` to a fresh timestamp.
2. For each neighbor `v`, skip the incoming parent edge in a simple graph.
3. If `v` is visited and is not the parent, update `low[u] = min(low[u], tin[v])`.
4. If `v` is unvisited, DFS into `v`, then update `low[u] = min(low[u], low[v])` on return.
5. If `low[v] > tin[u]`, report edge `(u,v)` as a bridge.

## Worked example and state changes

**Illustrative graph:** triangle `0—1—2—0`, followed by chain `1—3—4`. DFS starts at `0`, examining neighbors in ascending order.

- `tin[0]=0`, `tin[1]=1`, `tin[2]=2`. The edge `2—0` is a back edge, so `low[2]=0`; after returning, `low[1]=0`. Tree edges inside the triangle are not bridges because descendants can reach ancestor `0`.
- Then DFS visits `3`: `tin[3]=low[3]=3`; it visits `4`: `tin[4]=low[4]=4`.
- For child `4` of `3`, `low[4]=4 > tin[3]=3`, so `3—4` is a bridge.
- For child `3` of `1`, `low[3]=3 > tin[1]=1`, so `1—3` is a bridge.

This example demonstrates the strict `>` comparison: if a subtree can reach the parent or an ancestor, its `low` value is not greater than the parent's discovery time.

## Time and space complexity

A single DFS traversal over adjacency lists takes **O(V + E)** time. The graph uses O(V+E) storage; `tin`, `low`, visited flags and recursion stack use O(V) auxiliary space. The source's detailed implementation lists O(V+E) total space when graph storage is counted.

## Common mistakes and edge cases

- Using `>=` for bridge detection; the bridge test is strictly `low[child] > tin[parent]`.
- Setting a back-edge update from `low[neighbor]` instead of `tin[neighbor]` in the standard DFS rule.
- Confusing a bridge edge with an articulation vertex.
- Ignoring disconnected components.
- Skipping all edges to the parent vertex in a multigraph; a parallel edge can be an alternate route, so track edge IDs.

## Remember this

A DFS tree edge `(u,v)` is a bridge if `low[v] > tin[u]`. `tin` records discovery; `low` records the earliest discovery time reachable through the subtree/back-edge rule.

## Self-check (answers are in the separate answer key)

1. What is the strict bridge condition for DFS parent `u` and child `v`?
2. Why are the triangle edges in the example not bridges?
3. What is the difference between `tin` and `low`?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
