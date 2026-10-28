const files=import.meta.glob('../content/session-notes/sessions/*.md',{query:'?raw',import:'default',eager:true});
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const inline=value=>escape(value).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');

function renderMarkdown(source){
  const lines=source.split(/\r?\n/).filter(line=>!/^\[Back to the table of contents\]/.test(line)),out=[];let list='';
  const closeList=()=>{if(list){out.push(`</${list}>`);list='';}};
  for(let i=0;i<lines.length;){const line=lines[i];if(!line.trim()){closeList();i++;continue;}
    if(/^\|/.test(line)){closeList();const rows=[];while(i<lines.length&&/^\|/.test(lines[i])){const cells=lines[i].split('|').slice(1,-1).map(cell=>cell.trim());if(!cells.every(cell=>/^[-: ]+$/.test(cell)))rows.push(cells);i++;}out.push(`<div class="notes-table-wrap"><table>${rows.map((row,index)=>`<tr>${row.map(cell=>`<${index?'td':'th'}>${inline(cell)}</${index?'td':'th'}>`).join('')}</tr>`).join('')}</table></div>`);continue;}
    const heading=line.match(/^(#{1,4})\s+(.+)/);if(heading){closeList();const level=heading[1].length+1;out.push(`<h${level}>${inline(heading[2])}</h${level}>`);i++;continue;}
    if(/^---+$/.test(line.trim())){closeList();i++;continue;}
    const bullet=line.match(/^\s*[-*]\s+(.+)/),number=line.match(/^\s*\d+\.\s+(.+)/);if(bullet||number){const next=number?'ol':'ul';if(list!==next){closeList();list=next;out.push(`<${list}>`);}out.push(`<li>${inline((bullet||number)[1])}</li>`);i++;continue;}
    closeList();const paragraph=[line.trim()];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,4}\s|\||\s*[-*]\s|\s*\d+\.\s|---+$)/.test(lines[i]))paragraph.push(lines[i++].trim());out.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }closeList();return out.join('');
}

export function sessionNotes(id){const file=files[`../content/session-notes/sessions/${id}.md`];return file?renderMarkdown(file):'<p>Session notes are not available for this lesson.</p>';}
