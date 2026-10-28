import './style.css';
import { groups, lessons, getLesson } from './curriculum.js';
import { makeTrace } from './graph-model.js';
import { createGraphScene } from './graph3d.js';
import { sessionNotes } from './session-notes.js';
import { renderGraphPlayground } from './playground.js';

const app=document.querySelector('#app');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const saved=JSON.parse(localStorage.getItem('ds-graph-progress')||'[]');
const completed=new Set(saved);
let current=getLesson(new URLSearchParams(location.search).get('lesson'));
let frameIndex=0,trace=makeTrace(current),graphScene=null,playing=false,playTimer=0;
let theme=localStorage.getItem('ds-graph-theme')||'light';
const savedQuiz=JSON.parse(localStorage.getItem('ds-graph-quiz')||'{}');
const quizForLesson=lesson=>{
  const index=lessons.indexOf(lesson);
  const conceptChoices=[lesson.subtitle,...[3,7,12].map(offset=>lessons[(index+offset)%lessons.length].subtitle)];
  const complexityChoices=[lesson.complexity,'O(V + E)','O(V log V)','O(V²)'].filter((answer,i,all)=>all.indexOf(answer)===i).slice(0,4);
  const rotate=(answers,correct=0)=>{const shift=index%answers.length;return {answers:[...answers.slice(shift),...answers.slice(0,shift)],correct:(correct-shift+answers.length)%answers.length};};
  const specific=rotate(lesson.quiz.answers,lesson.quiz.correct), complexity=rotate(complexityChoices), concept=rotate(conceptChoices);
  return [{question:lesson.quiz.question,...specific},{question:'What complexity does this lesson report?',...complexity},{question:`Which statement captures the core idea of ${lesson.title}?`,...concept}];
};

