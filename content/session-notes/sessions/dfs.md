# Depth-first search

**Lesson ID:** `dfs`  
**Section:** Traversal  
**Full PDF pages:** 71–74 (combined PDF). **Original source pages:** 59–62 (original source page labels). **Related concept overview:** PDF page 5.

## What this topic is and when it is useful

Depth-first search (DFS) follows one branch as far as possible before backtracking. It is useful for exploring reachability, finding connected components, detecting cycles, and supporting topological sorting and low-link algorithms.

**From the PDF:** DFS can use recursive calls (the call stack) or an explicit LIFO stack. Traversal order depends on neighbor order, and DFS does not generally find shortest paths.

## Key terms and graph representation

- **Recursive call stack:** records the active chain of DFS calls.
- **LIFO stack:** last in, first out.
- **Visited:** prevents repeated processing and infinite loops on cyclic graphs.
- **Backtracking:** return from a vertex after all of its neighbors have been considered.
- **DFS tree edge:** an edge used to first discover a vertex.

## Method step by step

1. Mark the current vertex `u` visited and add it to the output.
2. Examine neighbors in the stated order.
3. For each unseen neighbor `v`, set its parent to `u` if needed and recursively explore `v`.
4. When every neighbor is handled, return to the caller; that is backtracking.
5. To cover a disconnected graph, run DFS from every vertex still unvisited.

## Worked example and state changes

**Example from the PDF DFS trace.** Use the undirected reference graph with edges `(0,1), (1,2), (1,3), (2,3), (2,4)`, start at `0`, and examine neighbors in ascending order.

| Event | Active call stack (top first) | State change |
|---|---|---|
| Enter `0` | `[0]` | visit `0`; recurse to `1` |
| Enter `1` | `[1,0]` | visit `1`; recurse to `2` |
| Enter `2` | `[2,1,0]` | visit `2`; recurse to `3` |
| Enter `3` | `[3,2,1,0]` | visit `3`; its remaining neighbors are already visited, so return |
| Resume `2` | `[2,1,0]` | visit next unseen neighbor `4` |
| Enter `4` | `[4,2,1,0]` | visit `4`; return and unwind |

Order: `0,1,2,3,4`. The actual sequence of visits matches BFS here, but the *mechanism* differs: DFS completes the `0-1-2-3` branch before visiting `4`.

## Time and space complexity

With adjacency lists, full traversal takes **O(V + E)** time because every vertex is visited once and every adjacency entry is checked. The visited array and worst-case recursion/explicit stack use **O(V)** space. A very deep graph can make recursive DFS use a deep call stack; iterative DFS avoids the language's recursion-depth limit but still needs stack memory.

## Common mistakes and edge cases

- Leaving out the visited check, causing recursion loops on cycles.
- Forgetting to backtrack mentally when reading a recursive trace.
- Assuming DFS returns a shortest path.
- Giving a traversal order without specifying neighbor order.
- Running only from one start vertex when all disconnected components must be processed.

## Remember this

DFS = go deep, then backtrack. It is a building block for cycle detection, topological sorting, components, bridges, and articulation points; use BFS instead when you need fewest-edge distance in an unweighted graph.

## Self-check (answers are in the separate answer key)

1. What does DFS do when the current vertex has no unvisited neighbors left?
2. Which structure is LIFO: BFS queue or the DFS call stack?
3. With the reference graph and ascending neighbors, which vertex is visited immediately after DFS backtracks from `3` to `2`?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
