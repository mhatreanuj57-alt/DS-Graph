import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Concept: a graph is a real 3D wiring board; nodes are terminal posts and edges are routed leads.
// Parts: deck, feet, guard rails, corner fasteners, grid pads, terminal sockets, collars, node caps, edge sleeves, direction cones, weight tags, and step-state lamps.

const colors = { ink:0xf2f2ef, deck:0xe7e7e4, edge:0x77777a, pale:0xffffff, green:0x788d72, teal:0x54877c, orange:0xe5484d, red:0xc83e45, muted:0x8c8c90 };
const componentColors=[0x788d72,0x54877c,0xc36c45,0x7c8da1,0x9b7e91,0xc83e45];
const edgeKey = (lesson, edge) => lesson.graph.directed ? `${edge.from}>${edge.to}` : [edge.from,edge.to].sort().join('~');

function labelTexture(text, {large=false, color='#18181a', accent=false}={}) {
  const canvas=document.createElement('canvas'); canvas.width=512; canvas.height=large?192:112;
  const c=canvas.getContext('2d'); c.clearRect(0,0,512,canvas.height);
  c.fillStyle=accent?'rgba(229,72,77,.94)':'rgba(251,251,250,.96)'; c.beginPath(); c.roundRect(8,8,496,canvas.height-16,32); c.fill();
  c.strokeStyle=accent?'rgba(200,62,69,.5)':'rgba(140,140,144,.48)'; c.lineWidth=4; c.stroke();
  c.fillStyle=color; c.font=`${large?'600 58px':'600 42px'} Inter,Segoe UI,sans-serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText(String(text),256,canvas.height/2,460);
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; texture.needsUpdate=true; return texture;
}

function labelSprite(text, size, options) {
  const material=new THREE.SpriteMaterial({map:labelTexture(text,options),transparent:true,depthWrite:false});
  const sprite=new THREE.Sprite(material); sprite.scale.set(size,size*.42,1); return sprite;
}

function cylinderBetween(a,b,r,material,segments=12) {
  const delta=new THREE.Vector3().subVectors(b,a), mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),segments),material);
  mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()); return mesh;
}

export function createGraphScene(host, lesson, onSelectPart) {
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene=new THREE.Scene(); scene.background=new THREE.Color(colors.ink); scene.fog=new THREE.Fog(colors.ink,14,32);
  const camera=new THREE.PerspectiveCamera(35,1,.1,100); camera.position.set(8,8,10);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.9;
  renderer.domElement.className='graph-canvas'; renderer.domElement.tabIndex=0; renderer.domElement.setAttribute('role','application'); renderer.domElement.setAttribute('aria-label',`${lesson.title} interactive graph model. Drag to orbit, scroll to zoom, click a node or edge to inspect it. Arrow keys inspect nodes; E toggles apart, L labels, W edge weights, and Escape clears selection.`); renderer.domElement.setAttribute('aria-describedby','graph-description'); host.append(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,0,0); controls.enableDamping=true; controls.dampingFactor=.075; controls.minDistance=5.4; controls.maxDistance=20; controls.maxPolarAngle=Math.PI*.47; controls.minPolarAngle=.24;
  scene.add(new THREE.HemisphereLight(0xffffff,0xd0d0cc,1.2));
  const keyLight=new THREE.DirectionalLight(0xffffff,1.6); keyLight.position.set(-5,10,7); keyLight.castShadow=true; keyLight.shadow.radius=5; scene.add(keyLight);
  const rimLight=new THREE.PointLight(0xffffff,2.5,18); rimLight.position.set(5,4,-5); scene.add(rimLight);

  const mat=(color,roughness=.68,metalness=.08,emissive=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:emissive?.28:0});
  const deck=mat(colors.deck,.82,.02), rail=mat(0xbcbcb8,.72,.08), screw=mat(0xa9a9a4,.6,.12), nodeMat=mat(colors.pale,.48,.04), socketMat=mat(0xb8b9b4,.68,.08), frontierMat=mat(colors.teal,.55,.03,colors.teal), edgeBase=mat(0xc9c9c5,.78,.02), edgeMat=mat(0x77777a,.72,.03), currentMat=mat(colors.orange,.58,.02,colors.orange);
  const root=new THREE.Group(); scene.add(root);
  const network=new THREE.Group();root.add(network);
  let apartTarget=0,showLabels=true,showWeights=true;
  const plate=new THREE.Mesh(new RoundedBoxGeometry(10.6,.26,7.2,5,.22),deck); plate.position.y=-.64; plate.receiveShadow=true; plate.castShadow=true; root.add(plate);
  const under=new THREE.Mesh(new RoundedBoxGeometry(10.1,.24,6.75,5,.16),mat(0xd2d2ce,.75,.02)); under.position.y=-.88; root.add(under);
  const feet=[];
  for(const x of [-4.45,4.45])for(const z of [-2.8,2.8]){
    const foot=new THREE.Mesh(new THREE.CylinderGeometry(.28,.35,.34,20),mat(0xc4c4c0,.72,.08)); foot.position.set(x,-1.12,z); foot.castShadow=true;root.add(foot);feet.push(foot);
    const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.06,6),screw); bolt.position.set(x,-.46,z); bolt.castShadow=true;root.add(bolt);
    const slot=new THREE.Mesh(new THREE.BoxGeometry(.13,.014,.022),mat(0xaaa9a4,.72,.04));slot.position.set(x,-.425,z);root.add(slot);
  }
  for(const [axis,sign] of [['x',-1],['x',1],['z',-1],['z',1]]){
    const isX=axis==='x', railMesh=new THREE.Mesh(new RoundedBoxGeometry(isX?9.45:.15,.2,isX?.15:6.25,3,.06),rail);
    railMesh.position.set(isX?0:sign*4.82,-.42,isX?sign*3.2:0);railMesh.castShadow=true;root.add(railMesh);
  }
  // Fine mill marks sit on the deck edge and make rotations legible at a glance.
  for(let i=0;i<32;i++){
    const angle=i/32*Math.PI*2, major=i%4===0;
    const tick=new THREE.Mesh(new THREE.BoxGeometry(major?.13:.065,.012,.018),mat(major?0x9d9d98:0xc9c9c5,.8,.02));
    tick.position.set(Math.cos(angle)*4.18,-.495,Math.sin(angle)*2.68);tick.rotation.y=-angle;root.add(tick);
  }

  const nodeMeshes=new Map(), edgeMeshes=new Map();
  const nodePositions=new Map(lesson.graph.nodes.map(([id,x,y,z])=>[id,new THREE.Vector3(x*1.03,y*1.02,z*1.03)]));
  const isGrid=['flood','islands','rot'].includes(lesson.kind),weightsAvailable=lesson.graph.edges.some(edge=>edge[2]!==undefined);
  for(const [id,x,y,z] of lesson.graph.nodes){
    const p=nodePositions.get(id), group=new THREE.Group();group.position.copy(p);group.userData.id=id;network.add(group);
    let body, lamp, selection;
    if(isGrid){
      const tileColor=lesson.graph.marks?.[id]==='land'?0xd7dfd2:lesson.graph.marks?.[id]==='water'?0xd8e3e0:lesson.graph.marks?.[id]==='rotten'?0xe8d3cc:lesson.graph.marks?.[id]==='empty'?0xe4e4e1:0xe2e2de;
      const tile=new THREE.Mesh(new RoundedBoxGeometry(1.18,.22,1.18,4,.08),mat(tileColor,.78,.02));tile.position.y=-.26;tile.castShadow=true;tile.receiveShadow=true;group.add(tile);
      const inset=new THREE.Mesh(new RoundedBoxGeometry(1.02,.035,1.02,4,.04),mat(0xdcdcd9,.72,.02));inset.position.y=-.12;group.add(inset);
      body=new THREE.Mesh(new THREE.SphereGeometry(.22,24,16),mat(0xffffff,.52,.04));body.position.y=.18;group.add(body);
      selection=new THREE.Mesh(new THREE.TorusGeometry(.48,.035,10,36),frontierMat.clone());selection.material.transparent=true;selection.material.opacity=0;selection.rotation.x=Math.PI/2;selection.position.y=.03;group.add(selection);
      lamp=new THREE.Mesh(new THREE.SphereGeometry(.075,16,12),mat(colors.green,.24,.2,colors.green));lamp.position.set(.34,.12,.34);group.add(lamp);
    } else {
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(.33,.4,.2,32),socketMat);foot.position.y=-.16;foot.castShadow=true;foot.receiveShadow=true;group.add(foot);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.285,.042,8,32),screw);ring.rotation.x=Math.PI/2;ring.position.y=-.04;group.add(ring);
      body=new THREE.Mesh(new THREE.SphereGeometry(.25,32,24),nodeMat.clone());body.position.y=.16;body.castShadow=true;group.add(body);
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),mat(colors.green,.22,.18,colors.green));cap.position.y=.39;group.add(cap);
      selection=new THREE.Mesh(new THREE.TorusGeometry(.43,.035,10,40),frontierMat.clone());selection.material.transparent=true;selection.material.opacity=0;selection.rotation.x=Math.PI/2;selection.position.y=.02;group.add(selection); lamp=cap;
    }
    const label=labelSprite(id,.8,{large:true});label.position.set(0,isGrid?.72:.82,0);group.add(label);
    const value=labelSprite('',.96,{color:'#ffffff',accent:true});value.position.set(0,isGrid?1.1:1.27,0);value.visible=false;group.add(value);
    group.traverse(obj=>{if(obj.isMesh){obj.userData.nodeId=id;}});
    nodeMeshes.set(id,{group,body,lamp,selection,value,label,targetScale:1,targetBody:body.material.color.clone(),targetLamp:lamp.material.color.clone(),targetGlow:lamp.material.emissive.clone(),targetSelection:0});
  }

  for(const raw of lesson.graph.edges){
    const edge={from:raw[0],to:raw[1],weight:raw[2]??1}; const a=nodePositions.get(edge.from),b=nodePositions.get(edge.to),delta=new THREE.Vector3().subVectors(b,a),mid=new THREE.Vector3().addVectors(a,b).multiplyScalar(.5);
    const group=new THREE.Group();network.add(group);
    const start=a.clone().lerp(b,.14),end=a.clone().lerp(b,.86);
    const sleeve=cylinderBetween(start,end,.068,edgeBase.clone(),12);sleeve.castShadow=true;group.add(sleeve);
    const line=cylinderBetween(start.clone().add(new THREE.Vector3(0,.015,0)),end.clone().add(new THREE.Vector3(0,.015,0)),.027,edgeMat.clone(),10);group.add(line);
    for(const t of [.15,.85]){const collar=new THREE.Mesh(new THREE.TorusGeometry(.105,.025,8,18),screw);const pos=a.clone().lerp(b,t);collar.position.copy(pos);collar.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),delta.clone().normalize());group.add(collar);}
    let arrow;
    if(lesson.graph.directed){arrow=new THREE.Mesh(new THREE.ConeGeometry(.14,.34,14),edgeMat.clone());arrow.position.copy(a.clone().lerp(b,.81));arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());arrow.castShadow=true;group.add(arrow);}
    const tag=labelSprite(edge.weight===1?'':edge.weight,.55,{color:'#57575a'});tag.position.copy(mid);tag.position.y+=.34;tag.visible=edge.weight!==1;group.add(tag);
    const key=edgeKey(lesson,edge);group.userData.edgeKey=key;group.traverse(obj=>{if(obj.isMesh)obj.userData.edgeKey=key;});
    edgeMeshes.set(key,{group,line,sleeve,arrow,tag,edge,targetColor:edgeMat.color.clone(),targetGlow:new THREE.Color(),targetSleeve:edgeBase.color.clone(),targetAlpha:1});
  }

  // A slim, physical readout block anchors each graph to a device instead of floating in space.
  const readout=new THREE.Mesh(new RoundedBoxGeometry(2.9,.34,.54,4,.1),mat(0xdadad6,.72,.03));readout.position.set(0,-.25,-3.02);readout.castShadow=true;root.add(readout);
  const led=new THREE.Mesh(new THREE.BoxGeometry(2.36,.022,.025),mat(colors.orange,.55,.02,colors.orange));led.position.set(0,-.075,-3.02);root.add(led);

  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();let downAt=null,selectedNode=null,selectedEdge=null,hoveredPart=null,lastFrame={};
  const hitPart=event=>{const rect=renderer.domElement.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([...nodeMeshes.values()].map(v=>v.group).concat([...edgeMeshes.values()].map(v=>v.group)),true)[0];if(!hit)return null;let target=hit.object;while(target&&!target.userData.nodeId&&!target.userData.edgeKey&&!target.userData.id)target=target.parent;if(target?.userData.edgeKey)return {type:'edge',key:target.userData.edgeKey};const id=target?.userData.nodeId??target?.userData.id;return id?{type:'node',id}:null;};
  const selectPart=part=>{selectedNode=part?.type==='node'?part.id:null;selectedEdge=part?.type==='edge'?part.key:null;update(lastFrame);onSelectPart?.(part);};
  const announceControls=()=>renderer.domElement.dispatchEvent(new CustomEvent('graph-controls',{bubbles:true,detail:{apart:Boolean(apartTarget),labels:showLabels,weights:showWeights,spin:controls.autoRotate}}));
  const toggleLabels=()=>{showLabels=!showLabels;for(const node of nodeMeshes.values())node.label.visible=showLabels;announceControls();return showLabels;};
  const toggleWeights=()=>{if(!weightsAvailable)return showWeights;showWeights=!showWeights;for(const view of edgeMeshes.values())view.tag.visible=showWeights&&view.edge.weight!==1;announceControls();return showWeights;};
  const toggleApart=()=>{apartTarget=apartTarget?0:1;announceControls();return Boolean(apartTarget);};
  const toggleSpin=()=>{controls.autoRotate=!controls.autoRotate;announceControls();return controls.autoRotate;};
  renderer.domElement.addEventListener('pointerdown',event=>{downAt=[event.clientX,event.clientY];});
  renderer.domElement.addEventListener('pointermove',event=>{const part=hitPart(event),key=part?`${part.type}:${part.type==='node'?part.id:part.key}`:null;if(key!==hoveredPart){hoveredPart=key;renderer.domElement.style.cursor=part?'pointer':'grab';update(lastFrame);}});
  renderer.domElement.addEventListener('pointerleave',()=>{hoveredPart=null;renderer.domElement.style.cursor='grab';update(lastFrame);});
  renderer.domElement.addEventListener('pointerup',event=>{
    if(!downAt||Math.hypot(event.clientX-downAt[0],event.clientY-downAt[1])>5){downAt=null;return;}downAt=null;
    selectPart(hitPart(event));
  });
  renderer.domElement.addEventListener('keydown',event=>{const ids=[...nodeMeshes.keys()],key=event.key.toLowerCase();if(key==='escape'){selectPart(null);return;}if(key==='e'){toggleApart();return;}if(key==='l'){toggleLabels();return;}if(key==='w'&&weightsAvailable){toggleWeights();return;}if(!['arrowright','arrowdown','arrowleft','arrowup'].includes(key))return;event.preventDefault();const step=key==='arrowright'||key==='arrowdown'?1:-1,here=ids.indexOf(selectedNode),next=here<0?(step>0?0:ids.length-1):(here+step+ids.length)%ids.length;selectPart({type:'node',id:ids[next]});});

  function update(frame={}){
    lastFrame=frame;
    const visited=new Set(frame.visited??[]), frontier=new Set(frame.frontier??[]), accepted=new Set((frame.accepted??[]).filter(key=>edgeMeshes.has(key))), criticalNodes=new Set((frame.accepted??[]).filter(key=>key.startsWith('node:')).map(key=>key.slice(5))), rejected=new Set(frame.rejected??[]), values=frame.dist??{}, components=frame.components??[];
    for(const [id,node] of nodeMeshes){
      const current=frame.current===id, isVisited=visited.has(id), isFrontier=frontier.has(id);
      const focused=id===selectedNode,hovered=hoveredPart===`node:${id}`&&!focused;
      node.targetScale=current?1.12:focused?1.18:isFrontier?1.045:1;
      node.selection.material.color.copy(current||focused?currentMat.color:frontierMat.color);node.targetSelection=current?.88:focused?1:hovered?.55:isFrontier?.62:0;
      const mark=lesson.graph.marks?.[id];
      const componentIndex=components.findIndex(component=>Array.isArray(component)&&component.includes(id));
      const bodyColor=criticalNodes.has(id)?colors.red:componentIndex>=0?componentColors[componentIndex%componentColors.length]:lesson.kind==='rot'?(mark==='rotten'||isVisited?colors.red:mark==='empty'?colors.muted:colors.orange):lesson.kind==='islands'?(mark==='land'?(isVisited?colors.green:0x9bb37c):0x9ca7a3):lesson.kind==='flood'?(isVisited?colors.teal:mark==='amber'?colors.orange:mark==='teal'?0x55978d:0x77968e):current?colors.orange:isFrontier?colors.teal:isVisited?colors.green:colors.pale;
      node.targetBody.set(bodyColor);
      node.targetLamp.set(current?colors.orange:isVisited?colors.green:colors.muted);node.targetGlow.set(current?colors.orange:isVisited?colors.green:0x000000);
      const dist=values[id], comp=componentIndex;
      const shown=lesson.kind==='kahn'?(Number.isFinite(dist)?`in ${dist}`:''):lesson.kind==='dsu'?`p ${frame.parent?.[id]??id}`:Number.isFinite(dist)?`d ${dist}`:dist===null?'∞':comp>=0?`SCC ${comp+1}`:frame.low?.[id]?`low ${frame.low[id]}`:'';
      node.value.visible=Boolean(shown);if(shown){node.value.material.map.dispose();node.value.material.map=labelTexture(shown,{color:'#ffffff',accent:true});node.value.material.needsUpdate=true;}
      node.group.userData.nodeId=id;
    }
    for(const [key,view] of edgeMeshes){
      const active=frame.edge===key,isAccepted=accepted.has(key),isRejected=rejected.has(key),touchesSelection=selectedNode&&(view.edge.from===selectedNode||view.edge.to===selectedNode),focused=key===selectedEdge,hovered=hoveredPart===`edge:${key}`;
      const color=active||focused?colors.orange:touchesSelection||hovered?colors.teal:isAccepted?colors.green:isRejected?colors.muted:colors.edge;
      view.targetColor.set(color);view.targetGlow.set(active?colors.orange:isAccepted?colors.green:0x000000);view.targetSleeve.set(isAccepted?0xb7c4ae:0xd1d1cd);view.targetAlpha=isRejected?.42:1;
    }
  }
  update();

  const observer=new ResizeObserver(()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(host);
  let raf=0,alive=true;
  const render=()=>{if(!alive)return;controls.update();const ease=reduceMotion?1:.16;network.position.y+=(apartTarget*1.5-network.position.y)*ease;for(const node of nodeMeshes.values()){node.group.scale.lerp(new THREE.Vector3(node.targetScale,node.targetScale,node.targetScale),ease);node.body.material.color.lerp(node.targetBody,ease);node.lamp.material.color.lerp(node.targetLamp,ease);node.lamp.material.emissive.lerp(node.targetGlow,ease);node.selection.material.opacity+=(node.targetSelection-node.selection.material.opacity)*ease;node.selection.visible=node.selection.material.opacity>.01;}for(const view of edgeMeshes.values()){view.line.material.color.lerp(view.targetColor,ease);view.line.material.emissive.lerp(view.targetGlow,ease);view.sleeve.material.color.lerp(view.targetSleeve,ease);view.sleeve.material.emissive.lerp(view.targetGlow,ease);view.line.material.opacity+=(view.targetAlpha-view.line.material.opacity)*ease;if(view.arrow)view.arrow.material.color.lerp(view.targetColor,ease);}renderer.render(scene,camera);raf=requestAnimationFrame(render);};render();
  const destroy=()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect();controls.dispose();renderer.dispose();scene.traverse(obj=>{obj.geometry?.dispose?.();if(obj.material){const materials=Array.isArray(obj.material)?obj.material:[obj.material];materials.forEach(m=>{m.map?.dispose?.();m.dispose?.();});}});renderer.domElement.remove();};
  return {update,destroy,reset:()=>{controls.reset();camera.position.set(8,8,10);controls.target.set(0,0,0);},selectPart,toggleLabels,toggleWeights,toggleApart,toggleSpin};
}
