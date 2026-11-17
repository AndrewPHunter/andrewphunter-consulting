import {excerpts} from './excerpts.mjs';
// Completes the reader-facing planning and architect procedure revision.
// May be applied to the saved 22-slide deck, or reapplied to its 23-slide result.
export async function refine({presentation:P,input}) {
 const C={navy:'#0e1524',ivory:'#fafaf5',brass:'#d4ad5a',gold:'#856427',ink:'#172238',muted:'#505b69',line:'#cecfc6'};
 const F={serif:'IBM Plex Serif',medium:'IBM Plex Serif Medium',mono:'IBM Plex Mono'};
 const essay='https://andrewphunter.com/writing/architecting-with-claude/';
 const field=(s,n)=>s.shapes.items.find(x=>x.name===n);
 const titleOf=s=>field(s,'title')?.text.toString()??'Architecting with Claude';
 const slide=t=>P.slides.items.find(s=>titleOf(s)===t);
 function text(s,name,value,x,y,w,h,size=28,color=C.ink,font=F.serif,extra={}){
  const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=value;a.text.style={fontSize:size,typeface:font,color,insets:0,autoFit:'none',wrap:'square',...extra};return a;
 }
 function code(s,name,label,value){
  s.shapes.add({name:name+'-surface',geometry:'rect',position:{left:72,top:177,width:806,height:437},fill:C.navy,line:{fill:'none',width:0}});
  text(s,name+'-label',label,94,192,762,28,16,C.brass,F.mono);
  text(s,name,value,94,234,762,372,23,C.ivory,F.mono);
 }
 // Update every path in editable text, including the labels above code excerpts.
 for(const s of P.slides.items)for(const a of s.shapes.items){const old=a.text.toString();const next=old.replaceAll('research/slices/','planning/').replaceAll('agreed slice','agreed plan');if(next!==old)a.text=next;}
 const files=slide('Where the files live');
 field(files,'file-tree').text='.claude/\n  agents/\n    researcher.md\n    implementer.md\n    reviewer.md\n  skills/architect/SKILL.md\n\nplanning/settings-reload/\n  plan.md\n  research.md\n\nCLAUDE.md → AGENTS.md';
 field(files,'file-tree').text.style={fontSize:23,typeface:F.mono,color:C.ivory,insets:0,autoFit:'none',wrap:'square'};
 field(files,'file-tree-surface').position={left:72,top:178,width:696,height:407};
 field(files,'file-tree').position={left:94,top:235,width:652,height:342};
 const arch=slide('What /architect loads and delegates')??slide('Architect: scope and contracts');
 if(!arch)throw new Error('Architect procedure slide is missing');
 field(arch,'title').text='Architect: scope and contracts';
 field(arch,'architect-skill').text=excerpts['architect-scope'].text;
 field(arch,'architect-skill-surface').position={left:72,top:177,width:806,height:437};
 field(arch,'architect-skill-label').position={left:94,top:192,width:762,height:28};
 field(arch,'architect-skill').position={left:94,top:234,width:762,height:372};
 if(field(arch,'architect-pause'))field(arch,'architect-pause').text='Before implementation';
 if(field(arch,'architect-return'))field(arch,'architect-return').text='Headers and invariants.\n\nTests and omissions.\n\nOwned files and evidence.';
 if(field(arch,'architect-return'))field(arch,'architect-return').position={left:930,top:320,width:278,height:289};
 if(field(arch,'architect-full'))field(arch,'architect-full').text='';
 let execution=slide('Architect: execution and evidence');
 if(!execution){
  execution=P.slides.add({width:1280,height:720});execution.background.fill=C.ivory;
  text(execution,'title','Architect: execution and evidence',70,64,1140,80,46,C.ink,F.medium);
  execution.shapes.add({geometry:'line',position:{left:72,top:652,width:1136,height:0},fill:'none',line:{fill:C.line,width:1}});
  const foot=text(execution,'footer','advisory.andrewphunter.com/resources/architecting-with-claude/',72,674,750,25,15,C.muted,F.mono);foot.text.get('advisory.andrewphunter.com/resources/architecting-with-claude/').link={uri:'https://advisory.andrewphunter.com/resources/architecting-with-claude/',isExternal:true};
  text(execution,'page','09',1152,672,56,28,18,C.gold,F.mono,{alignment:'right'});
  code(execution,'architect-execution','SKILL.md · EXCERPT · [...] MARKS OMISSIONS',excerpts['architect-execution'].text);
  text(execution,'execution-responsibility','Verification belongs to the architect too.',930,189,278,166,31,C.ink,F.medium);
  text(execution,'execution-decision','Contract, dependency, or scope changes return to the responsible engineer.',930,401,278,207,28);
 }
 field(execution,'architect-execution').text=excerpts['architect-execution'].text;
 // Preserve the original slide IDs and insert the second procedure slide after the first.
 const order=P.slides.items.filter(s=>s.id!==execution.id);
 order.splice(order.findIndex(s=>s.id===arch.id)+1,0,execution);
 const inspected=await P.inspect({select:'$.slides[*]',include:['id']});
 const canonical=new Map(inspected.records.map(r=>[P.resolve(r.id).id,r.id]));
 P.slides.reorder(order.map(s=>canonical.get(s.id)));
 const model=slide('The model follows the responsibility');
 model.tables.items[0].getCell(5,1).value='Opus, fresh context';
 const report=slide('What comes back from implementation');
 if(field(report,'report-review'))field(report,'report-review').text='Review inputs:\n\nAgreed plan\nContracts and change\nTest list\nReport and evidence';
 if(field(report,'report-review'))field(report,'report-review').position={left:930,top:350,width:278,height:258};
 const reviewer=slide('The reviewer starts from the contract')??slide('Review against the plan and contracts');
 field(reviewer,'title').text='Review against the plan and contracts';
 field(reviewer,'reviewer-definition').text=excerpts.reviewer.text;
 if(field(reviewer,'review-context'))field(reviewer,'review-context').text='Does the change fulfill the plan?';
 if(field(reviewer,'review-inspection'))field(reviewer,'review-inspection').text='Check the intended result as well as the contracts.\n\nReport conflicts for a decision.';
 const team=slide('The team owns its plans and acceptance');
 field(team,'team-owner-2').text='The handoff';
 field(team,'team-responsibility-2').text='Pass the agreed plan, decisions, and results to the next engineer or agent.';
 // Remove the former file-bundle promotion from existing decks.
 const ending=slide('Trying it on the next change');
 for(const target of [files,ending]){
  const i=P.slides.items.indexOf(target);
  const records=await P.inspect({select:`$.slides[${i}].elements[*]`,include:['id']});
  const stale=records.records.filter(r=>{
   const name=P.resolve(r.id).name;
   return name==='files-download'||name?.startsWith('download-');
  }).map(r=>r.id);
  if(stale.length)P.delete(stale);
 }
 if(!field(ending,'next-task'))text(ending,'next-task','Choose a change where the design still needs work.',72,182,1136,106,43,C.ivory,F.medium);
 if(!field(ending,'next-method'))text(ending,'next-method','Work through the design. Agree on the contracts and tests. Hand the plan to execution, then examine the evidence and findings.',72,321,1090,144,33,C.ivory);
 const enforcement=slide('What the harness enforces');
 field(enforcement,'enforcement-state').text='A brief can say “do not edit.” Blocking a write takes a rule the harness enforces.';
 field(enforcement,'enforcement-state').position={left:72,top:555,width:1136,height:61};
 // The deck must work for readers who have not seen Working with Claude.
 // Keep documentation visible beside the mechanisms it explains.
 const docs='https://code.claude.com/docs/en/';
 const docsByTitle=new Map([
  ['Working through the design together',{links:[['Plan mode',docs+'common-workflows#plan-before-editing']]}],
  ['Where the files live',{links:[['Skills',docs+'skills'],['Custom subagents',docs+'sub-agents'],['Project instructions',docs+'memory']]}],
  ['Starting the execution session',{y:543,links:[['Worktrees',docs+'worktrees']]}],
  ['Architect: scope and contracts',{dark:true,links:[['Skills',docs+'skills']]}],
  ['Architect: execution and evidence',{links:[['Skills',docs+'skills'],['Custom subagents',docs+'sub-agents']]}],
  ['The researcher returns evidence',{links:[['Custom subagents',docs+'sub-agents']]}],
  ['The implementer has a bounded assignment',{links:[['Custom subagents',docs+'sub-agents']]}],
  ['Review against the plan and contracts',{links:[['Custom subagents',docs+'sub-agents']]}],
  ['What the harness enforces',{links:[['Permissions',docs+'permissions'],['Sandboxing',docs+'sandboxing'],['Hooks',docs+'hooks']]}]
 ]);
 for(const [title,config] of docsByTitle){
  const s=slide(title);
  const label='Anthropic docs: '+config.links.map(([name])=>name).join(' · ');
  const color=config.dark?C.brass:C.gold;
  const a=field(s,'anthropic-docs')??text(s,'anthropic-docs','',72,config.y??622,1136,26,20,color);
  a.text=label;
  a.position={left:72,top:config.y??622,width:1136,height:26};
  a.text.style={fontSize:20,typeface:F.serif,color,insets:0,autoFit:'none',wrap:'square'};
  for(const [name,url] of config.links){
   const range=a.text.get(name);
   range.link={uri:url,isExternal:true};
   range.color=color;
  }
 }
 // Preserve the source wording. Change the layout to fit the excerpt.
 const actualExamples=[
  ['Architect: scope and contracts','architect-skill','architect-scope',['architect-pause','architect-return','architect-full']],
  ['Architect: execution and evidence','architect-execution','architect-execution',['execution-responsibility','execution-decision']],
  ['The researcher returns evidence','researcher-agent','researcher',['research-question','research-example','research-source']],
  ['The implementer has a bounded assignment','implementer-agent','implementer',['implementer-tools','implementer-limits']],
  ['What comes back from implementation','implementation-report','report-format',['report-evidence','report-review']],
  ['Review against the plan and contracts','reviewer-definition','reviewer',['review-context','review-inspection']]
 ];
 for(const [title,name,key,asideNames] of actualExamples){
  const s=slide(title),e=excerpts[key];
  field(s,name).text=e.text;
  field(s,name).position={left:94,top:217,width:1092,height:397};
  field(s,name).text.style={fontSize:20,typeface:F.mono,color:C.ivory,insets:0,autoFit:'none',wrap:'none'};
  field(s,name+'-surface').position={left:72,top:170,width:1136,height:444};
  field(s,name+'-label').position={left:94,top:181,width:1092,height:28};
  field(s,name+'-label').text=e.source+' · EXCERPT · [...] MARKS OMISSIONS'+(key==='reviewer'?' · OPUS':'' );
  const i=P.slides.items.indexOf(s);
  const found=await P.inspect({select:`$.slides[${i}].elements[*]`,include:['id']});
  const ids=found.records.filter(r=>asideNames.includes(P.resolve(r.id).name)).map(r=>r.id);
  if(ids.length)P.delete(ids);
 }
 const brief=slide('The brief ties the role to this change');
 field(brief,'concrete-brief').text=excerpts['brief-inputs'].text;
 field(brief,'concrete-brief-label').text='implementer.md · EXCERPT · [...] MARKS OMISSIONS';
 field(brief,'concrete-brief').text.style={fontSize:22,typeface:F.mono,color:C.ivory,insets:0,autoFit:'none',wrap:'none'};
 field(brief,'brief-contract').text='The role definition names the inputs. The architect supplies them for each assignment.';
 // Constructed teaching examples are explicitly distinct from file excerpts.
 field(slide('What leaves the planning conversation'),'plan-record-label').text='ILLUSTRATIVE PLAN · NOT A PROJECT RECORD';
 field(files,'file-tree-label').text='FILE LOCATIONS · ILLUSTRATIVE PLAN NAME';
 field(slide('Starting the execution session'),'launch-label').text='ILLUSTRATIVE INVOCATION · IN THE PLANNING CONVERSATION';
 const contract=slide('The interface carries the agreement');
 const headerLabel=contract.shapes.items.find(x=>x.name.endsWith('-label')&&x.text.toString().includes('.hpp'));
 if(headerLabel)headerLabel.text='ILLUSTRATIVE CONTRACT · settings_store.hpp';
 const editorial=[];
 for(let i=0;i<P.slides.items.length;i++){
  const s=P.slides.items[i];const title=titleOf(s);const notes=input.notes[title];if(!notes)throw new Error('Missing notes: '+title);
  const page=field(s,'page');if(page)page.text=String(i+1).padStart(2,'0');
  const oldRefs=s.speakerNotes.text.split('\n\nReferences\n')[1];
  const sources=[...new Set([...(oldRefs?oldRefs.split('\n'):[essay,docs+'skills',docs+'sub-agents']),...(docsByTitle.get(title)?.links.map(([,url])=>url)??[])])];
  s.speakerNotes.text=notes+'\n\nReferences\n'+sources.join('\n');s.speakerNotes.setVisible(true);
  const texts=s.shapes.items.filter(x=>!['footer','page'].includes(x.name)).map(x=>x.text.toString()).filter(Boolean);
  if(title==='The model follows the responsibility')texts.push('Planner: Fable / frontier; Architect: Fable / frontier; Researcher: Sonnet; Implementer: Opus; Reviewer: Opus, fresh context.');
  editorial.push({number:i+1,id:s.id,title,text:texts,notes,sources});
 }
 return {slideCount:P.slides.items.length,editorial};
}
