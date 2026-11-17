import {excerpts} from './excerpts.mjs';
import {refine} from './refine.mjs';
// Applies the how-to revision to the existing deck, preserving its original slides.
// Run once after deck.mjs; input.notes is keyed by the headings in notes.md.
export async function revise({presentation:P,input}) {
 const C={navy:'#0e1524',ivory:'#fafaf5',brass:'#d4ad5a',gold:'#856427',ink:'#172238',muted:'#505b69',line:'#cecfc6',pale:'#d5d9df'};
 const F={serif:'IBM Plex Serif',medium:'IBM Plex Serif Medium',mono:'IBM Plex Mono'};
 const essay='https://andrewphunter.com/writing/architecting-with-claude/';
 const advisory='https://advisory.andrewphunter.com/';
 if(P.slides.items.length!==18)throw new Error('This revision expects the original 18-slide deck.');
 const original=[...P.slides.items];
 function text(s,name,value,x,y,w,h,size=28,color=C.ink,font=F.serif,extra={}){
  const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=value;a.text.style={fontSize:size,typeface:font,color,insets:0,autoFit:'none',wrap:'square',...extra};return a;
 }
 function line(s,x,y,w,color=C.line){return s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{fill:color,width:1}});}
 function box(s,name,x,y,w,h,fill){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
 function link(s,name,label,url,x,y,w,h=40,size=24,color=C.gold,font=F.serif){const a=text(s,name,label,x,y,w,h,size,color,font);a.text.get(label).link={uri:url,isExternal:true};a.text.get(label).color=color;return a;}
 function start(title){
  const s=P.slides.add({width:1280,height:720});s.background.fill=C.ivory;
  text(s,'title',title,70,64,1140,80,46,C.ink,F.medium);
  line(s,72,652,1136);link(s,'footer','advisory.andrewphunter.com/resources/architecting-with-claude/',advisory+'resources/architecting-with-claude/',72,674,750,25,15,C.muted,F.mono);
  text(s,'page','00',1152,672,56,28,18,C.gold,F.mono,{alignment:'right'});return s;
 }
 function code(s,name,label,value,x,y,w,h,size=23){box(s,name+'-surface',x,y,w,h,C.navy);text(s,name+'-label',label,x+22,y+15,w-44,28,16,C.brass,F.mono);text(s,name,value,x+22,y+57,w-44,h-65,size,C.ivory,F.mono);}
 async function clearBody(s,title){
  const index=P.slides.items.indexOf(s);
  const inspected=await P.inspect({select:`$.slides[${index}].elements[*]`,include:['id']});
  const ids=inspected.records.filter(r=>{const a=P.resolve(r.id);return !['title','footer','page'].includes(a.name)&&a.position?.top!==652;}).map(r=>r.id);
  if(ids.length)P.delete(ids);
  s.shapes.items.find(a=>a.name==='title').text=title;
 }
 const files=start('Where the files live');
 code(files,'file-tree','REPOSITORY FILES',`.claude/\n  agents/\n    researcher.md\n    implementer.md\n    reviewer.md\n  skills/architect/SKILL.md\n\nplanning/\n  settings-reload/plan.md\n\nCLAUDE.md → AGENTS.md`,72,178,696,397,24);
 text(files,'files-purpose','The skill coordinates.\nThe agents do their assigned work.',824,185,384,127,32,C.ink,F.medium);
 text(files,'files-instructions','Keep shared instructions small.\n\nLink the relevant docs; keep procedures with the role.',824,350,384,218,28);
 const launch=start('Starting the execution session');
 code(launch,'launch','IN THE PLANNING CONVERSATION',`/architect settings-reload\n\nThe workflow handles:\n  the separate execution thread\n  the worktree and project setup\n  the agreed plan and starting revision`,72,181,785,354,25);
 text(launch,'launch-plan','Keep planning open.',908,189,300,85,32,C.ink,F.medium);
 text(launch,'launch-behavior','The architect carries the agreed plan into execution.',908,310,300,230,28);
 text(launch,'launch-before','Your first review is the contract and proposed test list.',72,579,1136,62,29);
 const architect=original[5];
 await clearBody(architect,'Architect: scope and contracts');
 code(architect,'architect-skill','SKILL.md · PROCEDURE EXCERPT',excerpts['architect-scope'].text,72,179,806,393,23);
 text(architect,'architect-pause','The contract is the first pause.',930,190,278,132,32,C.brass,F.medium);
 text(architect,'architect-return','A changed design comes back to the engineer who owns the plan.',930,383,278,183,29,C.ivory);
 const researcher=start('The researcher returns evidence');
 code(researcher,'researcher-agent','.claude/agents/researcher.md · EXCERPT',excerpts['researcher'].text,72,177,806,425,23);
 text(researcher,'research-question','A question it can answer',930,187,278,105,31,C.ink,F.medium);
 text(researcher,'research-example','Does a failed parse leave the supplied destination unchanged?',930,321,278,190,29);
 text(researcher,'research-source','Supply the path and revision.',930,542,278,69,25,C.gold);
 const implementer=start('The implementer has a bounded assignment');
 code(implementer,'implementer-agent','.claude/agents/implementer.md · EXCERPT',excerpts['implementer'].text,72,177,806,435,23);
 text(implementer,'implementer-tools','The tools let it work.',930,187,278,105,31,C.ink,F.medium);
 text(implementer,'implementer-limits','The brief defines the assignment.\n\nContract or ownership changes return to the engineer.',930,327,278,277,28);
 const brief=original[10];
 await clearBody(brief,'The brief ties the role to this change');
 code(brief,'concrete-brief','SETTINGS-RELOAD · IMPLEMENTER BRIEF',excerpts['brief-inputs'].text,72,177,806,369,23);
 text(brief,'brief-owned','The header stays outside implementation ownership.',930,185,278,172,31,C.ink,F.medium);
 text(brief,'brief-paths','The architect supplies absolute paths for this worktree.',930,400,278,155,28);
 text(brief,'brief-contract','Both scenarios observe the public promise: replace on success, preserve on failure.',72,578,1136,64,27);
 const report=original[11];
 await clearBody(report,'What comes back from implementation');
 code(report,'implementation-report','ILLUSTRATIVE REPORT · EXCERPT',excerpts['report-format'].text,72,177,806,424,23);
 text(report,'report-evidence','Each claim points to an observation.',930,187,278,133,32,C.ink,F.medium);
 text(report,'report-review','The reviewer receives the contracts, change, tests, report, and evidence.',930,375,278,215,28);
 const reviewer=original[12];
 await clearBody(reviewer,'Review against the plan and contracts');
 code(reviewer,'reviewer-definition','.claude/agents/reviewer.md · EXCERPT',excerpts['reviewer'].text,72,177,806,437,23);
 text(reviewer,'review-context','A separate context, starting from the agreement.',930,189,278,166,32,C.ink,F.medium);
 text(reviewer,'review-inspection','The role reports departures.\n\nThe engineer decides what to accept.',930,416,278,189,28);
 const correction=original[13];
 await clearBody(correction,'A finding becomes a correction or a decision');
 code(correction,'finding','ILLUSTRATIVE REVIEW FINDING',`src/settings_store.cpp:42 | failure\nContract: rejected reload preserves active settings.\nObserved: active settings cleared before parse succeeds.`,72,177,1136,158,25);
 text(correction,'correction-title','Fix within the agreement',72,377,520,87,31,C.gold,F.medium);
 text(correction,'correction-detail','Return to the implementer.\nCorrect the code and rerun checks.',72,471,520,123,29);
 text(correction,'decision-title','Change the parser contract',686,377,522,87,31,C.gold,F.medium);
 text(correction,'decision-detail','Return to the plan owner and parser owner before dependent work proceeds.',686,471,522,123,29);
 const ending=original[17];
 await clearBody(ending,'Trying it on the next change');
 text(ending,'next-task','Choose a change where the design still needs work.',72,182,1136,106,43,C.ivory,F.medium);
 text(ending,'next-method','Work through the design. Agree on the contracts and tests. Hand the plan to execution, then examine the evidence and findings.',72,321,1090,144,33,C.ivory);
 link(ending,'essay-link','Read Architecting with Claude',essay,72,513,1090,47,30,C.brass);
 link(ending,'advisory-link','Work through this with your team',advisory+'contact/',72,585,1090,42,27,C.brass);
 original[3].shapes.items.find(a=>a.name==='plan-record-label').text='planning/settings-reload/plan.md · EXCERPT';
 const order=[...original.slice(0,5),files,launch,...original.slice(5,10),researcher,implementer,...original.slice(10)];
 const inspected=await P.inspect({select:'$.slides[*]',include:['id']});
 const canonical=new Map(inspected.records.map(r=>[P.resolve(r.id).id,r.id]));
 P.slides.reorder(order.map(s=>canonical.get(s.id)));
 const editorial=[];
 for(let i=0;i<order.length;i++){
  const s=order[i];const title=i===0?'Architecting with Claude':s.shapes.items.find(a=>a.name==='title').text.toString();
  const note=input.notes[title];if(!note)throw new Error('Missing notes '+title);
  const page=s.shapes.items.find(a=>a.name==='page');if(page)page.text=String(i+1).padStart(2,'0');
  const sources=[essay];
  if([5,6,7,12,13,16,18].includes(i))sources.push('https://code.claude.com/docs/en/skills','https://code.claude.com/docs/en/sub-agents');
  if(i===6)sources.push('https://code.claude.com/docs/en/common-workflows','https://git-scm.com/docs/git-worktree');
  if(i===18)sources.push('https://code.claude.com/docs/en/hooks','https://code.claude.com/docs/en/sandboxing');
  s.speakerNotes.text=note+'\n\nReferences\n'+sources.join('\n');
  s.speakerNotes.setVisible(true);
  const texts=s.shapes.items.filter(a=>!['footer','page'].includes(a.name)).map(a=>a.text?.toString()).filter(Boolean);
  if(i===11)texts.push('Planner: Fable / frontier; Architect: Fable / frontier; Researcher: Sonnet; Implementer: Opus; Reviewer: Opus, fresh context.');
  editorial.push({number:i+1,id:s.id,title,text:texts,notes:note,sources});
 }
 return refine({presentation:P,input});
}
