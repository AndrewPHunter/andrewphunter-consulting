from pathlib import Path
import hashlib,json,re,textwrap
root=Path('/Users/andyhunter/repositories/andrewphunter/andrewphunter-consulting/materials/architecting-with-claude')
repo=Path('/Users/andyhunter/repositories/tech-demos/serenity')
normalize=lambda s:re.sub(r'\s+',' ',s).strip()
records={}
def make(key,path,parts,wrap=89):
    raw=(repo/path).read_text(); canon=normalize(raw); sections=[]; previous=-1
    for item in parts:
        if isinstance(item,tuple): original,replacement=item
        else: original,replacement=item,None
        needle=normalize(original); offset=canon.find(needle)
        assert offset>=0,(key,needle)
        assert offset>previous,(key,'source order',needle)
        previous=offset
        shown=replacement or original
        sections.append({'original':original,'display':shown,'normalized_offset':offset,'replacement':replacement})
    blocks=[]
    for section in sections:
        shown=section['display']
        if shown.startswith('---') or shown.startswith('tools:') or shown.startswith('model:'):
            block=shown
        else:
            block='\n'.join(textwrap.fill(normalize(p),width=wrap,break_long_words=False,break_on_hyphens=False) for p in re.split(r'\n\n|\n(?=- )',shown))
        blocks.append(block)
    # Ellipses mark every gap, including material before/after the selected body.
    text=('' if sections[0]['original'].startswith('---') else '[...]\n')+'\n[...]\n'.join(blocks)+('\n[...]' if canon.find(normalize(sections[-1]['original']))+len(normalize(sections[-1]['original']))<len(canon) else '')
    records[key]={'source':path,'project':'serenity','sha256':hashlib.sha256(raw.encode()).hexdigest(),'text':text,'selections':sections,'reflow':'Whitespace only; words and punctuation preserved except declared replacements.'}
    print(key,len(text.splitlines()),'lines',len(text),'characters')
make('architect-scope','.claude/skills/architect/SKILL.md',[
'Use the `researcher` agent; do not read a source wholesale yourself.',
'Each header states its contract, ownership, lifetimes, resource bounds and failure behavior, names the source its design follows, and cites the guideline IDs that shape it.',
'Write the test list in the plan as one table, per the Testing section of `AGENTS.md`: name | unit or integration | header declaration asserted | the change this scenario alone would catch | fixture it needs. A row with no such change is left off.',
'The headers and the test list are the approval gate; nothing below runs until the user has approved them in conversation.'
])
make('architect-execution','.claude/skills/architect/SKILL.md',[
'Run the `implementer` agent with the plan path, the headers, the ownership list and the presets and machine. Read its Verified table; a missing or failing row is a stop.',
'Run the `reviewer` agent once, with the changed files, the headers, the plan and the implementer\'s Verified table.',
'Findings in the contract, failure, test, facade, omission, performance and guideline dimensions go back to the implementer as one correction pass with the same ownership list. A test finding that would add a scenario or a row does not: it goes to the user with the change it alone would catch.',
'Then state what is implemented, what is verified and by which command, what is omitted and where each note is, and what is open. Keep those four apart.'
])
make('researcher','.claude/agents/researcher.md',[
'---\nname: researcher',
 'tools: Read, Grep, Glob, Bash, WebFetch\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: sonnet\n---',
 'Output the mechanism as the document states it, its preconditions and its stated limits, each cited to a section, page or timestamp. Separate what the document states from what you infer, and label each inference as one.',
 '- Do not propose designs, simplifications or alternatives.',
 '- Do not summarize a file you did not read in this session.'
])
make('implementer','.claude/agents/implementer.md',[
'---\nname: implementer',
'model: opus\n---',
'- Create or edit only files inside the ownership list.\n- Public headers are the approved contract. If the work needs a header change, stop at the boundary and record it under "Needs outside ownership" with the file, the change and why; do not edit it, do not work around it, do not move logic into a file you own to avoid it.',
'- The plan\'s test list is closed. Write the scenarios it names and no others; one you think is missing goes under "Needs outside ownership" with the change it alone would catch.'
])
make('brief-inputs','.claude/agents/implementer.md',[
'## Inputs you must receive\n\nThe prompt gives you the absolute path of the slice plan, the public headers already written for this step, an explicit list of files or globs you own, and the presets and machine to build on. If any of these is missing, stop and report what is missing instead of guessing.'
],wrap=58)
make('report-format','.claude/agents/implementer.md',[
'## Report format\n\nReturn exactly these four sections, in this order:\n\n1. **Verified**: a table with columns Command | Exit code | Evidence. Only commands you ran in this session, with their actual exit codes, and the machine they ran on.\n\n2. **Not verified**: everything the plan expects of this step that you did not demonstrate.\n\n3. **Omissions and open differences**: each source step you omitted, with the note\'s location; each header promise you could not meet, one line each as `UNRESOLVED: <path>:<line> <what>`.\n\n4. **Needs outside ownership**: files outside your list that the work requires.\n\nNever use "complete", "ready" or a synonym unless the Verified table is non-empty and every row passed.'
])
make('reviewer','.claude/agents/reviewer.md',[
'---\nname: reviewer',
('tools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: fable\n---','tools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: opus\n---'),
'The brief names the files changed in the step, the public headers they implement, the slice plan, and the verification the implementer ran. Read all of them.',
'<path>:<line> | <dimension> | <header line or AGENTS.md rule> | <one-sentence difference>',
'Do not judge, approve or excuse.'
])
(root/'source/excerpts.mjs').write_text('// Selected from the source files; only whitespace is reflowed.\n// Bracketed ellipses mark omissions. Declared replacements are explicit.\nexport const excerpts = '+json.dumps(records,indent=2)+';\n')
