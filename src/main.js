import './style.css';
import { groups, lessons, getLesson } from './curriculum.js';
import { makeTrace } from './graph-model.js';
import { createGraphScene } from './graph3d.js';

const app=document.querySelector('#app');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const saved=JSON.parse(localStorage.getItem('ds-graph-progress')||'[]');
const completed=new Set(saved);
let current=getLesson(new URLSearchParams(location.search).get('lesson'));
let frameIndex=0,trace=makeTrace(current),graphScene=null,playing=false,playTimer=0;
let theme=localStorage.getItem('ds-graph-theme')||'dark';
const quizAnswers=new Map();

function render(){
  graphScene?.destroy();graphScene=null;clearInterval(playTimer);playing=false;trace=makeTrace(current);frameIndex=0;
  document.documentElement.dataset.theme=theme;
  const topicList=groups.map(group=>`<section class="nav-group"><p class="nav-label">${escapeHtml(group)}</p>${lessons.filter(lesson=>lesson.group===group).map(lesson=>`<button class="lesson-link ${lesson.id===current.id?'active':''}" data-lesson="${lesson.id}"><span class="lesson-mark ${completed.has(lesson.id)?'done':''}">${completed.has(lesson.id)?'✓':String(lessons.indexOf(lesson)+1).padStart(2,'0')}</span><span class="lesson-name">${escapeHtml(lesson.title)}</span><span class="nav-arrow">↗</span></button>`).join('')}</section>`).join('');
  const graphDescription=`Vertices: ${current.graph.nodes.map(node=>node[0]).join(', ')}. Edges: ${current.graph.edges.map(([from,to,weight])=>`${from} ${current.graph.directed?'to':'connected to'} ${to}${weight===undefined?'':`, weight ${weight}`}`).join('; ')}.`;
  const pct=Math.round(completed.size/lessons.length*100);
  app.innerHTML=`
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><a href="?lesson=graph-structures" aria-label="DS Graph home"><span class="brand-mark"><i></i><i></i><i></i><i></i></span><span>DS<span class="brand-light">/</span>GRAPH</span></a><button class="icon-button mobile-close" id="close-nav" aria-label="Close navigation">×</button></div>
        <div class="course-card"><span class="eyebrow">INTERACTIVE COURSE</span><h2>Graph systems<br>& algorithms</h2><div class="progress-line"><span style="width:${pct}%"></span></div><div class="progress-caption"><span>${completed.size} of ${lessons.length} lessons complete</span><span>${pct}%</span></div></div>
        <label class="search-box"><span class="search-icon">⌕</span><input id="lesson-search" type="search" placeholder="Find a lesson" aria-label="Find a lesson"><kbd>⌘ K</kbd></label>
        <nav class="lesson-nav" aria-label="Course lessons">${topicList}</nav>
        <div class="sidebar-bottom"><div class="source-link"><span class="pdf-mark">22</span><span><strong>Source page notes</strong><small>References retained per lesson</small></span></div><div class="sidebar-meta"><span>BUILT FOR UNDERSTANDING</span><span>DSG <b>01—22</b></span></div></div>
      </aside>
      <div class="scrim" id="scrim"></div>
      <main class="main-panel">
        <header class="topbar"><div class="crumbs"><button class="icon-button menu-toggle" id="open-nav" aria-label="Open lesson navigation">☰</button><span>LEARNING PATH</span><span class="crumb-dot">/</span><span class="crumb-current">${escapeHtml(current.group.toUpperCase())}</span></div><div class="top-actions"><span class="lesson-count">${String(lessons.indexOf(current)+1).padStart(2,'0')} <i>/</i> ${String(lessons.length).padStart(2,'0')}</span><button class="icon-button theme-toggle" id="toggle-theme" aria-label="Switch color theme">${theme==='dark'?'☼':'◐'}</button></div></header>
        <div class="content-wrap">
          <section class="lesson-heading"><div class="heading-copy"><div class="kicker"><span class="kicker-rule"></span>${String(lessons.indexOf(current)+1).padStart(2,'0')} <span>—</span> ${escapeHtml(current.group.toUpperCase())}</div><h1>${escapeHtml(current.title)}</h1><p class="subtitle">${escapeHtml(current.subtitle)}</p></div><button class="complete-button ${completed.has(current.id)?'completed':''}" id="mark-complete">${completed.has(current.id)?'✓ Completed':'Mark complete'}<span>↗</span></button></section>
          <section class="workspace-grid">
            <div class="visual-card">
              <div class="visual-head"><div><span class="eyebrow">LIVE 3D MODEL</span><h2>${escapeHtml(current.title)}</h2></div><div class="live-chip"><i></i> INTERACTIVE</div></div>
              <div class="graph-host" id="graph-host"><p class="sr-only" id="graph-description">${escapeHtml(graphDescription)}</p><div class="diagram-legend"><span><i class="legend-current"></i>Current</span><span><i class="legend-frontier"></i>Frontier</span><span><i class="legend-visited"></i>Visited</span></div><div class="graph-loading">Preparing the graph model…</div><div class="view-hint"><span>◉</span> CLICK NODE <i>·</i> DRAG TO ORBIT <i>·</i> SCROLL TO ZOOM</div><div class="axis-key"><span><i class="axis-x"></i>X</span><span><i class="axis-y"></i>Y</span><span><i class="axis-z"></i>Z</span></div></div>
              <div class="trace-controls"><div class="trace-count"><span>TRACE</span><strong id="trace-number">01 <i>/ ${String(trace.length).padStart(2,'0')}</i></strong></div><div class="transport"><button class="transport-button" id="reset-trace" aria-label="Reset trace">↺</button><button class="transport-button play-button" id="play-trace" aria-label="Play trace">▶</button><button class="transport-button" id="step-back" aria-label="Previous step">←</button><button class="transport-button" id="step-forward" aria-label="Next step">→</button><input id="trace-scrubber" type="range" min="0" max="${Math.max(0,trace.length-1)}" value="0" aria-label="Trace step"><button class="transport-button reset-view" id="reset-view" aria-label="Reset camera">⌾</button></div><span class="trace-phase" id="trace-phase">${escapeHtml(trace[0]?.phase||'Ready')}</span></div>
              <div class="trace-caption"><span class="step-bullet"></span><p id="trace-text" aria-live="polite" aria-atomic="true">${escapeHtml(trace[0]?.text||'')}</p></div>
            </div>
            <aside class="insight-column"><div class="insight-label"><span class="eyebrow">TRACE STATE</span><span class="pulse-dot"></span></div><div class="insight-card"><span class="micro-label">CURRENT OPERATION</span><h3 id="operation-title">${escapeHtml(trace[0]?.phase||'Ready')}</h3><p id="operation-text" aria-live="polite" aria-atomic="true">${escapeHtml(trace[0]?.text||'')}</p><div class="state-divider"></div><div class="state-row"><span>${current.kind==='bfs'||current.kind==='cycleBfs'||current.kind==='rot'?'QUEUE':current.kind==='dfs'||current.kind==='cycleDfs'?'STACK':'FRONTIER'}</span><strong id="frontier-value">—</strong></div><div class="state-row"><span>VISITED</span><strong id="visited-value">—</strong></div><div class="state-row"><span>EDGE</span><strong id="edge-value">—</strong></div></div><div class="complexity-card"><div class="complexity-icon">ƒ</div><div><span class="micro-label">TIME COMPLEXITY</span><strong>${escapeHtml(current.complexity)}</strong></div><span class="complexity-info" title="For the standard adjacency-list implementation">i</span></div><div class="hint-card"><span class="hint-icon">✳</span><div><span class="micro-label">KEEP IN MIND</span><p>${escapeHtml(current.intuition)}</p></div></div><div class="source-page"><span>SOURCE GUIDE PAGE</span><strong>p. ${current.page}</strong></div></aside>
          </section>
          <section class="learning-grid"><article class="lesson-copy"><div class="section-overline"><span>01</span><i></i><span>THE IDEA</span></div><h2>See the pattern<br>behind the algorithm.</h2><p>${escapeHtml(current.body)}</p><div class="concept-callout"><span class="callout-symbol">↳</span><span>${escapeHtml(current.intuition)}</span></div><div class="learning-note"><div class="note-index">A</div><div><strong>Read the state, not just the shape.</strong><p>Node color marks discovery, edge color marks a decision, and the live queue or stack shows what the algorithm will consider next. Rotate the model to inspect the structure from every side.</p></div></div></article>
            <article class="code-card"><div class="code-top"><div><div class="section-overline"><span>02</span><i></i><span>IMPLEMENTATION SKETCH</span></div><h2>C++ reference</h2></div><span class="language-pill">C++ <i>17</i></span></div><pre><code>${escapeHtml(current.code)}</code></pre><div class="code-footer"><span><i></i> CORE LOGIC</span><button id="copy-code">Copy snippet <span>⧉</span></button></div></article></section>
          <section class="quiz-card"><div class="quiz-left"><div class="section-overline"><span>03</span><i></i><span>QUICK CHECK</span></div><h2>Make the next move.</h2><p>${escapeHtml(current.quiz.question)}</p></div><div class="quiz-options">${current.quiz.answers.map((answer,index)=>`<button class="quiz-option ${quizAnswers.get(current.id)===index?(index===current.quiz.correct?'correct':'incorrect'):''}" data-answer="${index}"><span>${String.fromCharCode(65+index)}</span>${escapeHtml(answer)}<i>${quizAnswers.get(current.id)===index?(index===current.quiz.correct?'✓':'×'):''}</i></button>`).join('')}<div class="quiz-feedback" id="quiz-feedback">${quizAnswers.has(current.id)?(quizAnswers.get(current.id)===current.quiz.correct?'Correct. You have the key idea.':'Try again — check the trace and the rule above.'):''}</div></div></section>
          <footer class="lesson-footer"><button id="previous-lesson" ${lessons.indexOf(current)===0?'disabled':''}>← Previous lesson</button><span>LESSON ${String(lessons.indexOf(current)+1).padStart(2,'0')} OF ${String(lessons.length).padStart(2,'0')}</span><button id="next-lesson" ${lessons.indexOf(current)===lessons.length-1?'disabled':''}>Next lesson →</button></footer>
        </div>
      </main>
    </div>`;

  graphScene=createGraphScene(document.querySelector('#graph-host'),current,inspectVertex);
  document.querySelector('.graph-loading')?.remove();
  graphScene.update(trace[0]);
  bindEvents();updateTrace();
}

