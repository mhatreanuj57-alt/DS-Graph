# Rotting oranges

**Lesson ID:** `rotting-oranges`  
**Section:** Grid graphs  
**Full PDF pages:** 58–61 (combined PDF). **Original source pages:** 46–49 (original source page labels). **Related concept overview:** PDF page 6.

## What this topic is and when it is useful

Rotting Oranges uses multi-source BFS to model rot spreading through a grid. It is useful for simulating simultaneous spread in discrete time steps. Every initially rotten orange is a source, and each minute rot can reach fresh oranges in the four adjacent directions.

**From the PDF:** enqueue all initially rotten cells before processing the first BFS layer. Mark a fresh orange rotten when enqueuing it; process one queue layer per minute. Return `-1` if fresh oranges remain unreachable; if there are no fresh oranges initially, the result is `0`.

## Key terms and graph representation

- **Multi-source BFS:** one BFS queue starts with all source vertices together.
- **Fresh orange (`1`):** can be changed to rotten by an adjacent rotten orange.
- **Rotten orange (`2`):** an initial or newly activated BFS source.
- **BFS layer:** cells reached after the same number of propagation minutes.
- **Fresh count:** helps stop once all fresh oranges have rotted.

## Method step by step

1. Scan the grid: enqueue every rotten orange and count every fresh orange.
2. If `freshCount == 0`, return `0`.
3. While the queue is non-empty and fresh oranges remain, record the current queue size as the layer size and advance the minute counter by one.
4. Process only that many queue entries. For each rotten orange, inspect four in-bounds neighbors; when a neighbor is fresh, mark it rotten immediately, decrement `freshCount`, and enqueue it.
5. If `freshCount == 0`, return the elapsed minutes; otherwise the remaining fresh orange(s) cannot be reached and the answer is `-1`.

## Worked example and state changes

**Illustrative example:**
```text
2 1 1
1 1 0
0 1 1
```
Initial queue: `[(0,0)]`; fresh count = `6`.

| Minute/layer | Newly rotten cells | Fresh count after layer |
|---|---|---:|
| 1 | `(0,1)`, `(1,0)` | 4 |
| 2 | `(0,2)`, `(1,1)` | 2 |
| 3 | `(2,1)` | 1 |
| 4 | `(2,2)` | 0 |

All fresh oranges rot after **4 minutes**. The two cells in a layer rot during the same minute; neither should make the other count as an extra minute.

## Time and space complexity

For an R × C grid, every cell is enqueued/dequeued at most once and has four neighbor checks, giving **O(RC)** time. The queue can contain O(RC) coordinates in the worst case, so auxiliary space is **O(RC)**. The grid itself can be used to mark newly rotten cells, avoiding a second visited matrix.

## Common mistakes and edge cases

- Starting BFS from only one rotten orange instead of every initially rotten orange.
- Incrementing minutes for every popped orange instead of per complete layer.
- Enqueuing a fresh cell before marking it rotten, allowing duplicate entries.
- Returning `0` when a fresh orange remains unreachable; that case is `-1`.
- Returning a positive minute count when there were no fresh oranges at the start.

## Remember this

Put every initial rotten orange in the queue before BFS starts. One complete layer equals one minute. At the end, fresh count zero means elapsed minutes; otherwise return `-1`.

## Self-check (answers are in the separate answer key)

1. Why must all initially rotten oranges be enqueued before the first BFS layer?
2. When should the minute counter increase?
3. What should the function return if at least one fresh orange can never be reached?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
