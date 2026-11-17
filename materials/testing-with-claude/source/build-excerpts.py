from pathlib import Path
import hashlib,json,re,textwrap
root=Path(__file__).resolve().parent
repos=Path('/Users/andyhunter/repositories/tech-demos')
norm=lambda s:re.sub(r'\s+',' ',s).strip()
excerpts={}
def select(key,project,path,parts,width=79):
 raw=(repos/project/path).read_text();full=norm(raw);spans=[];last=-1
 for item in parts:
  original,display=item if isinstance(item,tuple) else (item,item)
  at=full.find(norm(original));assert at>=0,(key,original);assert at>last;last=at
  spans.append({'original':original,'display':display,'offset':at})
 blocks=['\n'.join(textwrap.fill(norm(x),width=width,break_long_words=False,break_on_hyphens=False) for x in p['display'].split('\n\n')) for p in spans]
 text=('[...]\n' if spans[0]['offset'] else '')+'\n[...]\n'.join(blocks)
 if spans[-1]['offset']+len(norm(spans[-1]['original']))<len(full):text+='\n[...]'
 excerpts[key]={'source':path,'project':project,'sha256':hashlib.sha256(raw.encode()).hexdigest(),'selections':spans,'text':text}
 print(key,len(text.splitlines()),'lines')
select('value','serenity','AGENTS.md',[
'A scenario is written only after its author names the change that this scenario alone would catch. If a compile error, another scenario or reading a one-line body catches it, the scenario is not written.'
])
select('internals','serenity','AGENTS.md',[
'Do not assert internal structure, synchronization strategy or algorithm steps unless the header promises them.'
])
select('passthrough','serenity','AGENTS.md',[
'Do not assert what a one-line wrapper forwards to: an intrinsic, a libc or std function, an OS or GPU API call. That tests the platform, not our code.'
])
select('settings','serenity','AGENTS.md',[
"Tests never assert the shipped graphs' or scenes' current settings, which change with the demo; they build their own inputs."
])
select('refactor','frizzle','AGENTS.md',[
'A behavior-preserving change that forces a test change means the test asserted implementation: narrow it to its contract or delete it. A changed contract is the only reason to change a test, and the change goes back to review.'
])
select('shape','serenity','AGENTS.md',[
'One table-driven scenario per invariant; never one executable per function.',
'A new test file is for a new public header, not a new function.'
])
select('integration','serenity','AGENTS.md',[
'the integration test keeps one probe that the path is wired. GPU tests are a few integration tests, never duplicating a unit test.'
])
select('implementer','serenity','.claude/agents/implementer.md',[
'The plan\'s test list is closed. Write the scenarios it names and no others; one you think is missing goes under "Needs outside ownership" with the change it alone would catch.'
])
select('reviewer','serenity','.claude/agents/reviewer.md',[
'- test: a test asserts something other than a public contract',
'a scenario not on the plan\'s test list, one whose change another scenario, the compiler or a one-line body also catches, a second row for one error, a test that makes again an input a fixture holds'
])
(root/'excerpts.mjs').write_text('// Exact source selections. [...] marks omissions; only line wrapping changes.\nexport const excerpts = '+json.dumps(excerpts,indent=2)+';\n')
