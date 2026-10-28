# Number of provinces

**Lesson ID:** `provinces`  
**Section:** Connectivity  
**Full PDF pages:** 24–25 (combined PDF). **Original source pages:** 12–13 (original source page labels). **Related concept overview:** PDF page 6.

## What this topic is and when it is useful

Number of Provinces counts connected components in an undirected city graph. It is useful when a city-connection matrix must be reduced to a count of connected groups. The input is an `N × N` connection matrix; cities can belong to the same province through direct or indirect connections.

**From the PDF:** scan all vertices; each unseen vertex starts one DFS/BFS and increments the province count. With a matrix, traversing neighbors means scanning a whole row, so DFS/BFS takes O(V²) time.

## Key terms and graph representation

- **Connection matrix:** `isConnected[i][j] = 1` means the input says city `i` and `j` are directly connected.
- **Connected component / province:** a maximal set of vertices connected through paths.
- **Visited:** prevents counting the same province more than once.
- **Outer loop:** ensures isolated cities and disconnected components are also counted.

## Method step by step

1. Let `V` be the number of rows in the square matrix; initialize every city unseen and `count = 0`.
2. Scan city IDs from `0` to `V-1`.
3. If a city is unseen, increment `count` and start DFS/BFS from it.
4. From city `u`, scan all columns `v`; if `isConnected[u][v] == 1` and `v` is unseen, visit `v`.
5. Continue the outer loop. Return `count` after every city has been considered.

## Worked example and state changes

**Small illustrative matrix (constructed for teaching):**
```text
    0 1 2 3
0 [ 1 1 0 0 ]
1 [ 1 1 0 0 ]
2 [ 0 0 1 0 ]
3 [ 0 0 0 1 ]
```

- Start at `0`: discover `1` through the matrix entry `matrix[0][1]=1`; component `{0,1}` is counted once. `count=1`.
- Continue scanning: `1` is already visited.
- City `2` is unseen and has no connection to `0` or `1`; traverse its component `{2}`. `count=2`.
- City `3` is also unseen; it forms `{3}`. `count=3`.

Result: **3 provinces**. The diagonal `1`s do not connect distinct cities by themselves.

## Time and space complexity

The matrix stores **O(V²)** values. The full matrix scan across DFS/BFS work is **O(V²)** time. The visited array and traversal stack/queue need **O(V)** auxiliary space. The PDF also gives a DSU variant with O(V² α(V)) time over the matrix entries; its simple DFS approach is usually the clearest starting point.

## Common mistakes and edge cases

- Counting only cities with direct links instead of counting whole components.
- Forgetting the outer loop, which misses isolated cities.
- Treating every `1` in the diagonal as a separate connection between cities.
- Assuming a matrix input has adjacency-list traversal complexity O(V+E); each row scan still checks V positions.
- Not respecting the assumption that the province connection matrix represents an undirected/symmetric relationship.

## Remember this

Every time the outer scan finds an unseen city, it has found a new province. Run one traversal to mark that entire component, then continue scanning.

## Self-check (answers are in the separate answer key)

1. What does each new unseen starting city contribute to the province count?
2. Why is the matrix-based traversal O(V²) rather than O(V+E)?
3. How many provinces are in the illustrative matrix above?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
