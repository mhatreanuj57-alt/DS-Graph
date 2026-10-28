const clone = value => JSON.parse(JSON.stringify(value));

export function makeTrace(lesson) {
  const { nodes, edges, directed } = lesson.graph;
  const ids = nodes.map(node => node[0]);
  const key = (u,v) => directed ? `${u}>${v}` : [u,v].sort().join('~');
  const edgeList = edges.map(([from,to,weight=1]) => ({from,to,weight,key:key(from,to)}));
  const byId = new Map(ids.map(id => [id, []]));
  for (const edge of edgeList) {
    byId.get(edge.from).push({to:edge.to, edge});
    if (!directed) byId.get(edge.to).push({to:edge.from, edge});
  }
  const order = new Map(ids.map((id,index) => [id,index]));
  for (const list of byId.values()) list.sort((a,b) => order.get(a.to)-order.get(b.to));
  const mark = lesson.graph.marks ?? {};
  const adjacent = id => (byId.get(id) ?? []).filter(({to}) => lesson.kind === 'islands' ? mark[to] === 'land' : lesson.kind === 'flood' ? mark[to] === mark[start] : true);
  const state = {visited:[], frontier:[], accepted:[], rejected:[], current:null, edge:null, dist:{}, parent:{}, low:{}, components:[], phase:'Ready'};
  const frames = [];
  const save = text => frames.push({text,...clone(state)});
  const visit = id => { if (!state.visited.includes(id)) state.visited.push(id); };
  const enqueue = id => { if (!state.frontier.includes(id)) state.frontier.push(id); };
  const start = ids[0];
  save(`The ${lesson.title.toLowerCase()} trace is ready. Press Step to begin.`);

  if (lesson.kind === 'representation') {
    state.phase = 'Edge inventory'; state.current = start;
    save('Each undirected edge is stored once in the canonical edge inventory.');
    state.phase = 'Adjacency list'; state.frontier = [...(byId.get(start) ?? []).map(x=>x.to)];
    save('An adjacency list enumerates only the neighbors that exist.');
    state.phase = 'Adjacency matrix'; state.frontier = ids;
    save('A matrix makes an edge lookup constant time, but reserves one cell for every vertex pair.');
    return frames;
  }

  if (lesson.kind === 'bfs' || lesson.kind === 'dfs' || lesson.kind === 'cycleBfs' || lesson.kind === 'cycleDfs' || lesson.kind === 'components' || lesson.kind === 'flood' || lesson.kind === 'islands') {
    const isDfs = ['dfs','cycleDfs'].includes(lesson.kind);
    const roots = lesson.kind === 'components' ? ids : lesson.kind === 'islands' ? ids.filter(id=>mark[id]==='land') : [start];
    state.phase = isDfs ? 'Call stack' : 'FIFO queue';
    for (const root of roots) {
      if (state.visited.includes(root)) continue;
      const componentStart=state.visited.length;
      const parent = new Map([[root,null]]);
      visit(root); state.current=root; state.frontier=[root];
      save(`${root} is marked when it is discovered and added to the ${isDfs?'stack':'queue'}.`);
      if (isDfs) {
        const stack = [root];
        while (stack.length) {
          const u=stack.pop(); state.frontier=[...stack]; state.current=u; state.edge=null;
          save(`Visit ${u}; inspect its neighbors in depth-first order.`);
          const next = [...adjacent(u)].reverse();
          for (const {to:v,edge} of next) {
            state.edge=edge.key;
            if (!state.visited.includes(v)) { parent.set(v,u); state.parent[v]=u; visit(v); stack.push(v); state.frontier=[...stack]; state.accepted.push(edge.key); save(`Discover ${v} from ${u} and push it onto the stack.`); }
            else if (['cycleDfs'].includes(lesson.kind) && parent.get(u)!==v) { state.rejected.push(edge.key); state.phase='Cycle found'; save(`The visited neighbor ${v} is not parent(${u}); this edge closes a cycle.`); return frames; }
            else if (lesson.kind==='cycleDfs' && parent.get(u)===v) { state.rejected.push(edge.key); save(`Ignore ${u} → ${v}: it is the tree edge back to the parent.`); }
          }
        }
      } else {
        const queue=[root];
        while(queue.length) {
          const u=queue.shift(); state.frontier=[...queue]; state.current=u; state.edge=null;
          save(`Remove ${u} from the front of the FIFO queue.`);
          for(const {to:v,edge} of adjacent(u)) {
            state.edge=edge.key;
            if(!state.visited.includes(v)) { parent.set(v,u); state.parent[v]=u; visit(v); queue.push(v); state.frontier=[...queue]; state.accepted.push(edge.key); save(`Discover ${v} from ${u}; mark it now and enqueue it.`); }
            else if(lesson.kind==='cycleBfs' && parent.get(u)!==v) { state.rejected.push(edge.key); state.phase='Cycle found'; save(`Visited neighbor ${v} is not parent(${u}); the graph contains a cycle.`); return frames; }
            else if(lesson.kind==='cycleBfs' && parent.get(u)===v) { state.rejected.push(edge.key); save(`Ignore ${u} → ${v}: this is the parent edge in an undirected graph.`); }
          }
        }
      }
      if (lesson.kind === 'components' || lesson.kind === 'islands') { const component=state.visited.slice(componentStart);state.components.push(component);state.phase='Component complete';save(`Component ${state.components.length}: { ${component.join(', ')} }.`); }
    }
    if (lesson.kind==='components' || lesson.kind==='islands') { const noun=lesson.kind==='islands'?'island':'connected component';state.phase='Complete'; save(`Found ${state.components.length} ${noun}${state.components.length===1?'':'s'}.`); }
    return frames;
  }

  if (lesson.kind === 'dijkstra' || lesson.kind === 'bellman' || lesson.kind === 'flights') {
    const source=ids[0]; state.dist=Object.fromEntries(ids.map(id=>[id,Infinity])); state.dist[source]=0; state.current=source; state.phase='Tentative distances';
    if (lesson.kind==='dijkstra') {
      const done=new Set();
      while(done.size<ids.length) {
        const u=ids.filter(id=>!done.has(id)).sort((a,b)=>state.dist[a]-state.dist[b])[0];
        if (!Number.isFinite(state.dist[u])) break;
        done.add(u); state.current=u; visit(u); state.frontier=ids.filter(id=>!done.has(id)&&Number.isFinite(state.dist[id])).sort((a,b)=>state.dist[a]-state.dist[b]); state.phase='Settle minimum'; save(`Settle ${u} at distance ${state.dist[u]}.`);
        for(const {to:v,edge} of byId.get(u)??[]) {
          const candidate=state.dist[u]+edge.weight; state.edge=edge.key;
          if(candidate<state.dist[v]) { state.dist[v]=candidate; state.frontier=ids.filter(id=>!done.has(id)&&Number.isFinite(state.dist[id])).sort((a,b)=>state.dist[a]-state.dist[b]); state.parent[v]=u; state.accepted.push(edge.key); state.phase='Relax edge'; save(`Relax ${u} → ${v}: distance ${v} becomes ${candidate}.`); }
          else { state.rejected.push(edge.key); save(`Keep the existing distance to ${v}; candidate ${candidate} is not shorter.`); }
        }
      }
    } else {
      const passes=lesson.kind==='flights' ? Math.min(3, ids.length-1) : ids.length-1;
      for(let pass=1;pass<=passes;pass++) {
        const before={...state.dist}; const next={...before}; state.phase=lesson.kind==='flights'?`At most ${pass} flight${pass===1?'':'s'}`:`Pass ${pass}`; state.frontier=Object.keys(before).filter(id=>Number.isFinite(before[id]));
        let changed=false;
        for(const edge of edgeList) {
          const {from:u,to:v,weight:w}=edge;
          if(Number.isFinite(before[u]) && before[u]+w<next[v]) { next[v]=before[u]+w; state.parent[v]=u; state.edge=edge.key; state.current=v; state.accepted.push(edge.key); changed=true; save(`Using ${pass} edge${pass===1?'':'s'} at most, improve ${v} to ${next[v]}.`); }
          if(!directed && lesson.kind==='bellman' && Number.isFinite(before[v]) && before[v]+w<next[u]) { next[u]=before[v]+w; state.parent[u]=v; state.edge=edge.key; state.current=u; changed=true; state.accepted.push(edge.key); save(`Using ${pass} edge${pass===1?'':'s'} at most, improve ${u} to ${next[u]}.`); }
        }
        state.dist=next; if(!changed) break;
      }
      if(lesson.kind==='bellman') { state.phase='Negative-cycle check'; save('One extra relaxation pass detects a reachable negative cycle.'); }
    }
    state.phase='Complete'; state.current=null; save(lesson.kind==='flights'?`Best bounded route cost: ${Math.min(...Object.values(state.dist).filter(Number.isFinite))}.`:'All reachable shortest distances are settled.');
    return frames;
  }

  if (lesson.kind === 'kruskal' || lesson.kind === 'prim' || lesson.kind === 'dsu') {
    const parent=Object.fromEntries(ids.map(id=>[id,id])), size=Object.fromEntries(ids.map(id=>[id,1]));
    const find=x=>{ while(parent[x]!==x) { parent[x]=parent[parent[x]]; x=parent[x]; } return x; };
    if(lesson.kind==='kruskal' || lesson.kind==='dsu') {
      if(lesson.kind==='dsu') state.parent={...parent};
      state.phase=lesson.kind==='dsu'?'Union operations':'Sort edges by weight';
      const sorted=[...edgeList].sort((a,b)=>a.weight-b.weight);
      for(const edge of sorted) {
        let a=find(edge.from), b=find(edge.to); state.current=edge.from; state.edge=edge.key;
        if(a!==b) { if(size[a]<size[b]) [a,b]=[b,a]; parent[b]=a; size[a]+=size[b]; state.accepted.push(edge.key); if(lesson.kind==='dsu') state.parent={...parent}; state.phase=lesson.kind==='dsu'?'Merge sets':'Add cheapest safe edge'; save(`${edge.from} and ${edge.to} have different representatives; join their sets.`); }
        else { if(lesson.kind==='dsu') state.parent={...parent};state.rejected.push(edge.key); state.phase='Cycle avoided'; save(`${edge.from} and ${edge.to} already share a representative; reject this edge.`); }
      }
    } else {
      const used=new Set([ids[0]]); state.phase='Grow from '+ids[0]; visit(ids[0]);
      while(used.size<ids.length) {
        const candidates=edgeList.filter(e=>used.has(e.from)!==used.has(e.to)).sort((a,b)=>a.weight-b.weight);
        if(!candidates.length) break;
        const edge=candidates[0], next=used.has(edge.from)?edge.to:edge.from;
        state.current=next; state.edge=edge.key; state.accepted.push(edge.key); used.add(next); visit(next); state.frontier=[...used];
        state.phase='Add minimum frontier edge'; save(`Accept weight ${edge.weight}; it reaches new vertex ${next}.`);
      }
    }
    state.phase='Complete'; save('The accepted edges form the minimum spanning forest.'); return frames;
  }

  if (lesson.kind === 'kahn' || lesson.kind === 'topodfs') {
    if(lesson.kind==='kahn') {
      const indegree=Object.fromEntries(ids.map(id=>[id,0])); for(const edge of edgeList) indegree[edge.to]++;
      const queue=ids.filter(id=>indegree[id]===0); state.phase='Zero-indegree queue'; state.frontier=[...queue]; state.dist={...indegree}; save(`Queue all vertices with indegree zero: ${queue.join(', ') || 'none'}.`);
      while(queue.length) { const u=queue.shift(); state.current=u; state.frontier=[...queue]; visit(u); state.phase='Remove prerequisite'; save(`Emit ${u}; remove its outgoing edges.`);
        for(const {to:v,edge} of byId.get(u)??[]) { indegree[v]--; state.dist={...indegree}; state.edge=edge.key; if(indegree[v]===0){queue.push(v);state.frontier=[...queue];state.accepted.push(edge.key);save(`${v} now has indegree zero; add it to the queue.`);} else save(`Remove ${u} → ${v}; indegree(${v}) falls to ${indegree[v]}.`); }
      }
      state.phase='Cycle check'; save(`Emitted ${state.visited.length} of ${ids.length} vertices; ${state.visited.length===ids.length?'the graph is acyclic':'unprocessed vertices reveal a cycle'}.`);
    } else {
      const color=Object.fromEntries(ids.map(id=>[id,0])); const orderOut=[];
      const dfs=u=>{ color[u]=1; state.current=u; state.phase='Active path'; state.frontier=ids.filter(id=>color[id]===1); visit(u); save(`Enter ${u}; mark it active on the recursion path.`); for(const {to:v,edge} of byId.get(u)??[]) { state.edge=edge.key; if(color[v]===1){state.rejected.push(edge.key);state.phase='Back edge';save(`Edge to active ${v} closes a cycle.`);continue;} if(color[v]===0) dfs(v); } color[u]=2; orderOut.push(u); state.phase='Finish vertex'; state.frontier=ids.filter(id=>color[id]===1); save(`Finish ${u}; append it to postorder.`); };
      for(const id of ids) if(!color[id]) dfs(id);
      state.phase='Reverse postorder'; state.components=orderOut.reverse(); save(`Reverse finish order: ${state.components.join(' → ')}.`);
    }
    return frames;
  }

  if (lesson.kind === 'directedCycle') {
    const color=Object.fromEntries(ids.map(id=>[id,0]));
    const dfs=u=>{color[u]=1;visit(u);state.current=u;state.frontier=ids.filter(id=>color[id]===1);state.phase='Active DFS path';save(`Mark ${u} active on the current recursion path.`);for(const {to:v,edge} of byId.get(u)??[]){state.edge=edge.key;if(color[v]===1){state.rejected.push(edge.key);state.phase='Back edge';save(`The edge to active ${v} proves a directed cycle.`);return true;}if(color[v]===0&&dfs(v))return true;}color[u]=2;state.frontier=ids.filter(id=>color[id]===1);return false;};
    for(const id of ids) if(!color[id]&&dfs(id)) break;
    return frames;
  }

  if (lesson.kind === 'articulation' || lesson.kind === 'bridges') {
    let time=0; const tin={},low={},parent={},cut=new Set();
    const dfs=(u,p=null)=>{tin[u]=low[u]=++time;state.current=u;state.visited=[...new Set([...state.visited,u])];state.frontier=Object.keys(tin).filter(id=>!state.visited.includes(id));state.low={...low};state.phase='Discover';save(`Discover ${u} at time ${tin[u]}.`);let children=0;for(const {to:v,edge} of byId.get(u)??[]){state.edge=edge.key;if(v===p)continue;if(tin[v]){low[u]=Math.min(low[u],tin[v]);state.low={...low};save(`Back edge to ${v}; low(${u}) becomes ${low[u]}.`);}else{parent[v]=u;children++;dfs(v,u);low[u]=Math.min(low[u],low[v]);state.low={...low};if(lesson.kind==='bridges'&&low[v]>tin[u]){state.accepted.push(edge.key);state.phase='Bridge';save(`low(${v}) > tin(${u}); this edge is a bridge.`);}if(lesson.kind==='articulation'&&p!==null&&low[v]>=tin[u]){cut.add(u);state.accepted.push(edge.key);state.phase='Articulation point';save(`low(${v}) ≥ tin(${u}); removing ${u} disconnects a subtree.`);}}}if(lesson.kind==='articulation'&&p===null&&children>1){cut.add(u);state.accepted.push(`node:${u}`);state.phase='Root articulation';save(`Root ${u} has ${children} DFS children; it is an articulation point.`);}};
    for(const id of ids) if(!tin[id]) dfs(id);
    state.phase='Complete'; save(lesson.kind==='bridges'?`Found ${state.accepted.length} bridge edge${state.accepted.length===1?'':'s'}.`:`Critical vertices: ${[...cut].join(', ')||'none'}.`); return frames;
  }

  if (lesson.kind === 'kosaraju') {
    const seen=new Set(), finish=[];
    const dfs=(u,rev=false,component=[])=>{seen.add(u);visit(u);state.current=u;state.frontier=[...seen];state.phase=rev?'Reverse-graph search':'Finish-order pass';save(rev?`Collect ${u} in the current strongly connected component.`:`Explore ${u} before recording its finish time.`);const links=rev?edgeList.filter(e=>e.to===u).map(e=>({to:e.from,edge:e})):byId.get(u)??[];for(const {to:v,edge} of links){state.edge=edge.key;if(!seen.has(v))dfs(v,rev,component);}if(!rev)finish.push(u);else component.push(u);};
    for(const id of ids) if(!seen.has(id)) dfs(id);
    state.phase='Reverse all edges'; state.visited=[]; state.frontier=[...finish].reverse(); save('Reverse every arc and reset visited state.'); seen.clear();
    for(const id of [...finish].reverse()) if(!seen.has(id)){const component=[];dfs(id,true,component);state.components.push(component);state.phase='SCC complete';save(`Component: { ${component.join(', ')} }.`);}
    return frames;
  }

  if (lesson.kind === 'rot') {
    const rotten=new Set(ids.filter(id=>mark[id]==='rotten')), fresh=new Set(ids.filter(id=>mark[id]==='fresh'));
    state.visited=[...rotten]; state.frontier=[...rotten]; state.phase='Minute 0'; save('Initialize the queue with every rotten orange at minute zero.');
    let minute=0;
    while(state.frontier.length){const next=[];for(const u of state.frontier)for(const {to:v,edge} of byId.get(u)??[])if(fresh.has(v)){fresh.delete(v);next.push(v);state.edge=edge.key;state.current=v;state.accepted.push(edge.key);}if(!next.length)break;minute++;state.frontier=next;state.visited=[...state.visited,...next];state.phase=`Minute ${minute}`;save(`${next.join(', ')} rot at the end of minute ${minute}.`);}
    state.phase='Complete';save(fresh.size?`${fresh.size} fresh orange${fresh.size===1?'':'s'} cannot be reached.`:`All reachable oranges rot in ${minute} minute${minute===1?'':'s'}.`);return frames;
  }

  // Tarjan SCC is not used here; Kosaraju handles SCCs above.
  state.phase='Complete'; state.visited=[...ids]; save('The topic trace is complete.'); return frames;
}
