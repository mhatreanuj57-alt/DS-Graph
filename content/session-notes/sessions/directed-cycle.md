# Directed cycle detection

**Lesson ID:** `directed-cycle`  
**Section:** Cycles  
**Full PDF pages:** 55–57 (combined PDF). **Original source pages:** 43–45 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

A directed cycle is a directed path that returns to a vertex already on that path. DFS cycle detection is useful for checking whether a directed dependency graph has a circular dependency. It detects one by finding an edge to a vertex that is still active in the current recursion path.

**From the PDF:** distinguish globally visited vertices from vertices currently on the DFS path. A directed edge to a completed vertex alone is not evidence of a cycle.

## Key terms and graph representation

- **`visited` / `vis`:** the vertex has been encountered at some point.
- **`pathVisited` / active state:** the vertex belongs to the current DFS recursion path.
- **Back edge:** an edge from the current exploration to an active vertex.
- **Directed edge:** only follows the arrow; reverse travel is not implied.

## Method step by step

1. Initialize `visited` and `pathVisited` to false for every vertex.
2. For every unseen vertex, start DFS; set both flags true on entry.
3. For each outgoing neighbor `v`, recurse if it has never been visited.
4. If `v` is already visited and `pathVisited[v]` is true, a back edge has been found: return cycle=true.
5. When a vertex has no more outgoing edges to explore, set its `pathVisited` false before returning. If every component finishes without a back edge, there is no directed cycle.

## Worked example and state changes

**Illustrative directed graph:** edges `0→1`, `1→2`, `2→1`, `2→3`; neighbors are examined in listed order.

- DFS enters `0`: active path `[0]`.
- Enter `1`: active path `[0,1]`.
- Enter `2`: active path `[0,1,2]`.
- Examine `2→1`. Vertex `1` is already visited **and still active** on the current path.
- The edge `2→1` closes the cycle `1→2→1`; report a cycle. Vertex `3` need not be explored to prove that one exists.

Contrast: an edge from a later branch to a vertex that has fully completed is not by itself a directed cycle.

## Time and space complexity

With adjacency lists, time is **O(V + E)**: each vertex becomes active once and each edge is checked at most once. `visited`, active-state tracking, and recursion stack take **O(V)** space.

## Common mistakes and edge cases

- Confusing `visited` with “currently active.”
- Never clearing the active/path flag when recursion returns.
- Treating an edge to a completed vertex as a cycle automatically.
- Ignoring edge direction.
- Testing from only one start node and missing cycles in a separate component.

## Remember this

For directed DFS, the decisive signal is an edge to an **active ancestor/current-path vertex**, not just any previously visited vertex.

## Self-check (answers are in the separate answer key)

1. What extra information does `pathVisited` track beyond `visited`?
2. If an edge reaches a complete vertex, does that alone prove a directed cycle?
3. Which edge in the example proves a cycle?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
