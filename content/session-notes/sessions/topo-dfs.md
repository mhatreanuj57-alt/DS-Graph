# Topological sort with DFS

**Lesson ID:** `topo-dfs`  
**Section:** DAGs  
**Full PDF pages:** 52–54 (combined PDF). **Original source pages:** 40–42 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

DFS-based topological sorting uses finishing times: recursively explore successors, then push a vertex only after all its outgoing neighbors have finished. It is useful for producing a dependency order when the graph is a DAG. Reverse the finishing order to get a topological order for a DAG.

**From the PDF:** directed cycle detection can use three states—unseen, active, and complete. An edge to an active vertex is a back edge and signals a directed cycle.

## Key terms and graph representation

- **Unseen:** DFS has not started for the vertex.
- **Active:** DFS is currently exploring the vertex; it is on the recursion path.
- **Complete:** DFS finished all its outgoing neighbors.
- **Finish order:** order in which recursive calls exit.
- **Reverse finish order:** topological order when the graph is acyclic.

## Method step by step

1. Set each vertex state to unseen.
2. Start DFS from every unseen vertex.
3. On entry, mark a vertex active.
4. For each outgoing neighbor: recurse if unseen; if active, report a cycle; if complete, no cycle is implied by that edge alone.
5. After every neighbor is handled, mark the vertex complete and append it to a finish list/stack.
6. If no cycle is found, reverse the finish list.

## Worked example and state changes

**Illustrative DAG:** `0→1`, `0→2`, `1→3`, `2→3`. Examine neighbors in ascending order.

- Enter `0`, then `1`, then `3`. Finish `3`; finish `1`.
- Return to `0`, then visit `2`. Its neighbor `3` is already complete, so no new recursive call is needed; finish `2`.
- Finish `0`.

Finish list (append on exit): `[3,1,2,0]`.
Reverse it: `[0,2,1,3]`.

Check all edges: `0` comes before `1` and `2`; both `1` and `2` come before `3`. Another neighbor order could produce another valid topological order.

## Time and space complexity

With adjacency lists, DFS visits each vertex and edge a constant number of times: **O(V + E)** time. The state array, finish list, and recursion stack need **O(V)** auxiliary space.

## Common mistakes and edge cases

- Pushing a vertex on entry rather than after all outgoing neighbors finish.
- Forgetting to reverse the finishing order.
- Using only one visited flag and missing a back edge to an active ancestor.
- Assuming an edge to any visited vertex means a cycle; an edge to a complete vertex alone is not enough.
- Failing to start DFS from all unseen vertices in a disconnected directed graph.

## Remember this

DFS topological sort means “finish first, append on exit, then reverse.” Use active-state detection to reject a graph with a directed cycle.

## Self-check (answers are in the separate answer key)

1. At what point is a vertex added to the DFS finish list?
2. What does an edge to an active vertex indicate?
3. What operation turns the finish list into the topological order?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