function render(){
  graphScene?.destroy();graphScene=null;clearInterval(playTimer);playing=false;trace=makeTrace(current);frameIndex=0;
  document.documentElement.dataset.theme=theme;
  if(new URLSearchParams(location.search).get('view')==='playground'){
    renderGraphPlayground(app,{theme,onBack:()=>{history.replaceState(null,'',`?lesson=${current.id}`);render();}});return;
  }
  const topicList=groups.map(group=>`<section class="nav-group"><p class="nav-label">${escapeHtml(group)}</p>${lessons.filter(lesson=>lesson.group===group).map(lesson=>`<button class="lesson-link ${lesson.id===current.id?'active':''}" data-lesson="${lesson.id}"><span class="lesson-mark ${completed.has(lesson.id)?'done':''}">${completed.has(lesson.id)?'✓':String(lessons.indexOf(lesson)+1).padStart(2,'0')}</span><span class="lesson-name">${escapeHtml(lesson.title)}</span><span class="nav-arrow">↗</span></button>`).join('')}</section>`).join('');
  const graphDescription=`Vertices: ${current.graph.nodes.map(node=>node[0]).join(', ')}. Edges: ${current.graph.edges.map(([from,to,weight])=>`${from} ${current.graph.directed?'to':'connected to'} ${to}${weight===undefined?'':`, weight ${weight}`}`).join('; ')}.`;
  const hasWeights=current.graph.edges.some(edge=>edge[2]!==undefined);
  const pct=Math.round(completed.size/lessons.length*100);
const lessonQuiz=quizForLesson(current);
const quizCorrectCount=(savedQuiz[current.id]||[]).filter((answer,index)=>answer===lessonQuiz[index]?.correct).length;
  app.innerHTML=`
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><a href="?lesson=graph-structures" aria-label="DS Graph home"><span class="brand-mark"><i></i><i></i><i></i><i></i></span><span>DS<span class="brand-light">/</span>GRAPH</span></a><button class="icon-button mobile-close" id="close-nav" aria-label="Close navigation">×</button></div>
        <div class="course-card"><span class="eyebrow">INTERACTIVE COURSE</span><h2>Graph systems<br>& algorithms</h2><div class="progress-line"><span style="width:${pct}%"></span></div><div class="progress-caption"><span>${completed.size} of ${lessons.length} lessons complete</span><span>${pct}%</span></div></div>
        <label class="search-box"><span class="search-icon">⌕</span><input id="lesson-search" type="search" placeholder="Find a lesson" aria-label="Find a lesson"><kbd>⌘ K</kbd></label>
        <nav class="lesson-nav" aria-label="Course lessons">${topicList}</nav>
        <div class="sidebar-bottom"><div class="source-link"><span class="pdf-mark">22</span><span><strong>Guide references</strong><small>Page numbers kept per lesson</small></span></div><div class="sidebar-meta"><span>EXPLORE · PREDICT · CHECK</span><span>DSG <b>01—22</b></span></div></div>
      </aside>
      <div class="scrim" id="scrim"></div>
      <main class="main-panel">
        <header class="topbar"><div class="crumbs"><button class="icon-button menu-toggle" id="open-nav" aria-label="Open lesson navigation">☰</button><span>LEARNING PATH</span><span class="crumb-dot">/</span><span class="crumb-current">${escapeHtml(current.group.toUpperCase())}</span></div><div class="top-actions"><button class="playground-link" id="open-playground">Graph playground <span>↗</span></button><span class="lesson-count">${String(lessons.indexOf(current)+1).padStart(2,'0')} <i>/</i> ${String(lessons.length).padStart(2,'0')}</span><button class="icon-button theme-toggle" id="toggle-theme" aria-label="Switch color theme">${theme==='dark'?'☼':'◐'}</button></div></header>
        <div class="content-wrap">
          <section class="lesson-heading"><div class="heading-copy"><div class="kicker"><span class="kicker-rule"></span>FIELD GUIDE&nbsp; / &nbsp;${String(lessons.indexOf(current)+1).padStart(2,'0')} <span>—</span> ${escapeHtml(current.group.toUpperCase())}</div><h1>${escapeHtml(current.title)}</h1><p class="subtitle">${escapeHtml(current.subtitle)}</p></div><button class="complete-button ${completed.has(current.id)?'completed':''}" id="mark-complete">${completed.has(current.id)?'✓ Completed':'Mark complete'}<span>↗</span></button></section>
          <section class="workspace-grid">
            <div class="visual-card">
              <div class="visual-head"><div><span class="eyebrow">THE GRAPH LAB&nbsp; · &nbsp;LIVE MODEL</span><h2>${escapeHtml(current.title)}</h2></div><div class="live-chip"><i></i> EXPLORE IN 3D</div></div>
              <div class="diagram-tools" role="toolbar" aria-label="Graph model controls"><button class="diagram-tool" id="apart-model" aria-pressed="false">Apart view <kbd>E</kbd></button><button class="diagram-tool" id="toggle-labels" aria-pressed="true">Labels on <kbd>L</kbd></button><button class="diagram-tool" id="toggle-weights" aria-pressed="true" ${hasWeights?'':'disabled'}>${hasWeights?'Weights on':'No weights'}${hasWeights?' <kbd>W</kbd>':''}</button><button class="diagram-tool" id="toggle-spin" aria-pressed="false">Auto rotate</button></div>
              <div class="graph-host" id="graph-host"><p class="sr-only" id="graph-description">${escapeHtml(graphDescription)}</p><div class="diagram-legend"><span><i class="legend-current"></i>Current</span><span><i class="legend-frontier"></i>Frontier</span><span><i class="legend-visited"></i>Visited</span></div><div class="graph-loading">Preparing the graph model…</div><div class="view-hint"><span>◉</span> CLICK NODES OR EDGES <i>·</i> DRAG TO ORBIT <i>·</i> SCROLL TO ZOOM</div><div class="axis-key"><span><i class="axis-x"></i>X</span><span><i class="axis-y"></i>Y</span><span><i class="axis-z"></i>Z</span></div></div>
              <div class="trace-controls"><div class="trace-count"><span>TRACE</span><strong id="trace-number">01 <i>/ ${String(trace.length).padStart(2,'0')}</i></strong></div><div class="transport"><button class="transport-button" id="reset-trace" aria-label="Reset trace">↺</button><button class="transport-button play-button" id="play-trace" aria-label="Play trace">▶</button><button class="transport-button" id="step-back" aria-label="Previous step">←</button><button class="transport-button" id="step-forward" aria-label="Next step">→</button><input id="trace-scrubber" type="range" min="0" max="${Math.max(0,trace.length-1)}" value="0" aria-label="Trace step"><button class="transport-button reset-view" id="reset-view" aria-label="Reset camera">⌾</button></div><span class="trace-phase" id="trace-phase">${escapeHtml(trace[0]?.phase||'Ready')}</span></div>
              <div class="trace-caption"><span class="step-bullet"></span><p id="trace-text" aria-live="polite" aria-atomic="true">${escapeHtml(trace[0]?.text||'')}</p></div>
            </div>
            <aside class="insight-column"><div class="insight-label"><span class="eyebrow">LIVE TRACE</span><span class="pulse-dot"></span></div><div class="insight-card"><span class="micro-label">CURRENT OPERATION</span><h3 id="operation-title">${escapeHtml(trace[0]?.phase||'Ready')}</h3><p id="operation-text" aria-live="polite" aria-atomic="true">${escapeHtml(trace[0]?.text||'')}</p><div class="state-divider"></div><div class="state-row"><span>${current.kind==='bfs'||current.kind==='cycleBfs'||current.kind==='rot'?'QUEUE':current.kind==='dfs'||current.kind==='cycleDfs'?'STACK':'FRONTIER'}</span><strong id="frontier-value">—</strong></div><div class="state-row"><span>VISITED</span><strong id="visited-value">—</strong></div><div class="state-row"><span>EDGE</span><strong id="edge-value">—</strong></div></div><div class="complexity-card"><div class="complexity-icon">ƒ</div><div><span class="micro-label">TIME COMPLEXITY</span><strong>${escapeHtml(current.complexity)}</strong></div><span class="complexity-info" title="For the standard adjacency-list implementation">i</span></div><div class="hint-card"><span class="hint-icon">✳</span><div><span class="micro-label">REMEMBER THIS</span><p>${escapeHtml(current.intuition)}</p></div></div><div class="source-page"><span>GUIDE PAGE</span><strong>p. ${current.page}</strong></div></aside>
          </section>
          <section class="learning-grid"><article class="lesson-copy"><div class="section-overline"><span>01</span><i></i><span>THE IDEA</span></div><h2>Understand the move.<br>Then predict the next.</h2><p>${escapeHtml(current.body)}</p><div class="concept-callout"><span class="callout-symbol">↳</span><span>${escapeHtml(current.intuition)}</span></div><div class="lesson-meta"><span>TOPIC</span><strong>${escapeHtml(current.group)}</strong><span>SUBLESSON</span><strong>${escapeHtml(current.title)}</strong><span>REFERENCE</span><strong>Guide · p. ${current.page}</strong></div></article>
            <article class="code-card"><div class="code-top"><div><div class="section-overline"><span>02</span><i></i><span>IMPLEMENTATION SKETCH</span></div><h2>C++ reference</h2></div><span class="language-pill">C++ <i>17</i></span></div><pre><code>${escapeHtml(current.code)}</code></pre><div class="code-footer"><span><i></i> CORE LOGIC</span><button id="copy-code">Copy snippet <span>⧉</span></button></div></article></section>
          <section class="session-notes"><div class="notes-heading"><div><div class="section-overline"><span>04</span><i></i><span>SESSION NOTES</span></div><h2>Go deeper on this topic.</h2><p>The supplied notes add definitions, worked steps, pitfalls and self-checks.</p></div><details><summary>Open notes</summary><article class="notes-content">${sessionNotes(current.id)}</article></details></div></section>
          <section class="quiz-section"><div class="quiz-heading"><div><div class="section-overline"><span>05</span><i></i><span>RETRIEVAL PRACTICE</span></div><h2>Lock in the idea.</h2><p>Three quick checks. Use the model, make a choice, and see what you know.</p></div><div class="quiz-score" id="quiz-score">${quizCorrectCount?`${quizCorrectCount} / 3 correct`: '0 / 3 complete'}</div></div><div class="quiz-list">${lessonQuiz.map((item,qi)=>{const selected=savedQuiz[current.id]?.[qi];return `<article class="quiz-card" data-question="${qi}"><div class="quiz-left"><span class="question-number">CHECK 0${qi+1}</span><h3>${escapeHtml(item.question)}</h3><p>${qi===0?'Recall the rule.':qi===1?'Connect the method to its cost.':'Pick the statement that best describes the method.'}</p></div><div class="quiz-options" role="group" aria-label="Check ${qi+1}: ${escapeHtml(item.question)}">${item.answers.map((answer,index)=>`<button class="quiz-option ${selected===index?(index===item.correct?'correct':'incorrect'):''} ${selected!==undefined&&index===item.correct?'correct':''}" data-question="${qi}" data-answer="${index}" aria-pressed="${selected===index}"><span>${String.fromCharCode(65+index)}</span>${escapeHtml(answer)}<i>${selected===index?(index===item.correct?'✓':'×'):''}</i></button>`).join('')}<div class="quiz-feedback" aria-live="polite">${selected===undefined?'':selected===item.correct?'That’s it. You’ve got the rule.':`Review: ${escapeHtml(item.answers[item.correct])}`}</div></div></article>`;}).join('')}</div></section>
          <footer class="lesson-footer"><button id="previous-lesson" ${lessons.indexOf(current)===0?'disabled':''}>← Previous lesson</button><span>LESSON ${String(lessons.indexOf(current)+1).padStart(2,'0')} OF ${String(lessons.length).padStart(2,'0')}</span><button id="next-lesson" ${lessons.indexOf(current)===lessons.length-1?'disabled':''}>Next lesson →</button></footer>
        </div>
      </main>
    </div>`;

  graphScene=createGraphScene(document.querySelector('#graph-host'),current,inspectGraphPart);
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
function inspectGraphPart(part){if(!part){updateTrace();return;}if(part.type==='node'){const id=part.id,outgoing=current.graph.edges.filter(edge=>edge[0]===id).map(edge=>edge[1]),incoming=current.graph.directed?current.graph.edges.filter(edge=>edge[1]===id).map(edge=>edge[0]):[];document.querySelector('#operation-title').textContent=`Vertex ${id}`;document.querySelector('#operation-text').textContent=current.graph.directed?`Outgoing: ${outgoing.join(', ')||'none'}. Incoming: ${incoming.join(', ')||'none'}.`:`Connected to ${outgoing.concat(current.graph.edges.filter(edge=>edge[1]===id).map(edge=>edge[0])).join(', ')||'no vertices'}.`;return;}const edge=current.graph.edges.find(([from,to])=>current.graph.directed?`${from}>${to}`===part.key:[from,to].sort().join('~')===part.key);if(!edge)return;document.querySelector('#operation-title').textContent=current.graph.directed?`${edge[0]} → ${edge[1]}`:`${edge[0]} — ${edge[1]}`;document.querySelector('#operation-text').textContent=`${current.graph.directed?'Directed edge':'Undirected edge'} between ${edge[0]} and ${edge[1]}. ${edge[2]===undefined?'Unweighted':`Weight: ${edge[2]}.`}`;}
function setLesson(id){const next=getLesson(id);if(next.id===current.id)return;current=next;history.replaceState(null,'',`?lesson=${current.id}`);render();window.scrollTo({top:0,behavior:'smooth'});}

function bindEvents(){
  document.querySelector('#graph-host').addEventListener('graph-controls',event=>{const {apart,labels,weights,spin}=event.detail,apartButton=document.querySelector('#apart-model'),labelsButton=document.querySelector('#toggle-labels'),weightsButton=document.querySelector('#toggle-weights'),spinButton=document.querySelector('#toggle-spin');apartButton.setAttribute('aria-pressed',String(apart));apartButton.firstChild.textContent=apart?'Restore model':'Apart view';labelsButton.setAttribute('aria-pressed',String(labels));labelsButton.firstChild.textContent=labels?'Labels on ':'Labels off ';weightsButton.setAttribute('aria-pressed',String(weights));weightsButton.firstChild.textContent=weightsButton.disabled?'No weights':weights?'Weights on ':'Weights off ';spinButton.setAttribute('aria-pressed',String(spin));spinButton.firstChild.textContent=spin?'Stop auto rotate':'Auto rotate';});
  document.querySelectorAll('[data-lesson]').forEach(button=>button.addEventListener('click',()=>setLesson(button.dataset.lesson)));
  document.querySelector('#open-playground').addEventListener('click',()=>{history.pushState(null,'',`?view=playground&lesson=${current.id}`);render();window.scrollTo({top:0,behavior:'smooth'});});
  document.querySelector('#step-forward').addEventListener('click',()=>jump(frameIndex+1));
  document.querySelector('#step-back').addEventListener('click',()=>jump(frameIndex-1));
  document.querySelector('#trace-scrubber').addEventListener('input',event=>jump(Number(event.target.value)));
  document.querySelector('#play-trace').addEventListener('click',startPlayback);
  document.querySelector('#reset-trace').addEventListener('click',()=>{clearInterval(playTimer);playing=false;jump(0);});
  document.querySelector('#reset-view').addEventListener('click',()=>{graphScene?.reset();graphScene?.selectPart(null);});
  document.querySelector('#apart-model').addEventListener('click',()=>graphScene.toggleApart());
  document.querySelector('#toggle-labels').addEventListener('click',()=>graphScene.toggleLabels());
  document.querySelector('#toggle-weights').addEventListener('click',()=>graphScene.toggleWeights());
  document.querySelector('#toggle-spin').addEventListener('click',()=>graphScene.toggleSpin());
  document.querySelector('#mark-complete').addEventListener('click',event=>{if(completed.has(current.id))completed.delete(current.id);else completed.add(current.id);localStorage.setItem('ds-graph-progress',JSON.stringify([...completed]));const button=event.currentTarget,done=completed.has(current.id),pct=Math.round(completed.size/lessons.length*100);button.classList.toggle('completed',done);button.innerHTML=`${done?'✓ Completed':'Mark complete'}<span>↗</span>`;const mark=document.querySelector(`[data-lesson="${current.id}"] .lesson-mark`);mark.classList.toggle('done',done);mark.textContent=done?'✓':String(lessons.indexOf(current)+1).padStart(2,'0');document.querySelector('.progress-line span').style.width=`${pct}%`;document.querySelector('.progress-caption span:first-child').textContent=`${completed.size} of ${lessons.length} lessons complete`;document.querySelector('.progress-caption span:last-child').textContent=`${pct}%`;});
  document.querySelector('#previous-lesson').addEventListener('click',()=>setLesson(lessons[lessons.indexOf(current)-1]?.id));
  document.querySelector('#next-lesson').addEventListener('click',()=>setLesson(lessons[lessons.indexOf(current)+1]?.id));
  document.querySelector('#toggle-theme').addEventListener('click',event=>{theme=theme==='dark'?'light':'dark';localStorage.setItem('ds-graph-theme',theme);document.documentElement.dataset.theme=theme;event.currentTarget.textContent=theme==='dark'?'☼':'◐';});
  document.querySelector('#copy-code').addEventListener('click',async event=>{await navigator.clipboard.writeText(current.code);event.currentTarget.innerHTML='Copied <span>✓</span>';setTimeout(()=>event.currentTarget.innerHTML='Copy snippet <span>⧉</span>',1300);});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const q=Number(button.dataset.question),selected=Number(button.dataset.answer),item=quizForLesson(current)[q];(savedQuiz[current.id]??=[])[q]=selected;localStorage.setItem('ds-graph-quiz',JSON.stringify(savedQuiz));const card=button.closest('.quiz-card');card.querySelectorAll('[data-answer]').forEach(option=>{const choice=Number(option.dataset.answer);option.classList.toggle('correct',choice===item.correct);option.classList.toggle('incorrect',choice===selected&&choice!==item.correct);option.setAttribute('aria-pressed',String(choice===selected));option.querySelector('i').textContent=choice===selected?(choice===item.correct?'✓':'×'):'';});card.querySelector('.quiz-feedback').textContent=selected===item.correct?'That’s it. You’ve got the rule.':`Review: ${item.answers[item.correct]}`;const correct=(savedQuiz[current.id]||[]).filter((answer,index)=>answer===quizForLesson(current)[index]?.correct).length;document.querySelector('#quiz-score').textContent=`${correct} / 3 ${Object.keys(savedQuiz[current.id]||{}).length===3?'correct':'complete'}`;}));
  document.querySelector('#lesson-search').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();document.querySelectorAll('.lesson-link').forEach(link=>link.hidden=!link.querySelector('.lesson-name').textContent.toLowerCase().includes(query));document.querySelectorAll('.nav-group').forEach(group=>group.hidden=![...group.querySelectorAll('.lesson-link')].some(link=>!link.hidden));});
  const openNav=()=>{document.querySelector('#sidebar').classList.add('mobile-open');document.querySelector('#scrim').classList.add('visible');};
  const closeNav=()=>{document.querySelector('#sidebar').classList.remove('mobile-open');document.querySelector('#scrim').classList.remove('visible');};
  document.querySelector('#open-nav').addEventListener('click',openNav);document.querySelector('#close-nav').addEventListener('click',closeNav);document.querySelector('#scrim').addEventListener('click',closeNav);
}

document.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector('#lesson-search').focus();}
  if(event.target.matches('input,textarea,button,canvas,[contenteditable=true]'))return;
  if(event.key==='ArrowRight')jump(frameIndex+1);if(event.key==='ArrowLeft')jump(frameIndex-1);if(event.key===' '){event.preventDefault();startPlayback();}
});

render();
