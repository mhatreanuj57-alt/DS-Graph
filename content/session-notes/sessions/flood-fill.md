# Flood fill

**Lesson ID:** `flood-fill`  
**Section:** Grid graphs  
**Full PDF pages:** 46–48 (combined PDF). **Original source pages:** 34–36 (original source page labels). **Related concept overview:** PDF page 6.

## What this topic is and when it is useful

Flood fill changes the color/value of the connected region containing a starting cell, but only cells that match the starting cell's original color are part of that region. It is useful for bucket-fill tools and connected-region updates in grids.

**From the PDF:** model each cell as a vertex and allowed neighbor moves as edges. The supplied guide uses four-directional grid neighbors and warns to return immediately when the starting color already equals the target color.

## Key terms and graph representation

- **Cell `(r,c)`:** an implicit graph vertex.
- **Four-neighbor adjacency:** up, right, down, left; diagonals are not included unless the problem says so.
- **Original color:** the color at the source before recoloring begins.
- **Reachable matching region:** cells connected to the source through cells of that original color.
- **Visited marker:** recoloring itself can mark a cell as processed if target color differs from original color.

## Method step by step

1. Read `original = image[sr][sc]`.
2. If `original == newColor`, return the image immediately; changing nothing is already the correct result.
3. Start DFS/BFS at `(sr,sc)` and recolor it to `newColor` when discovered.
4. Check the four neighbors. Visit only in-bounds cells whose value still equals `original`.
5. Recolor each eligible cell at discovery time, so it is not added repeatedly. Stop when the frontier is empty.

## Worked example and state changes

**Illustrative 4-neighbor example:** starting grid, source `(1,1)`, new color `2`:
```text
1 1 1
1 1 0
1 0 1
```

- Recolor `(1,1)` from `1` to `2`.
- Its matching four-neighbors include `(0,1)` and `(1,0)`; recolor and expand from them.
- Expansion reaches `(0,0)`, `(0,2)`, and `(2,0)` through the connected `1` region.
- The `1` at `(2,2)` remains unchanged because water/zero cells block every four-neighbor route to it.

Result:
```text
2 2 2
2 2 0
2 0 1
```


## Time and space complexity

For an R × C grid, each cell is checked/recolored at most a constant number of times, so time is **O(RC)** in the worst case. The queue or recursion stack can hold **O(RC)** cells in the worst case. A separate visited matrix is optional when recoloring marks a cell immediately and the source color differs from the target color.

## Common mistakes and edge cases

- Including diagonal neighbors when only four directions are allowed.
- Comparing a neighbor with the new color instead of the original source color.
- Forgetting bounds checks before indexing a neighbor.
- Marking a cell only after removing it from the queue, causing duplicates.
- Omitting the `original == newColor` early return; without it, recoloring cannot serve as a visited marker and careless code can repeat work.

## Remember this

Flood fill is a traversal over cells equal to the source's original color. Capture that original color once, validate four neighbors, and recolor on discovery.

## Self-check (answers are in the separate answer key)

1. Which color should each candidate cell be compared against?
2. Why should the algorithm return early when `original == newColor`?
3. Does a diagonal-only touch connect two cells under four-neighbor flood fill?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
