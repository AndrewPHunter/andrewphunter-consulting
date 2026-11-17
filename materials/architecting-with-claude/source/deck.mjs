export async function addSlides({presentation:P,input}) {
 const C={navy:'#0e1524',ivory:'#fafaf5',brass:'#d4ad5a',gold:'#856427',ink:'#172238',muted:'#505b69',line:'#cecfc6',pale:'#d5d9df',paper:'#f0efe7'};
 const F={serif:'IBM Plex Serif',medium:'IBM Plex Serif Medium',mono:'IBM Plex Mono'};
 const essay='https://andrewphunter.com/writing/architecting-with-claude/';
 const advisory='https://advisory.andrewphunter.com/';
 const refs={essay,skills:'https://code.claude.com/docs/en/skills',agents:'https://code.claude.com/docs/en/sub-agents',hooks:'https://code.claude.com/docs/en/hooks',sandbox:'https://code.claude.com/docs/en/sandboxing',commands:'https://code.claude.com/docs/en/commands'};
 const editorial=[];let copy=[];
 function text(s,name,value,x,y,w,h,size=28,color=C.ink,font=F.serif,extra={}){
  const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=value;a.text.style={fontSize:size,typeface:font,color,insets:0,autoFit:'none',wrap:'square',...extra};
  if(!['footer','page'].includes(name))copy.push(value);return a;
 }
 function line(s,x,y,w,color=C.line){return s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{fill:color,width:1}});}
 function box(s,name,x,y,w,h,fill){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
 function arrow(s,name,x,y,w,h=0,color=C.gold){return s.shapes.add({name,geometry:'connector',kind:'straight',position:{left:x,top:y,width:w,height:h},line:{fill:color,width:2},tail:{type:'triangle',width:'sm',length:'sm'}});}
 function link(s,name,label,url,x,y,w,h=40,size=24,color=C.gold,font=F.serif){const a=text(s,name,label,x,y,w,h,size,color,font);a.text.get(label).link={uri:url,isExternal:true};a.text.get(label).color=color;return a;}
 function start(title,n,dark=false){
  copy=[];const s=P.slides.add({width:1280,height:720});s.background.fill=dark?C.navy:C.ivory;
  text(s,'title',title,70,64,1140,80,46,dark?C.ivory:C.ink,F.medium);
  line(s,72,652,1136,dark?'#354052':C.line);
  link(s,'footer','advisory.andrewphunter.com/resources/architecting-with-claude/',advisory+'resources/architecting-with-claude/',72,674,750,25,15,dark?C.pale:C.muted,F.mono);
  text(s,'page',String(n).padStart(2,'0'),1152,672,56,28,18,dark?C.brass:C.gold,F.mono,{alignment:'right'});return s;
 }
 function code(s,name,label,value,x,y,w,h,size=23){box(s,name+'-surface',x,y,w,h,C.navy);text(s,name+'-label',label,x+22,y+15,w-44,28,16,C.brass,F.mono);text(s,name,value,x+22,y+57,w-44,h-65,size,C.ivory,F.mono);}
 function finish(s,title,sourceIds=['essay']){
  const revisedTitles={
   'My /architect workflow':'Architect: scope and contracts',
   'What the implementer receives':'The brief ties the role to this change',
   'The evidence has to answer the change':'What comes back from implementation',
   'Bringing review to a decision':'A finding becomes a correction or a decision',
   'The reviewer starts from the contract':'Review against the plan and contracts'
  };
  const body=input.notes[title]??input.notes[revisedTitles[title]];if(!body)throw new Error('Missing notes: '+title);
  const sources=sourceIds.map(v=>refs[v]??v);s.speakerNotes.text=body+'\n\nReferences\n'+sources.join('\n');
  editorial.push({number:P.slides.items.indexOf(s)+1,title,text:copy,notes:body,sources});
 }
 for(const index of input.indices){
  if(index!==0 && P.slides.items.length!==index)throw new Error('Unexpected slide count before '+(index+1));
  switch(index){
   case 0:{
    copy=[];const s=P.slides.items[0];s.background.fill=C.navy;
    const existing=s.shapes.items;
    existing[0].text='Architecting with Claude';existing[0].text.style={fontSize:68,typeface:F.medium,color:C.ivory,insets:0,autoFit:'none'};
    existing[1].text='Working through the design and carrying it into code';existing[1].text.style={fontSize:30,typeface:F.serif,color:C.ivory,insets:0,autoFit:'none'};
    existing[2].text='Andrew Hunter';existing[2].position={left:72,top:296,width:450,height:35};existing[2].text.style={fontSize:22,typeface:F.mono,color:C.brass,insets:0,autoFit:'none'};
    copy.push('Architecting with Claude','Working through the design and carrying it into code','Andrew Hunter');
    text(s,'series','ANDREW HUNTER ADVISORY',72,45,1000,30,20,C.brass,F.mono);
    link(s,'advisory','advisory.andrewphunter.com',advisory,720,298,500,30,20,C.ivory,F.mono);
    finish(s,'Architecting with Claude');break;
   }
   case 1:{
    const s=start('The design is already in the diff',2);
    text(s,'premise','An agent can implement a poor design faithfully, then write tests that preserve the same misunderstanding.',72,180,1080,116,38,C.ink);
    line(s,72,330,1136);
    text(s,'example','Consider a cache',72,370,420,52,31,C.gold,F.medium);
    text(s,'cache-questions','Who owns the data?\nWhat makes it stale?\nWhat does the caller get when refresh fails?',540,370,668,162,29);
    text(s,'consequence','I want to examine those decisions before code and tests depend on them.',72,579,1125,60,29);
    finish(s,'The design is already in the diff');break;
   }
   case 2:{
    const s=start('Working through the design together',3);
    code(s,'plan','STARTING A PLANNING CONVERSATION',`/plan Investigate adding a cache here.\n\nTrace ownership and failure behavior.\nCompare approaches and their costs.\nShow the data flow and invalidation.\nBring back the questions we need\nto resolve before implementation.`,72,184,720,271,24);
    text(s,'iteration','I question the proposal, ask for alternatives, and revise the design with Claude.',72,489,720,111,31);
    const rows=[['Research','What does the source establish?'],['Visualize','Where does this relationship lead?'],['Revise','What else changes if we choose this?']];
    rows.forEach((r,i)=>{const y=190+i*145;text(s,'plan-stage-'+i,r[0],852,y,356,47,30,C.gold,F.medium);text(s,'plan-question-'+i,r[1],852,y+54,356,77,27);});
    finish(s,'Working through the design together',['essay','commands']);break;
   }
   case 3:{
    const s=start('What leaves the planning conversation',4);
    code(s,'plan-record','ILLUSTRATIVE PLAN EXCERPT',`Change: reload application settings\nOwner: SettingsStore\nApproach: prepare, then replace\nPreserve: failed reload keeps active settings\nDepends on: parser result and error contract\nCheck: valid reload; rejected reload\nOutside this change: file watching`,72,183,760,326,22);
    text(s,'carry-reasons','The next thread needs the reasons behind the decisions.',886,190,322,125,32,C.ink,F.medium);
    text(s,'carry-records','Link the research and diagrams.\n\nRecord dependencies and open questions.',886,353,322,196,28);
    text(s,'ready','A question that could change the design still needs an answer before execution.',72,563,1136,73,29);
    finish(s,'What leaves the planning conversation');break;
   }
   case 4:{
    const s=start('Planning continues while work runs',5);
    text(s,'planning-label','Planning thread',72,180,310,48,30,C.gold,F.medium);
    text(s,'planning-detail','Me + planner\n\nResearch, visualize, and revise the next design.',72,247,300,188,28);
    text(s,'backlog-label','Backlog',440,180,280,48,30,C.gold,F.medium);
    const rows=[['Plan A','Ready',249],['Plan B','Ready; independent of A',356],['Plan C','Waiting on a dependency',463]];
    rows.forEach((r,i)=>{box(s,'plan-'+i,440,r[2]-9,312,84,i===2?C.paper:'#f0e7d4');text(s,'plan-name-'+i,r[0],459,r[2],274,35,25,C.ink,F.medium);text(s,'plan-state-'+i,r[1],459,r[2]+37,274,35,20,C.muted);});
    text(s,'execution-label','Execution threads',864,180,344,48,30,C.gold,F.medium);
    text(s,'execution-a','A: /architect\nOwn thread and worktree',864,255,344,86,26);
    text(s,'execution-b','B: /architect\nOwn thread and worktree',864,376,344,86,26);
    arrow(s,'a-to-execution',768,281,72);arrow(s,'b-to-execution',768,401,72);
    text(s,'return-path','Design questions and results return to planning.',72,582,1136,54,29);
    finish(s,'Planning continues while work runs');break;
   }
   case 5:{
    const s=start('My /architect workflow',6,true);
    text(s,'custom','A custom skill in my harness',72,161,1136,42,25,C.brass,F.mono);
    text(s,'handoff','Move the agreed plan into a separate execution thread.',72,226,1090,100,39,C.ivory);
    const cols=[['Derive the contracts','Public headers, invariants, proposed checks, and omissions.'],['Review the agreement','I examine the contracts and test list before implementation.'],['Coordinate execution','Implement, verify, and review. Return evidence and open findings.']];
    cols.forEach((r,i)=>{let x=72+i*397;text(s,'architect-stage-'+i,r[0],x,368,342,83,30,C.brass,F.medium);text(s,'architect-detail-'+i,r[1],x,464,342,143,27,C.ivory);if(i<2)arrow(s,'architect-arrow-'+i,x+345,403,31,0,C.brass);});
    finish(s,'My /architect workflow',['essay','skills']);break;
   }
   case 6:{
    const s=start('The interface carries the agreement',7);
    code(s,'header','ILLUSTRATIVE PUBLIC HEADER',`class SettingsStore {\npublic:\n  // Owns the active settings.\n  // Success replaces the whole value.\n  // Failure preserves the active value.\n  [[nodiscard]]\n  Result reload(std::string_view source);\n};`,72,184,748,337,23);
    text(s,'review-questions','Before implementation',873,190,335,85,30,C.ink,F.medium);
    text(s,'contract-questions','What can the caller rely on?\n\nWhat survives a failure?\n\nWhat would establish each promise?',873,292,335,270,27);
    text(s,'contract-test','The tests observe the promised behavior through the interface.',72,570,1136,63,29);
    finish(s,'The interface carries the agreement');break;
   }
   case 7:{
    const s=start('Contracts reach the API and the screen',8);
    text(s,'api','Service contract',72,184,540,49,32,C.gold,F.medium);
    text(s,'api-contract','A rejected settings update leaves the stored value unchanged.\n\nThe API defines how a caller resolves a timed-out request.',72,259,510,224,30);
    text(s,'screen','Frontend contract',678,184,530,49,32,C.gold,F.medium);
    text(s,'ui-contract','A rejected save preserves the entered values and explains the failure.\n\nThe person can correct the input and try again.',678,259,510,224,30);
    line(s,72,530,1136);
    text(s,'unknown','A timeout needs an explicit recovery path. The API and UI must agree on how to resolve an unknown outcome.',72,558,1136,88,28);
    finish(s,'Contracts reach the API and the screen');break;
   }
   case 8:{
    const s=start('Reviewing the test list before code',9,true);
    text(s,'two-questions','Which contract does this test guard?\nWhat distinct failure would it catch?',72,181,1136,129,39,C.ivory);
    const rows=[['Keep','A rejected reload preserves the active settings.'],['Leave out','Assertions about a private container or helper sequence.']];
    rows.forEach((r,i)=>{let y=347+i*105;text(s,'test-choice-'+i,r[0],72,y,265,48,31,C.brass,F.medium);text(s,'test-example-'+i,r[1],357,y,851,78,29,C.ivory);});
    text(s,'refactor','A behavior-preserving refactor should leave the contract tests intact.',72,583,1136,60,29,C.ivory);
    finish(s,'Reviewing the test list before code');break;
   }
   case 9:{
    const s=start('The model follows the responsibility',10);
    const rows=[['Role','Model I assign','What comes back'],['Planner','Fable / frontier','Design, reasoning, dependencies'],['Architect','Fable / frontier','Contracts and coordinated execution'],['Researcher','Sonnet','Cited evidence for a bounded question'],['Implementer','Opus','Code, checks, and reported omissions'],['Reviewer','Opus, fresh context','Findings against the agreement']];
    const t=s.tables.add({rows:6,columns:3,left:72,top:174,width:1136,height:390,columnWidths:[225,337,574],values:rows});
    t.styleOptions={headerRow:false,bandedRows:false};t.borders.assign({style:'solid',fill:C.line,width:1});
    for(let i=0;i<6;i++){t.rows[i].height=65;for(let j=0;j<3;j++){const cell=t.getCell(i,j);cell.fill=i===0?C.navy:C.ivory;cell.text.style={fontSize:i===0?24:23,typeface:i===0?F.medium:F.serif,color:i===0?C.ivory:j===0?C.gold:C.ink,insets:0,verticalAlignment:'middle',autoFit:'none'};}}
    copy.push(...rows.map(r=>r.join(' / ')));
    text(s,'cost','I watch the cost of an accepted result, including rework and my own time.',72,585,1136,65,27);
    finish(s,'The model follows the responsibility');break;
   }
   case 10:{
    const s=start('What the implementer receives',11);
    code(s,'implementer-brief','ILLUSTRATIVE HANDOFF EXCERPT',`Read the agreed plan and public contracts.\nWork within the assigned component.\nUse the project's build and test instructions.\nImplement the agreed test list.\n\nIf the contract or ownership must change,\nbring that decision back before proceeding.\n\nReturn commands, results, and omissions.`,72,183,790,365,23);
    text(s,'brief-purpose','The brief carries the decisions made before the code.',912,190,296,139,31,C.ink,F.medium);
    text(s,'brief-autonomy','Within that agreement, the implementer can investigate failures, correct the code, and rerun checks.',912,366,296,215,27);
    text(s,'brief-docs','Point to the existing build instructions so the procedure has one home.',72,585,1136,57,27);
    finish(s,'What the implementer receives');break;
   }
   case 11:{
    const s=start('The evidence has to answer the change',12);
    const rows=[['Faster execution','A measurement under the conditions that matter.'],['Preserved output','A comparison that would reveal the unwanted change.'],['Failure recovery','The failure exercised and the resulting state observed.']];
    rows.forEach((r,i)=>{const y=191+i*121;text(s,'evidence-purpose-'+i,r[0],72,y,384,48,31,C.gold,F.medium);text(s,'evidence-observation-'+i,r[1],517,y,691,82,30);if(i<2)line(s,72,y+98,1136);});
    text(s,'evidence-return','Return the command, result, and evidence. Keep unverified behavior visible.',72,580,1136,65,29);
    finish(s,'The evidence has to answer the change');break;
   }
   case 12:{
    const s=start('The reviewer starts from the contract',13);
    code(s,'reviewer-definition','.claude/agents/contract-reviewer.md',`---\nname: contract-reviewer\ndescription: Review against approved contracts.\ntools: Read, Grep, Glob\nmodel: opus\n---\nRead the supplied change, contracts and rules.\nCheck behavior, failure paths and test claims.\n\nReturn each finding as:\nfile:line | contract | observed difference\nDo not edit files or approve the work.\nReport missing inputs and what you inspected.`,72,177,787,438,23);
    text(s,'review-contract','The agreement is the starting point.',910,190,298,127,32,C.ink,F.medium);
    text(s,'review-evidence','A separate context.\n\nSpecific findings the coordinator can act on.\n\nThe inspected scope recorded with the result.',910,354,298,252,27);
    finish(s,'The reviewer starts from the contract',['essay','agents']);break;
   }
   case 13:{
    const s=start('Bringing review to a decision',14);
    const rows=[['One review pass','Examine the change against the contracts and evidence.'],['Correction + checks','Address findings and rerun the affected checks.'],['Return the result','Bring back evidence and unresolved findings for acceptance.']];
    rows.forEach((r,i)=>{const x=72+i*396;text(s,'review-loop-title-'+i,r[0],x,211,335,91,31,C.gold,F.medium);text(s,'review-loop-body-'+i,r[1],x,327,335,158,29);if(i<2)arrow(s,'review-loop-arrow-'+i,x+341,253,31);});
    line(s,72,522,1136);text(s,'design-finding','A finding that changes the contract returns to planning and the owners of affected work.',72,557,1136,80,30);
    finish(s,'Bringing review to a decision');break;
   }
   case 14:{
    const s=start('What the harness enforces',15);
    const rows=[['Role briefs and skills','Carry the procedure, inputs, and stopping conditions.'],['Permissions and sandbox','Restrict available tools, resources, and access.'],['Hooks and merge checks','Invoke checks at covered events and block failed merges.']];
    rows.forEach((r,i)=>{const y=187+i*128;text(s,'enforcement-type-'+i,r[0],72,y,443,79,30,C.gold,F.medium);text(s,'enforcement-detail-'+i,r[1],576,y,632,94,29);if(i<2)line(s,72,y+103,1136);});
    text(s,'enforcement-state','A brief can say “do not edit.” Blocking a write takes a rule the harness enforces.',72,555,1136,61,26);
    finish(s,'What the harness enforces',['essay','skills','hooks','sandbox']);break;
   }
   case 15:{
    const s=start('The team owns its plans and acceptance',16,true);
    const rows=[['The engineer owning the change','Develops the plan, resolves its contracts, and accepts the result.'],['Owners of affected components','Resolve shared-contract changes before dependent work proceeds.'],['The handoff','Pass the agreed plan, decisions, and results to the next engineer or agent.']];
    rows.forEach((r,i)=>{const y=189+i*132;text(s,'team-owner-'+i,r[0],72,y,434,94,31,C.brass,F.medium);text(s,'team-responsibility-'+i,r[1],576,y,632,102,29,C.ivory);if(i<2)line(s,72,y+107,1136,'#354052');});
    text(s,'distributed-decisions','Independent work can proceed without routing every decision through one architect.',72,602,1136,48,26,C.ivory);
    finish(s,'The team owns its plans and acceptance');break;
   }
   case 16:{
    const s=start('The result changes what is ready next',17);
    text(s,'result-contract','An accepted contract',72,191,410,49,31,C.gold,F.medium);
    text(s,'result-ready','The plans depending on it can proceed.',576,191,632,75,30);
    line(s,72,285,1136);
    text(s,'result-change','A changed assumption',72,318,410,49,31,C.gold,F.medium);
    text(s,'result-revisit','Revisit the plans written against the earlier agreement.',576,318,632,90,30);
    line(s,72,427,1136);
    text(s,'result-unknown','A required check still missing',72,460,410,90,31,C.gold,F.medium);
    text(s,'result-visible','Keep that dependency visible before starting the next piece.',576,460,632,90,30);
    text(s,'backlog-learning','Execution returns evidence and questions to the continuing design conversation.',72,587,1136,61,28);
    finish(s,'The result changes what is ready next');break;
   }
   case 17:{
    const s=start('Trying it on the next change',18,true);
    text(s,'next-task','Choose a change where the design still needs work.',72,182,1136,106,43,C.ivory,F.medium);
    text(s,'next-method','Develop the plan together. Make the interface promises explicit. Hand the agreement to execution, then examine the evidence and findings.',72,321,1090,144,33,C.ivory);
    link(s,'essay-link','Read Architecting with Claude',essay,72,509,1090,47,30,C.brass);
    link(s,'advisory-link','Work through this with your team','https://advisory.andrewphunter.com/contact/',72,584,1090,42,27,C.brass);
    finish(s,'Trying it on the next change');break;
   }
   default:throw new Error('Unknown slide '+index);
  }
 }
 return {slideCount:P.slides.items.length,editorial};
}