function updateTrace(){
  const frame=trace[frameIndex]||trace[0];if(!frame)return;
  graphScene?.update(frame);
  document.querySelector('#trace-number').innerHTML=`${String(frameIndex+1).padStart(2,'0')} <i>/ ${String(trace.length).padStart(2,'0')}</i>`;
  document.querySelector('#trace-phase').textContent=frame.phase||'Step';
  document.querySelector('#trace-text').textContent=frame.text||'';
  document.querySelector('#operation-title').textContent=frame.phase||'Step';
  document.querySelector('#operation-text').textContent=frame.text||'';
  const structure=['bfs','cycleBfs','rot'].includes(current.kind)?'QUEUE':current.kind==='dfs'||current.kind==='cycleDfs'?'STACK':'FRONTIER';
  document.querySelector('.state-row span').textContent=structure;
  const vals=frame.frontier?.length?frame.frontier.join('  ·  '):'—';
  document.querySelector('#frontier-value').textContent=vals;
  document.querySelector('#visited-value').textContent=frame.visited?.length?frame.visited.join('  ·  '):'—';
  const edge=frame.edge?.replace('>',' → ').replace('~',' — ')||'—';
  document.querySelector('#edge-value').textContent=edge;
  document.querySelector('#trace-scrubber').value=frameIndex;
  document.querySelector('#step-back').disabled=frameIndex===0;
  document.querySelector('#step-forward').disabled=frameIndex===trace.length-1;
  document.querySelector('#play-trace').textContent=playing?'Ⅱ':'▶';
}

