# Number of islands

**Lesson ID:** `islands`  
**Section:** Grid graphs  
**Full PDF pages:** 62–64 (combined PDF). **Original source pages:** 50–52 (original source page labels). **Related concept overview:** PDF page 6.

## What this topic is and when it is useful

Number of Islands counts connected groups of land in a binary grid. The guide models each `'1'` cell as a vertex and adjacent land cells as undirected edges; water cells (`'0'`) are not part of a land component.

It is useful for connected-region counting in images, maps, and occupancy grids. The problem is a connected-components task on an implicit grid graph.

## Key terms and graph representation

- **Land:** a cell containing `'1'`.
- **Water:** a cell containing `'0'`.
- **Island:** a maximal group of land connected using permitted adjacent moves.
- **Implicit graph:** the graph is not stored as explicit vertices and edge objects; neighbors are calculated from row/column offsets.
- **Visited:** records land that is already assigned to a counted island.

## Method step by step

1. Set `islands = 0` and scan every grid cell in row-major order.
2. When a cell is water or already visited, continue.
3. When an unseen land cell is found, increment `islands` and start DFS/BFS from it.
4. Visit its in-bounds four-neighbor land cells and mark each land cell visited when discovered.
5. Resume the scan. The next unseen land cell must belong to a different island.

## Worked example and state changes

**Illustrative 3 × 3 grid; four-neighbor connectivity:**
```text
1 1 0
0 1 0
1 0 1
```

- Scan `(0,0)`: it is land, so `islands = 1`. Traversal marks `(0,0)`, `(0,1)`, and `(1,1)`.
- Continue scanning; those cells are already visited.
- At `(2,0)`, find new land, so `islands = 2`. It has no four-neighbor land connection to the first group.
- At `(2,2)`, find another new land cell, so `islands = 3`.

Answer: **3 islands**. The land at `(2,0)` and `(2,2)` is not connected just because it is nearby diagonally to other positions.

## Time and space complexity

For an R × C grid, the scan looks at RC cells, and each land cell is visited at most once: time is **O(RC)**. The visited structure or DFS/BFS frontier can use **O(RC)** space in the worst case. If the grid may be modified, marking visited land in place can avoid a separate visited matrix, subject to the problem's input-mutation rules.

## Common mistakes and edge cases

- Counting every land cell as a separate island instead of traversing its whole component.
- Starting traversal only once and missing later components.
- Accidentally allowing diagonal connections in a four-neighbor version.
- Failing to mark visited cells, which can loop on adjacent land.
- Forgetting to check row and column bounds.

## Remember this

Each unseen land cell starts exactly one island traversal. Count it, mark its entire connected land region, then continue the scan.

## Self-check (answers are in the separate answer key)

1. What does one island correspond to in graph terminology?
2. How many islands are in the illustrative grid?
3. What is the worst-case time complexity for an R × C grid?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
