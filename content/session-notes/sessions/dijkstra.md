# Dijkstra shortest paths

**Lesson ID:** `dijkstra`  
**Section:** Shortest paths  
**Full PDF pages:** 39–42 (combined PDF). **Original source pages:** 27–30 (original source page labels). **Related concept overview:** PDF page 8.

## What this topic is and when it is useful

Dijkstra's algorithm computes single-source shortest-path distances in a weighted graph whose edge weights are all non-negative. It is useful when shortest costs from one source are needed and negative edge weights are ruled out. It repeatedly processes the vertex with the smallest tentative distance and relaxes its outgoing edges.

**From the PDF:** store weighted neighbors as `{to, weight}`, use a min-priority queue, ignore stale heap entries, and do not use Dijkstra when negative edge weights are possible.

## Key terms and graph representation

- **Distance `dist[v]`:** best route cost currently known from the source to `v`.
- **Relaxation:** test whether `dist[u] + w(u,v)` improves `dist[v]`.
- **Min-heap / priority queue:** removes the entry with smallest tentative distance.
- **Stale entry:** a heap pair whose distance is no longer equal to the best stored distance for that vertex.
- **Unreachable:** keep an explicit infinity sentinel; do not add weights to an infinity sentinel.

## Method step by step

1. Set all distances to infinity; set `dist[source]=0` and push `(0,source)` into the min-heap.
2. Pop `(d,u)`. If `d` is not the current best `dist[u]`, ignore this stale entry.
3. For each edge `u -> v` of weight `w`, calculate `candidate = dist[u] + w`.
4. If `candidate < dist[v]`, update `dist[v]` and push `(candidate,v)`.
5. Continue until the heap is empty. Store predecessor vertices separately if a full path must be reconstructed.

## Worked example and state changes

**Illustrative weighted directed graph (weights are a teaching example, not copied from a source diagram):**
`0→1 (4)`, `0→2 (1)`, `2→1 (2)`, `1→3 (1)`, `2→3 (5)`. Source = `0`.

Initial distances: `d=[0,∞,∞,∞]`; heap `[(0,0)]`.

| Pop/edge check | Candidate | Distance change |
|---|---:|---|
| Pop `0`; edge `0→1 (4)` | `0+4=4` | `d[1]: ∞→4`; push `(4,1)` |
| Edge `0→2 (1)` | `0+1=1` | `d[2]: ∞→1`; push `(1,2)` |
| Pop `(1,2)` next; edge `2→1 (2)` | `1+2=3` | `d[1]: 4→3`; push `(3,1)` |
| Edge `2→3 (5)` | `1+5=6` | `d[3]: ∞→6`; push `(6,3)` |
| Pop `(3,1)`; edge `1→3 (1)` | `3+1=4` | `d[3]: 6→4`; push `(4,3)` |

Final distances: `d=[0,3,1,4]`. Later heap entries for distance `4` at vertex `1` or distance `6` at vertex `3` are stale and must not undo better values.

## Time and space complexity

With an adjacency list and binary min-heap, time is **O((V + E) log V)** as stated in the guide. Heap operations cost logarithmic time; each edge may cause a relaxation and a push. The graph and a lazy-duplicate heap can together use **O(V + E)** space in the worst case; the distance/predecessor arrays use O(V) auxiliary space. The precise heap bound depends on whether the implementation permits duplicate candidate entries.

## Common mistakes and edge cases

- Using Dijkstra with negative edge weights.
- Failing to ignore stale heap entries and processing outdated distances.
- Updating a distance when the candidate is larger than the known value.
- Setting the source distance to something other than zero.
- Assuming unreachable nodes have a numeric distance of zero.

## Remember this

Dijkstra = non-negative weights + min-heap + edge relaxation. Only replace a distance when the candidate is smaller; ignore stale heap entries.

## Self-check (answers are in the separate answer key)

1. What edge-weight condition does Dijkstra require?
2. For edge `u→v` with weight `w`, what value is compared with the current `dist[v]`?
3. In the example, why does `dist[1]` change from `4` to `3`?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
