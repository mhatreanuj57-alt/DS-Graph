# Disjoint set union

**Lesson ID:** `dsu`  
**Section:** Connectivity  
**Full PDF pages:** 30–32 (combined PDF). **Original source pages:** 18–20 (original source page labels). **Related concept overview:** PDF page 9.

## What this topic is and when it is useful

Disjoint Set Union (DSU), also called Union-Find, maintains a partition of elements into disjoint sets. It is useful for incrementally tracking which vertices are connected, including the cycle checks in Kruskal's minimum spanning tree algorithm.

**From the PDF:** `find(x)` gets a set representative; `union(a,b)` merges sets. Path compression and union by rank or size give amortized near-constant operations commonly written O(α(V)). DSU tracks components but does not store the full path structure of the original graph.

## Key terms and graph representation

- **Parent array:** stores each element's parent in a representative tree.
- **Representative/root:** the element returned by `find` for its set.
- **Union:** merge two sets only when their representatives differ.
- **Path compression:** while finding the root, point visited nodes more directly at it.
- **Union by rank/size:** attach the shallower/smaller tree under the taller/larger one.

## Method step by step

1. Initialize each vertex as its own parent; every vertex starts in a separate set.
2. `find(x)`: follow parent pointers until a vertex is its own parent; that vertex is the representative.
3. During `find`, apply path compression so later operations follow fewer pointers.
4. `union(a,b)`: find both roots. If they match, do nothing because both elements are already connected. Otherwise attach one root to the other using rank or size.
5. For a connectivity question, compare `find(a)` and `find(b)`; for component counting, reduce the component count only when a true merge occurs.

## Worked example and state changes

**Illustrative DSU trace** with vertices `{0,1,2,3}` and union by size:

| Operation | Sets after operation | Meaning |
|---|---|---|
| Initialize | `{0} {1} {2} {3}` | each element is its own representative |
| `union(0,1)` | `{0,1} {2} {3}` | roots differ, so merge |
| `union(1,2)` | `{0,1,2} {3}` | `find(1)` reaches the root for `{0,1}`; merge with `{2}` |
| `find(2)` | unchanged | returns the representative of `{0,1,2}`; compression may shorten parent links |
| `union(0,2)` | unchanged | roots already match, so no extra merge occurs |

The exact root label can depend on the tie-breaking/union implementation; the important result is which elements share a representative.

## Time and space complexity

With path compression and union by rank/size, each operation takes **O(α(V)) amortized** time, where α is the inverse Ackermann function and grows so slowly that it is effectively constant for practical input sizes. DSU arrays use **O(V)** space. Without balancing/compression, a badly shaped parent chain can make a `find` operation O(V).

## Common mistakes and edge cases

- Calling `union` without first comparing roots, or incrementing component count when the sets were already equal.
- Treating the root label as a meaningful vertex identity; representatives can change after unions.
- Assuming DSU can reconstruct a shortest path or represent all original edges.
- Applying DSU to directed reachability as if direction did not matter.
- Forgetting path compression or union-by-rank/size in a performance-sensitive implementation.

## Remember this

DSU efficiently answers “are these vertices already in the same component?” Use `find` for representatives and `union` to merge different sets. It is a connectivity helper, not a path-finding data structure.

## Self-check (answers are in the separate answer key)

1. What does `find(x)` return?
2. What should `union(a,b)` do when both elements already have the same representative?
3. Which two optimizations give DSU near-constant amortized operation time?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
