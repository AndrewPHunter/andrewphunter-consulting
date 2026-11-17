import {excerpts} from './excerpts.mjs';
export async function revise({presentation:P,input}) {
 const C={navy:'#0e1524',ivory:'#fafaf5',brass:'#d4ad5a',gold:'#856427',ink:'#172238',muted:'#505b69',line:'#cecfc6',paper:'#f0efe7',pale:'#d5d9df'};
 const F={serif:'IBM Plex Serif',medium:'IBM Plex Serif Medium',mono:'IBM Plex Mono'};
 const essay='https://andrewphunter.com/writing/architecting-with-claude/';
 const advisory='https://advisory.andrewphunter.com/';
 const refs={essay,plan:'https://code.claude.com/docs/en/common-workflows#plan-before-editing',agents:'https://code.claude.com/docs/en/sub-agents',skills:'https://code.claude.com/docs/en/skills',memory:'https://code.claude.com/docs/en/memory'};
 function text(s,name,value,x,y,w,h,size=28,color=C.ink,font=F.serif,extra={}){const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=value;a.text.style={fontSize:size,typeface:font,color,insets:0,autoFit:'none',wrap:'square',...extra};return a;}
 function box(s,name,x,y,w,h,fill){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
 function line(s,x,y,w,color=C.line){return s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{fill:color,width:1}});}
 function link(s,name,label,url,x,y,w,h=30,size=20,color=C.gold){const a=text(s,name,label,x,y,w,h,size,color);const r=a.text.get(label);r.link={uri:url,isExternal:true};r.color=color;return a;}
 async function start(index,title,dark=false){
  const s=P.slides.items[index];
  const inspected=await P.inspect({select:'$.slides['+index+'].elements[*]',include:['id']});
  const ids=inspected.records.filter(r=>{const a=P.resolve(r.id);return !['title','footer','page'].includes(a.name)&&a.position?.top!==652;}).map(r=>r.id);
  P.delete(ids);s.background.fill=dark?C.navy:C.ivory;
  const titleShape=s.shapes.items.find(a=>a.name==='title');titleShape.text=title;
  titleShape.position={left:70,top:64,width:1140,height:94};titleShape.text.style={fontSize:42,typeface:F.medium,color:dark?C.ivory:C.ink,insets:0,autoFit:'none',wrap:'square'};
  const footer=s.shapes.items.find(a=>a.name==='footer');footer.text='advisory.andrewphunter.com/resources/testing-with-claude/';footer.text.style={fontSize:15,typeface:F.serif,color:dark?C.pale:C.muted,insets:0,autoFit:'none'};footer.text.get('advisory.andrewphunter.com/resources/testing-with-claude/').link={uri:advisory+'resources/testing-with-claude/',isExternal:true};
  const page=s.shapes.items.find(a=>a.name==='page');page.text=String(index+1).padStart(2,'0');page.text.style={fontSize:18,typeface:F.mono,color:dark?C.brass:C.gold,insets:0,autoFit:'none',alignment:'right'};
  for(const a of s.shapes.items)if(a.position?.top===652)a.line={fill:dark?'#354052':C.line,width:1};
  return s;
 }
 function code(s,name,label,value,x,y,w,h,size=22){box(s,name+'-surface',x,y,w,h,C.navy);text(s,name+'-label',label,x+22,y+15,w-44,26,16,C.brass,F.mono);return text(s,name,value,x+22,y+56,w-44,h-64,size,C.ivory,F.mono,{wrap:'none'});}
 function quote(s,key,y,h=205){return code(s,'excerpt-'+key,excerpts[key].source+'  /  EXCERPT  /  [...] MARKS OMISSIONS',excerpts[key].text,72,y,1136,h,22);}
 function docs(s,items,dark=false){const label='Anthropic: '+items.map(x=>x[0]).join(' · ');const a=text(s,'docs',label,72,620,1136,28,20,dark?C.brass:C.gold);for(const [name,key] of items){const r=a.text.get(name);r.link={uri:refs[key],isExternal:true};r.color=dark?C.brass:C.gold;}}
 function table(s,name,values,widths,top,heights,size=23){const t=s.tables.add({rows:values.length,columns:values[0].length,left:72,top,width:1136,height:heights.reduce((a,b)=>a+b,0),columnWidths:widths,values});t.styleOptions={headerRow:false,bandedRows:false};t.borders.assign({style:'solid',fill:C.line,width:1});for(let r=0;r<values.length;r++){t.rows[r].height=heights[r];for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.navy:C.ivory;cell.text.style={fontSize:size,typeface:r===0?F.medium:F.serif,color:r===0?C.ivory:c===0?C.gold:C.ink,insets:{left:14,right:14,top:10,bottom:10},verticalAlignment:'middle',autoFit:'none'};}}return t;}
 function note(s,title,keys=['essay']){if(!input.notes[title])throw new Error('Missing notes '+title);s.speakerNotes.text=input.notes[title]+'\n\nReferences\n'+keys.map(k=>refs[k]??k).join('\n');s.speakerNotes.setVisible(true);}
 for(const index of input.indices){let s;
  switch(index){
   case 0:{
    s=P.slides.items[0];const subtitle=s.shapes.items.find(a=>a.name==='subtitle');subtitle.text='Keeping generated tests from making the codebase brittle';subtitle.text.style={fontSize:31,typeface:F.serif,color:C.ivory,insets:0,autoFit:'none',wrap:'none'};note(s,'Testing with Claude');break;
   }
   case 1:{
    s=await start(index,'Every generated test becomes maintenance work');
    text(s,'opening','The tests pass. Then you need to change the implementation.',72,173,1136,80,34);
    const rows=[['A private helper is tested','The helper now has to survive the refactor.'],['Mocks prescribe every call','A different algorithm breaks the suite.'],['The same setup runs again','Every local check takes longer.']];
    rows.forEach((r,i)=>{const y=292+i*100;text(s,'h'+i,r[0],72,y,440,75,28,C.gold,F.medium);text(s,'b'+i,r[1],550,y,658,75,28);if(i<2)line(s,72,y+77,1136);});
    text(s,'cost','Generating the tests quickly does not make maintaining them free.',72,605,1136,40,27);
    note(s,'Every generated test becomes maintenance work');break;
   }
   case 2:{
    s=await start(index,'A test has to earn its place');
    text(s,'contract','Which public contract does this protect?',72,184,1136,61,36,C.ink,F.medium);
    text(s,'failure','What change would this scenario alone catch?',72,273,1136,61,36,C.ink,F.medium);
    quote(s,'value',376,205);
    text(s,'decision','No contract or no distinct failure? Leave the test out.',72,609,1136,39,27);
    note(s,'A test has to earn its place');break;
   }
   case 3:{
    s=await start(index,'Private structure is not the contract');
    text(s,'label','ILLUSTRATIVE ASSERTIONS TO REMOVE',72,174,1136,27,18,C.gold,F.mono);
    const rows=[['Uses this internal data structure','Locks in the representation.'],['Calls these helpers in this order','Locks in the algorithm.'],['Calls the helper exactly three times','Locks in the current decomposition.']];
    rows.forEach((r,i)=>{const y=234+i*64;text(s,'h'+i,r[0],72,y,606,55,26,C.ink,F.medium);text(s,'b'+i,r[1],747,y,461,55,25,C.muted);});
    quote(s,'internals',438,180);
    note(s,'Private structure is not the contract');break;
   }
   case 4:{
    s=await start(index,'Do not reshape production code to satisfy a test');
    text(s,'opening','A generated test tries to call a private helper and cannot access it.',72,177,1136,86,34);
    text(s,'temptation','The agent’s fix',72,311,370,48,30,C.gold,F.medium);
    text(s,'changes','Expose the helper. Add an accessor. Move the code into another module.',493,311,715,117,31);
    line(s,72,457,1136);
    text(s,'result','Now the test has changed the architecture.',72,493,1136,54,36,C.ink,F.medium);
    text(s,'decision','Question the assertion. Remove it or observe the existing public contract.',72,580,1136,68,29);
    note(s,'Do not reshape production code to satisfy a test');break;
   }
   case 5:{
    s=await start(index,'Pass-throughs do not earn tests');
    code(s,'wrapper','ILLUSTRATIVE PSEUDOCODE AND PROPOSED TEST','getCustomer(id) => customerApi.getCustomer(id)\n\ntest: getCustomer(id) calls customerApi.getCustomer(id)',72,177,1136,165,26);
    text(s,'reason','The wrapper only forwards to a library or API. The test repeats that call.',72,368,1136,77,31);
    quote(s,'passthrough',462,180);
    note(s,'Pass-throughs do not earn tests');break;
   }
   case 6:{
    s=await start(index,'Existing checks count');
    text(s,'label','EXAMPLES OF TESTS TO LEAVE OUT',72,171,1136,29,18,C.gold,F.mono);
    table(s,'duplicates',[
     ['Proposed check','Already caught by'],
     ['The call matches the declared signature','The compiler.'],
     ['Another negative value rejected by the same rule','The existing error case, with no different failure.'],
     ['A library or API wrapper only forwards its argument','Reading its body.'],
     ['The same validation cases, now through a browser','The unit suite. Keep the browser test for the user flow.']
    ],[555,581],221,[52,74,86,74,88],24);
    text(s,'reason','Another input value needs a different failure to expose.',72,612,1136,35,26);
    note(s,'Existing checks count');break;
   }
   case 7:{
    s=await start(index,'Do not freeze incidental choices into the suite');
    text(s,'settings','The sample account happens to have six orders.\nThe test expects exactly those six.',72,181,1136,108,33);
    text(s,'errors','Two form fields are invalid. The API reports one of them first.\nNo caller was promised which one would win.',72,316,1136,96,30);
    quote(s,'settings',439,180);
    note(s,'Do not freeze incidental choices into the suite');break;
   }
   case 8:{
    s=await start(index,'Refactoring must leave contract tests intact',true);
    text(s,'unchanged','The callers get the same behavior.\nThe internals have changed.',72,177,1136,111,37,C.ivory);
    text(s,'problem','If the tests need rewriting, inspect what they captured.',72,328,1136,71,33,C.brass,F.medium);
    quote(s,'refactor',420,205);
    note(s,'Refactoring must leave contract tests intact');break;
   }
   case 9:{
    s=await start(index,'What chasing 100% coverage can cost');
    const rows=[['Uncovered private code','The agent manufactures tests around it.'],['Behavior-preserving refactor','The internals change. Those tests fail.'],['Tests rewritten with the code','The assertions now agree with the new implementation.']];
    rows.forEach((r,i)=>{const y=183+i*112;text(s,'h'+i,r[0],72,y,430,82,29,C.gold,F.medium);text(s,'b'+i,r[1],550,y,658,87,29);if(i<2)line(s,72,y+91,1136);});
    text(s,'consequence','The regression check changed with the code it was supposed to check.',72,547,1136,88,35,C.ink,F.medium);
    note(s,'What chasing 100% coverage can cost');break;
   }
   case 10:{
    s=await start(index,'Stop making a test project for every function');
    text(s,'cost','Another helper does not need its own test file, setup routine, and test job.',72,178,1136,98,34);
    text(s,'fixture','Prepare expensive immutable inputs once.\nReset mutable state between cases.',72,310,1136,89,30);
    quote(s,'shape',428,205);
    note(s,'Stop making a test project for every function');break;
   }
   case 11:{
    s=await start(index,'Do not replay unit tests through the whole system');
    text(s,'small','Validation tests',72,184,448,48,31,C.gold,F.medium);
    text(s,'small-body','Exercise each distinct refusal with small inputs.',72,255,448,103,31);
    text(s,'whole','Browser and API',674,184,534,81,31,C.gold,F.medium);
    text(s,'whole-body','Check a failed save preserves the draft and shows the error. No replay of every validation case.',674,255,534,159,30);
    quote(s,'integration',445,180);
    note(s,'Do not replay unit tests through the whole system');break;
   }
   case 12:{
    s=await start(index,'Tell Claude what not to write');
    code(s,'prompt','ILLUSTRATIVE PLANNING INSTRUCTION','Leave out tests of private helpers, internal data structures,\ncall sequences, library/API pass-throughs, and incidental settings.\n\nDo not duplicate compiler checks or existing scenarios.\nName the contract and unique failure for each addition.\nExplain which proposed tests you would leave out.',72,171,1136,225,22);
    quote(s,'implementer',410,205);
    docs(s,[['Project instructions','memory'],['Skills','skills']]);
    note(s,'Tell Claude what not to write',['essay','memory','skills']);break;
   }
   case 13:{
    s=await start(index,'Removing tests is a valid review result');
    text(s,'frame','OPUS IN A SEPARATE REVIEW CONTEXT',72,174,1136,29,18,C.gold,F.mono);
    text(s,'brief','Give it the plan, contracts, change, and evidence.\nAsk which tests should be removed or narrowed.',72,225,1136,94,32);
    quote(s,'reviewer',354,251);
    docs(s,[['Custom subagents','agents']]);
    note(s,'Removing tests is a valid review result',['essay','agents']);break;
   }
   case 14:{
    s=await start(index,'Review the tests already in the change',true);
    code(s,'audit','ILLUSTRATIVE PROMPT','/plan Review the tests in this diff. Do not edit yet.\n\nFor each test: keep, narrow, or remove.\nName the public contract and the failure it alone catches.\n\nFlag private structure, library/API pass-throughs, duplicate checks,\nincidental settings, and repeated expensive setup.\n\nInspect tests rewritten alongside behavior-preserving code.\nDid the contract change, or did the test capture internals?',72,171,1136,322,23);
    link(s,'essay','Read Architecting with Claude',essay,72,530,1000,42,28,C.brass);
    link(s,'contact','Work through this with your team',advisory+'contact/',72,577,1000,38,26,C.brass);
    docs(s,[['Plan mode','plan']],true);
    note(s,'Review the tests already in the change',['essay','plan']);break;
   }
  }
 }
 if(input.finalize&&P.slides.items.length>15){const obsolete=await P.inspect({select:'$.slides[15:]',include:['id']});P.delete(obsolete.records.map(r=>r.id));}
 const editorial=P.slides.items.map((s,i)=>({number:i+1,id:s.id,title:s.shapes.items.find(a=>a.name==='title')?.text.toString(),text:s.shapes.items.filter(a=>!['footer','page'].includes(a.name)).map(a=>a.text.toString()).filter(Boolean),tables:i===6?s.tables.items.map(t=>Array.from({length:5},(_,r)=>Array.from({length:2},(_,c)=>t.getCell(r,c).value))):[],notes:s.speakerNotes.text.split('\n\nReferences\n')[0],sources:s.speakerNotes.text.split('\n\nReferences\n')[1]?.split('\n')??[]}));
 return {slideCount:P.slides.items.length,editorial};
}
