# Course schedule

**Lesson ID:** `course-schedule`  
**Section:** DAGs  
**Full PDF pages:** 49–51 (combined PDF). **Original source pages:** 37–39 (original source page labels). **Related concept overview:** PDF page 7.

## What this topic is and when it is useful

Course Schedule is a dependency problem expressed as a directed graph. A course may be taken only after its prerequisites, and the task asks whether all courses can be completed (and in the ordering version, to return a valid order).

**From the PDF:** a prerequisite pair `(a,b)` means course `b` must come before course `a`, so build edge `b -> a`. A valid schedule exists exactly when all vertices can be emitted by topological sorting.

## Key terms and graph representation

- **Course:** a vertex.
- **Prerequisite pair `(a,b)`:** complete `b` before `a`.
- **Dependency edge `b -> a`:** `b` must precede `a`.
- **Cycle:** circular prerequisites make a complete schedule impossible.
- **Topological sort:** a linear order satisfying every prerequisite edge.

## Method step by step

1. Create one vertex per course.
2. For each pair `(course, prerequisite)`, add `prerequisite -> course` and increase the course's indegree.
3. Run Kahn's algorithm: enqueue all zero-indegree courses.
4. Repeatedly take a ready course, append it to the schedule, and unlock dependent courses by decreasing their indegrees.
5. If the schedule contains every course, return success. If not, at least one directed cycle prevents completion.

## Worked example and state changes

**Illustrative example:** 4 courses `0,1,2,3`, prerequisite pairs `[(1,0),(2,0),(3,1),(3,2)]`.

Convert them to edges: `0→1`, `0→2`, `1→3`, `2→3`.

- Initially, only course `0` has indegree 0; queue `[0]`.
- Take `0`: indegree of `1` and `2` changes `1→0`; queue becomes `[1,2]`.
- Take `1`: course `3` still has indegree `1` because `2` is outstanding.
- Take `2`: indegree of `3` changes `1→0`; queue `[3]`.
- Take `3`: all four courses are scheduled. One valid order is `[0,1,2,3]`.

Cycle check: if `0` requires `1` and `1` requires `0`, neither can start with indegree zero, so not all courses can be scheduled.

## Time and space complexity

Building the graph and running topological sorting takes **O(V + E)** time. The adjacency list, indegrees, queue, and schedule need **O(V + E)** total storage including the graph, with O(V) extra scheduling state.

## Common mistakes and edge cases

- Reversing the prerequisite edge. Pair `(a,b)` means `b -> a`, not `a -> b`.
- Checking only whether the queue was initially empty rather than counting how many courses are finally emitted.
- Returning success when just some courses were scheduled.
- Treating multiple valid course orders as an error.
- Forgetting to handle courses with no prerequisites; they begin with indegree zero.

## Remember this

Translate every prerequisite into `prerequisite -> course`. Run Kahn’s algorithm, and report that completion is possible only if every course is emitted.

## Self-check (answers are in the separate answer key)

1. For prerequisite pair `(3,1)`, which directed edge should be created?
2. What does a course with indegree zero mean at the current stage?
3. How can Kahn’s output tell whether all courses are completable?

---

[Back to the table of contents](../README.md) · [Open answer key](../ANSWER_KEY.md)