function jump(index){frameIndex=Math.max(0,Math.min(trace.length-1,index));updateTrace();}
function startPlayback(){if(playing){clearInterval(playTimer);playing=false;updateTrace();return;}if(frameIndex>=trace.length-1)frameIndex=0;playing=true;updateTrace();playTimer=setInterval(()=>{if(frameIndex>=trace.length-1){clearInterval(playTimer);playing=false;updateTrace();return;}jump(frameIndex+1);},1050);}
function inspectVertex(id){const neighbors=current.graph.edges.filter(edge=>edge[0]===id||(!current.graph.directed&&edge[1]===id)).map(edge=>edge[0]===id?edge[1]:edge[0]);document.querySelector('#operation-title').textContent=`Vertex ${id}`;document.querySelector('#operation-text').textContent=neighbors.length?`Adjacent to ${neighbors.join(', ')}.`:'This vertex has no outgoing neighbors.';}
function setLesson(id){const next=getLesson(id);if(next.id===current.id)return;current=next;history.replaceState(null,'',`?lesson=${current.id}`);render();window.scrollTo({top:0,behavior:'smooth'});}

function bindEvents(){
  document.querySelectorAll('[data-lesson]').forEach(button=>button.addEventListener('click',()=>setLesson(button.dataset.lesson)));
  document.querySelector('#step-forward').addEventListener('click',()=>jump(frameIndex+1));
  document.querySelector('#step-back').addEventListener('click',()=>jump(frameIndex-1));
  document.querySelector('#trace-scrubber').addEventListener('input',event=>jump(Number(event.target.value)));
  document.querySelector('#play-trace').addEventListener('click',startPlayback);
  document.querySelector('#reset-trace').addEventListener('click',()=>{clearInterval(playTimer);playing=false;jump(0);});
  document.querySelector('#reset-view').addEventListener('click',()=>graphScene?.reset());
  document.querySelector('#mark-complete').addEventListener('click',event=>{if(completed.has(current.id))completed.delete(current.id);else completed.add(current.id);localStorage.setItem('ds-graph-progress',JSON.stringify([...completed]));const button=event.currentTarget,done=completed.has(current.id),pct=Math.round(completed.size/lessons.length*100);button.classList.toggle('completed',done);button.innerHTML=`${done?'✓ Completed':'Mark complete'}<span>↗</span>`;const mark=document.querySelector(`[data-lesson="${current.id}"] .lesson-mark`);mark.classList.toggle('done',done);mark.textContent=done?'✓':String(lessons.indexOf(current)+1).padStart(2,'0');document.querySelector('.progress-line span').style.width=`${pct}%`;document.querySelector('.progress-caption span:first-child').textContent=`${completed.size} of ${lessons.length} lessons complete`;document.querySelector('.progress-caption span:last-child').textContent=`${pct}%`;});
  document.querySelector('#previous-lesson').addEventListener('click',()=>setLesson(lessons[lessons.indexOf(current)-1]?.id));
  document.querySelector('#next-lesson').addEventListener('click',()=>setLesson(lessons[lessons.indexOf(current)+1]?.id));
  document.querySelector('#toggle-theme').addEventListener('click',event=>{theme=theme==='dark'?'light':'dark';localStorage.setItem('ds-graph-theme',theme);document.documentElement.dataset.theme=theme;event.currentTarget.textContent=theme==='dark'?'☼':'◐';});
  document.querySelector('#copy-code').addEventListener('click',async event=>{await navigator.clipboard.writeText(current.code);event.currentTarget.innerHTML='Copied <span>✓</span>';setTimeout(()=>event.currentTarget.innerHTML='Copy snippet <span>⧉</span>',1300);});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const selected=Number(button.dataset.answer);quizAnswers.set(current.id,selected);document.querySelectorAll('[data-answer]').forEach(option=>{const choice=Number(option.dataset.answer),chosen=choice===selected;option.classList.toggle('correct',chosen&&choice===current.quiz.correct);option.classList.toggle('incorrect',chosen&&choice!==current.quiz.correct);option.querySelector('i').textContent=chosen?(choice===current.quiz.correct?'✓':'×'):'';});document.querySelector('#quiz-feedback').textContent=selected===current.quiz.correct?'Correct. You have the key idea.':'Try again — check the trace and the rule above.';}));
  document.querySelector('#lesson-search').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();document.querySelectorAll('.lesson-link').forEach(link=>link.hidden=!link.querySelector('.lesson-name').textContent.toLowerCase().includes(query));document.querySelectorAll('.nav-group').forEach(group=>group.hidden=![...group.querySelectorAll('.lesson-link')].some(link=>!link.hidden));});
  const openNav=()=>{document.querySelector('#sidebar').classList.add('mobile-open');document.querySelector('#scrim').classList.add('visible');};
  const closeNav=()=>{document.querySelector('#sidebar').classList.remove('mobile-open');document.querySelector('#scrim').classList.remove('visible');};
  document.querySelector('#open-nav').addEventListener('click',openNav);document.querySelector('#close-nav').addEventListener('click',closeNav);document.querySelector('#scrim').addEventListener('click',closeNav);
}

document.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector('#lesson-search').focus();}
  if(event.target.matches('input,textarea,button,[contenteditable=true]'))return;
  if(event.key==='ArrowRight')jump(frameIndex+1);if(event.key==='ArrowLeft')jump(frameIndex-1);if(event.key===' '){event.preventDefault();startPlayback();}
});

render();
