import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const repo = path.resolve(root, '../..');
const build = path.join(root, '.build');
const output = path.join(root, 'output');
const require = createRequire(import.meta.url);
const artifactRequire = createRequire(require.resolve('@oai/artifact-tool'));
const { FontLibrary } = artifactRequire('skia-canvas');
FontLibrary.use('IBM Plex Serif', [path.join(build, 'fonts/PlexSerif-Regular.ttf'), path.join(build, 'fonts/PlexSerif-Italic.ttf')]);
FontLibrary.use('IBM Plex Serif Medium', [path.join(build, 'fonts/PlexSerif-Medium.ttf')]);
FontLibrary.use('IBM Plex Mono', [path.join(build, 'fonts/PlexMono-Regular.ttf')]);

const C = { navy:'#0e1524', ivory:'#fafaf5', brass:'#d4ad5a', gold:'#856427', ink:'#172238', muted:'#505b69', line:'#cecfc6', paper:'#f0efe7', pale:'#d5d9df' };
const F = { serif:'IBM Plex Serif', medium:'IBM Plex Serif Medium', mono:'IBM Plex Mono' };
const P = Presentation.create({slideSize:{width:1280,height:720}});
const SRC = {
  essay:'https://andrewphunter.com/writing/architecting-with-claude/',
  practices:'https://code.claude.com/docs/en/best-practices',
  commands:'https://code.claude.com/docs/en/commands',
  memory:'https://code.claude.com/docs/en/memory',
  permissions:'https://code.claude.com/docs/en/permissions',
  sandbox:'https://code.claude.com/docs/en/sandboxing',
  settings:'https://code.claude.com/docs/en/settings',
  agents:'https://code.claude.com/docs/en/sub-agents',
  skills:'https://code.claude.com/docs/en/skills',
  hooks:'https://code.claude.com/docs/en/hooks',
  sdlc:'https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle',
  review:'https://claude.com/resources/articles/code-review',
};
const noteSections = (await fs.readFile(path.join(here, 'notes.md'), 'utf8')).split(/^## /m).slice(1);
const notes = new Map(noteSections.map(section => {
  const split = section.indexOf('\n');
  return [section.slice(0, split).trim(), section.slice(split + 1).trim()];
}));
const editorial = [];
const authoredText = new Map();
function box(s,name,x,y,w,h,fill){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function text(s,name,value,x,y,w,h,size=28,color=C.ink,font=F.serif,extra={}) {
  const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  a.text=value; a.text.style={fontSize:size,typeface:font,color,insets:0,autoFit:'none',wrap:'square',...extra};
  if(!authoredText.has(s)) authoredText.set(s,[]);
  if(!['footer','page'].includes(name)) authoredText.get(s).push(value);
  return a;
}
function rule(s,x,y,w,color=C.line){return s.shapes.add({name:'rule',geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{fill:color,width:1}});}
function arrow(s,x,y,w,color=C.gold){return s.shapes.add({name:'flow-arrow',geometry:'connector',kind:'straight',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2},tail:{type:'triangle',width:'sm',length:'sm'}});}
function link(s,name,label,url,x,y,w,h=30,size=18,color=C.gold,font=F.mono){const a=text(s,name,label,x,y,w,h,size,color,font);a.text.get(label).link={uri:url,isExternal:true};a.text.get(label).color=color;return a;}
function start(title,number,dark=false,habit=null){
  const s=P.slides.add();s.background.fill=dark?C.navy:C.ivory;
  const color=dark?C.ivory:C.ink;
  if(habit)text(s,'habit',`HABIT ${habit}`,72,43,600,28,18,dark?C.brass:C.gold,F.mono);
  text(s,'title',title,70,habit?86:64,1140,74,46,color,F.medium);
  rule(s,72,652,1136,dark?'#354052':C.line);
  link(s,'footer','advisory.andrewphunter.com/resources/working-with-claude/','https://advisory.andrewphunter.com/resources/working-with-claude/',72,674,750,25,15,dark?C.pale:C.muted);
  text(s,'page',String(number).padStart(2,'0'),1152,672,56,28,18,dark?C.brass:C.gold,F.mono,{alignment:'right'});
  return s;
}
function code(s,name,label,value,x,y,w,h,size=23){
  box(s,`${name}-surface`,x,y,w,h,C.navy);
  text(s,`${name}-label`,label,x+22,y+15,w-44,25,16,C.brass,F.mono);
  return text(s,name,value,x+22,y+53,w-44,h-65,size,C.ivory,F.mono);
}
function note(s,title,sources=[]){
  const body=notes.get(title);
  if(!body) throw new Error(`Missing presenter notes for ${title}`);
  const refs=sources.map(v=>SRC[v]??v);
  s.speakerNotes.text=`${body}\n\nReferences\n${refs.join('\n')}`;
  editorial.push({title,body,sources:refs,slide:s});
}

// 1. Cover
{
 const s=P.slides.add();s.background.fill=C.navy;
 text(s,'series','ANDREW HUNTER ADVISORY',72,45,1000,32,20,C.brass,F.mono);
 text(s,'title','Working with Claude',68,103,1140,99,76,C.ivory,F.medium);
 text(s,'subtitle','Six habits for your engineering team',72,208,1110,48,33,C.ivory);
 text(s,'author','Andrew Hunter',72,282,450,35,22,C.brass,F.mono);
 link(s,'advisory','advisory.andrewphunter.com','https://advisory.andrewphunter.com/',720,285,500,30,20,C.ivory);
 const bytes=await fs.readFile(path.join(repo,'assets/images/advisory-worktable.png'));
 s.images.add({blob:bytes,contentType:'image/png',fit:'cover',position:{left:0,top:340,width:1280,height:380},alt:'The shared worktable illustration from Andrew Hunter Advisory'});
 note(s,'Working with Claude',['essay','practices']);
}
// 2. The recognizable problems
{
 const s=start('Three problems that show up quickly',2);
 const rows=[
 ['Unchecked handoffs','“Claude double-checked it.”','Nobody ran a check that could reject the result.'],
 ['Latitude without limits','“Clear out that queue.”','The agent can reach more than the task requires.'],
 ['Every session starts from zero','“We explained this last week.”','The next session never receives the correction.']
 ];
 rows.forEach((r,i)=>{const y=191+i*119;text(s,'problem-'+i,r[0],72,y,405,42,29,C.ink,F.medium);text(s,'quote-'+i,r[1],510,y,690,40,28,C.ink);text(s,'explanation-'+i,r[2],510,y+45,690,54,23,C.muted);if(i<2)rule(s,72,y+100,1136);});
 text(s,'harness-definition','The harness is the context, tools, instructions, checks, and permissions Claude works inside.',72,570,1125,66,27,C.ink);
 note(s,'Three problems that show up quickly',['essay']);
}
// 3. The review bottleneck
{
 const s=start('More manual review becomes another queue',3,true);
 text(s,'reading-heading','Read every line',72,204,500,55,37,C.brass,F.medium);
 text(s,'reading','Code arrives faster than people can examine it. Reading turns into skimming, and the important decisions are already buried in the diff.',72,280,500,190,30,C.ivory);
 text(s,'approval-heading','Approve every action',700,204,500,55,37,C.brass,F.medium);
 text(s,'approval','The same routine prompts keep appearing. People learn to approve them without stopping to consider the action.',700,280,500,190,30,C.ivory);
 rule(s,72,511,1136,'#354052');
 text(s,'approach','Anthropic combines automated checks and agent review with human decisions at selected points. The next step is making that loop useful in your repository.',72,550,1130,84,28,C.ivory);
 note(s,'More manual review becomes another queue',['sdlc','review','essay']);
}
// 4. The whole loop
{
 const s=start('How the work moves through Claude',4);
 text(s,'intro','A working loop drawn from Anthropic’s published practices',72,156,1136,43,27,C.muted);
 const steps=[['Plan','Work through the approach together.'],['Build','Implement the agreed change.'],['Verify','Run checks and exercise the system.'],['Review','Examine the change in fresh context.'],['Ship','Run the agreed delivery procedure.']];
 steps.forEach((r,i)=>{const x=72+i*232;text(s,'step-number-'+i,String(i+1).padStart(2,'0'),x,252,180,48,29,C.gold,F.mono);text(s,'step-title-'+i,r[0],x,322,195,53,37,C.ink,F.medium);text(s,'step-body-'+i,r[1],x,397,195,130,27,C.ink);if(i<4)arrow(s,x+110,275,100);});
 rule(s,72,548,1136);text(s,'support','Standing instructions, permissions, hooks, and project checks support the whole loop.',72,580,1125,55,27,C.ink);
 note(s,'How the work moves through Claude',['practices','sdlc','essay']);
}
// 5. Plan
{
 const s=start('Plan before code',5,false,1);
 code(s,'plan-command','IN CLAUDE CODE',`/plan Add retry handling to the API client.\n\nInvestigate the current failure behavior.\nCompare approaches before editing.\nShow what would change, what you would\nleave alone, and how we would check it.`,72,190,714,259,24);
 text(s,'iterate','Then work on the proposal together.',72,478,720,48,30,C.ink,F.medium);
 text(s,'iteration-examples','Question an assumption. Ask for a sequence diagram. Compare another approach. Revise the plan.',72,534,700,99,27,C.ink);
 text(s,'plan-contents','Before accepting the plan',844,192,364,66,29,C.ink,F.medium);
 const items=['Approach and alternatives','Expected changes','Scope and exclusions','How to verify the result','Open questions'];
 items.forEach((v,i)=>text(s,'plan-item-'+i,v,844,283+i*57,365,50,25,C.ink));
 note(s,'Plan before code',['commands','practices','essay']);
}
// 6. Verification
{
 const s=start('Give Claude a way to check its work',6,false,2);
 code(s,'check-script','EXAMPLE package.json EXCERPT',`"scripts": {\n  "check": "npm run build && npm test"\n}`,72,191,635,217,24);
 text(s,'check-note','npm run check combines the existing build and test scripts. Use your project’s own checks.',72,427,635,71,22,C.muted);
 text(s,'loop','Run the check. Read the failure.\nCorrect the change. Run it again.',72,530,650,85,29,C.ink,F.medium);
 text(s,'what-to-observe','The check must answer the task',766,191,442,70,29,C.ink,F.medium);
 text(s,'observations','A UI fix needs the relevant browser state.\n\nAn optimization needs a measurement.\n\nA regression test should reject the broken behavior.',766,283,440,261,27,C.ink);
 text(s,'evidence','Report the command, result, and anything still unverified.',766,565,440,70,25,C.gold);
 note(s,'Give Claude a way to check its work',['essay','practices']);
}
// 7. Standing knowledge
{
 const s=start('Put the rules where Claude reads them',7,false,3);
 code(s,'claude-md','CLAUDE.md','Read and follow AGENTS.md.',72,184,714,110,25);
 code(s,'agents-md','AGENTS.md',`Before implementation, read the build\nand test instructions in README.md.\n\nRecurring mistake: tests coupled to internals.\nA behavior-preserving refactor must leave\ncontract tests intact.\n\nReport checks actually run and any\nbehavior still unverified.`,72,312,714,309,23);
 text(s,'init','/init gives you a first draft.',844,192,363,90,31,C.ink,F.medium);
 text(s,'trim','Edit it down. Keep existing setup and project documentation in their own files.\n\nAdd concise corrections for recurring mistakes.\n\nKeep detailed procedures with the role or workflow that uses them.',844,303,364,304,26,C.ink);
 note(s,'Put the rules where Claude reads them',['memory','commands','essay']);
}
// 8. Boundaries
{
 const s=start('Boundaries, not prompts',8,false,4);
 code(s,'permission-example','.claude/settings.json — EXCERPT',`{\n  "permissions": {\n    "allow": ["Bash(npm run check)"],\n    "deny": ["Read(./.env)"]\n  }\n}`,72,191,664,247,25);
 text(s,'explain-settings','Allow the routine check. Restrict the matching file read. Review the rules with /permissions.',72,466,664,92,28,C.ink);
 text(s,'limits','These rules cover specific tool actions. Sandbox and credentials define the broader reach.',72,571,664,66,23,C.muted);
 const levels=[['Repository','Shared settings control tool permissions.'],['Sandbox','Filesystem and network limits constrain commands.'],['Server','Credentials, branch protection, and required checks control shared systems.']];
 levels.forEach((v,i)=>{const y=191+i*146;text(s,'boundary-'+i,v[0],793,y,415,45,31,C.ink,F.medium);text(s,'boundary-body-'+i,v[1],793,y+53,415,87,25,C.ink);});
 note(s,'Boundaries, not prompts',['permissions','settings','sandbox','commands','essay']);
}
// 9. Independent review
{
 const s=start('Machines review machines',9,false,5);
 code(s,'reviewer','.claude/agents/contract-reviewer.md',`---\nname: contract-reviewer\ndescription: Review against agreed contracts.\ntools: Read, Grep, Glob\nmodel: inherit\n---\nRead the supplied change, plan and contracts.\nReport differences with file and line,\nthe violated promise, and what you observed.\nDo not edit files or approve the work.\nIf inputs are missing, report the gap.`,72,185,720,396,23);
 text(s,'review-inputs','Give the reviewer the agreement',851,191,357,85,30,C.ink,F.medium);
 text(s,'review-body','Supply changed files, the plan, relevant rules, and verification evidence.\n\nFresh context gives the review a separate starting point.\n\nCorrect findings and rerun the affected checks.',851,294,357,277,26,C.ink);
 text(s,'review-invoke','Ask Claude to use contract-reviewer on the agreed change.',72,603,1115,35,24,C.gold);
 note(s,'Machines review machines',['agents','review','essay']);
}
// 10. Automation
{
 const s=start('Automate the inner loop',10,false,6);
 code(s,'skill','.claude/skills/check-change/SKILL.md',`---\nname: check-change\ndescription: Check the current change.\ndisable-model-invocation: true\n---\nRun npm run check.\nInvestigate failures and rerun.\nStop if fixing one changes the agreed scope.\nReport commands, results, and open issues.`,72,184,626,325,22);
 code(s,'hook','SETTINGS hooks EXCERPT',`"PostToolUse": [{\n  "matcher": "Edit|Write",\n  "hooks": [{\n    "type": "command",\n    "command": "npm run format"\n  }]\n}]`,734,184,474,325,23);
 text(s,'skill-why','/check-change loads the repeatable procedure when you invoke it.',72,538,626,83,26,C.ink);
 text(s,'hook-why','The hook runs the formatter after Edit or Write. CI checks formatting before merge.',734,538,474,94,25,C.ink);
 note(s,'Automate the inner loop',['skills','hooks','essay']);
}
// 11. Human judgment
{
 const s=start('Where the engineer’s attention goes',11,true);
 const rows=[['Intent','What should this change do, and why?'],['Checks','What observation would establish that it works?'],['Boundaries','What can Claude do without another decision?'],['Outcome','What remains unresolved, and what should change next time?']];
 rows.forEach((v,i)=>{const y=190+i*103;text(s,'attention-title-'+i,v[0],72,y,290,44,32,C.brass,F.medium);text(s,'attention-body-'+i,v[1],411,y,789,75,29,C.ivory);if(i<3)rule(s,72,y+82,1136,'#354052');});
 text(s,'ownership','The engineer responsible for the change still owns what ships.',72,611,1115,37,26,C.ivory);
 note(s,'Where the engineer’s attention goes',['essay']);
}
// 12. Tie-in points
{
 const s=start('How the pieces fit in a repository',12);
 const rows=[['CLAUDE.md','Loads the shared instructions.'],['AGENTS.md','Keeps references and recurring corrections.'],['.claude/settings.json','Configures permissions and lifecycle hooks.'],['.claude/agents/','Defines each role and its tool access.'],['.claude/skills/','Stores procedures such as /check-change.'],['package.json + CI','Run checks locally and require them at merge.']];
 const table=s.tables.add({rows:6,columns:2,left:72,top:170,width:1136,height:402,columnWidths:[550,586],values:rows});
 table.styleOptions={headerRow:false,bandedRows:false,firstColumn:false};
 table.borders.assign({style:'solid',fill:C.line,width:1});
 for(let i=0;i<6;i++){
   table.rows[i].height=67;
   for(let j=0;j<2;j++){
     const cell=table.getCell(i,j);cell.fill=C.ivory;
     cell.text.style={fontSize:j?24:23,typeface:j?F.serif:F.mono,color:j?C.ink:C.gold,verticalAlignment:'middle',autoFit:'none',insets:0};
   }
 }
 authoredText.get(s).push(...rows.map(v=>v.join(': ')));
 text(s,'keep-existing','Point the harness at the checks and documentation your project already maintains.',72,599,1136,45,26,C.ink);
 note(s,'How the pieces fit in a repository',['essay','memory','settings','agents','skills']);
}
// 13. A first use
{
 const s=start('Start Monday with one repository',13);
 const steps=[['01','Run /init, then edit it down.','Keep useful corrections and links to existing documentation.'],['02','Give Claude one meaningful check.','Use the command that answers the change you are making.'],['03','Set the routine permissions.','Let normal work proceed within an appropriate environment.'],['04','Use /plan on a real change.','Work through the proposal before accepting implementation.'],['05','Review the result and keep the lesson.','Add the correction, check, or boundary the next session needs.']];
 steps.forEach((v,i)=>{const y=177+i*87;text(s,'start-num-'+i,v[0],72,y,66,42,26,C.gold,F.mono);text(s,'start-heading-'+i,v[1],166,y,1042,40,29,C.ink,F.medium);text(s,'start-detail-'+i,v[2],166,y+43,1042,37,24,C.muted);});
 note(s,'Start Monday with one repository',['essay','practices','commands']);
}
// 14. Take-away and connection
{
 const s=start('Bring it back to your team',14,true);
 text(s,'close-question','Which part of your next change\nwould you still have to check by hand?',72,188,1136,129,46,C.ivory,F.medium);
 text(s,'close-body','Choose one gap. Work out what Claude would need to observe, what it can run, and where a person still needs to make a decision.',72,351,1080,104,30,C.ivory);
 link(s,'article-link','Architecting with Claude',SRC.essay,72,501,800,43,30,C.brass,F.serif);
 text(s,'article-description','The full reasoning behind this session',72,549,1000,37,24,C.pale);
 link(s,'contact','Discuss your team’s workflow','https://advisory.andrewphunter.com/contact/',72,601,950,36,24,C.brass,F.serif);
 note(s,'Bring it back to your team',['essay','https://advisory.andrewphunter.com/contact/']);
}

await fs.mkdir(build,{recursive:true});await fs.mkdir(output,{recursive:true});
await fs.writeFile(path.join(here,'slides.md'),editorial.map((e,i)=>`# ${i+1}. ${e.title}\n\n${authoredText.get(e.slide).join('\n\n')}\n\n## Facilitator notes\n\n${e.body}\n\n${e.sources.map(x=>'- '+x).join('\n')}\n`).join('\n---\n\n'));
for(let i=0;i<P.slides.items.length;i++){
 const s=P.slides.items[i];
 const png=await P.export({slide:s,format:'png',scale:1});
 await fs.writeFile(path.join(build,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 const layout=await s.export({format:'layout'});await fs.writeFile(path.join(build,`slide-${String(i+1).padStart(2,'0')}.json`),await layout.text());
 console.log(`Rendered ${i+1}/${P.slides.items.length}`);
}
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(P)).save(candidate);
await fs.writeFile(path.join(build,'deck.json'),JSON.stringify(P.toProto()));
const skill='/Users/andyhunter/.codex/plugins/cache/openai-primary-runtime/presentations/26.1110.11258/skills/presentations';
const runtime='/Users/andyhunter/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES=path.join(runtime,'node/node_modules');
process.env.RUNTIME_PYTHON=path.join(runtime,'python/bin/python3');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const final=path.join(output,'working-with-claude-v1.pptx');
const result=await finalizePresentation({
 workspaceDir:root,candidatePath:candidate,finalPath:final,
 pythonExecutable:path.join(runtime,'python/bin/python3'),
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','12'],
 explicitTotalSlideCount:14,requiredNativeTableOwnerSlides:[12],requiredNativeChartOwnerSlides:[],
 fontPolicy:{basis:'user_request',families:[F.serif,F.medium,F.mono]},
 verifyArtifactToolImport:true,receiptPath:path.join(build,`working-with-claude-${Date.now()}.validation.json`)
});
console.log(JSON.stringify(result));
const fontConfig=path.join(build,'fonts.conf');
await fs.writeFile(fontConfig,`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${path.join(build,'fonts')}</dir><dir>/System/Library/Fonts</dir><cachedir>${path.join(build,'font-cache')}</cachedir></fontconfig>`);
execFileSync(path.join(runtime,'bin/override/soffice'),['--headless','--convert-to','pdf','--outdir',output,final],{env:{...process.env,FONTCONFIG_FILE:fontConfig,SAL_FONTPATH:path.join(build,'fonts')},stdio:'inherit'});
console.log(JSON.stringify({pptx:final,pdf:path.join(output,'working-with-claude-v1.pdf'),slides:P.slides.items.length}));
