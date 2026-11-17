// Selected from the source files; only whitespace is reflowed.
// Bracketed ellipses mark omissions. Declared replacements are explicit.
export const excerpts = {
  "architect-scope": {
    "source": ".claude/skills/architect/SKILL.md",
    "project": "serenity",
    "sha256": "848763c99387f2d4497ec6cc5ca11f68e0d355f21062c7f823cc9c6700875678",
    "text": "[...]\nUse the `researcher` agent; do not read a source wholesale yourself.\n[...]\nEach header states its contract, ownership, lifetimes, resource bounds and failure\nbehavior, names the source its design follows, and cites the guideline IDs that shape it.\n[...]\nWrite the test list in the plan as one table, per the Testing section of `AGENTS.md`:\nname | unit or integration | header declaration asserted | the change this scenario alone\nwould catch | fixture it needs. A row with no such change is left off.\n[...]\nThe headers and the test list are the approval gate; nothing below runs until the user\nhas approved them in conversation.\n[...]",
    "selections": [
      {
        "original": "Use the `researcher` agent; do not read a source wholesale yourself.",
        "display": "Use the `researcher` agent; do not read a source wholesale yourself.",
        "normalized_offset": 1597,
        "replacement": null
      },
      {
        "original": "Each header states its contract, ownership, lifetimes, resource bounds and failure behavior, names the source its design follows, and cites the guideline IDs that shape it.",
        "display": "Each header states its contract, ownership, lifetimes, resource bounds and failure behavior, names the source its design follows, and cites the guideline IDs that shape it.",
        "normalized_offset": 2799,
        "replacement": null
      },
      {
        "original": "Write the test list in the plan as one table, per the Testing section of `AGENTS.md`: name | unit or integration | header declaration asserted | the change this scenario alone would catch | fixture it needs. A row with no such change is left off.",
        "display": "Write the test list in the plan as one table, per the Testing section of `AGENTS.md`: name | unit or integration | header declaration asserted | the change this scenario alone would catch | fixture it needs. A row with no such change is left off.",
        "normalized_offset": 3562,
        "replacement": null
      },
      {
        "original": "The headers and the test list are the approval gate; nothing below runs until the user has approved them in conversation.",
        "display": "The headers and the test list are the approval gate; nothing below runs until the user has approved them in conversation.",
        "normalized_offset": 4365,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "architect-execution": {
    "source": ".claude/skills/architect/SKILL.md",
    "project": "serenity",
    "sha256": "848763c99387f2d4497ec6cc5ca11f68e0d355f21062c7f823cc9c6700875678",
    "text": "[...]\nRun the `implementer` agent with the plan path, the headers, the ownership list and the\npresets and machine. Read its Verified table; a missing or failing row is a stop.\n[...]\nRun the `reviewer` agent once, with the changed files, the headers, the plan and the\nimplementer's Verified table.\n[...]\nFindings in the contract, failure, test, facade, omission, performance and guideline\ndimensions go back to the implementer as one correction pass with the same ownership\nlist. A test finding that would add a scenario or a row does not: it goes to the user\nwith the change it alone would catch.\n[...]\nThen state what is implemented, what is verified and by which command, what is omitted\nand where each note is, and what is open. Keep those four apart.\n[...]",
    "selections": [
      {
        "original": "Run the `implementer` agent with the plan path, the headers, the ownership list and the presets and machine. Read its Verified table; a missing or failing row is a stop.",
        "display": "Run the `implementer` agent with the plan path, the headers, the ownership list and the presets and machine. Read its Verified table; a missing or failing row is a stop.",
        "normalized_offset": 4672,
        "replacement": null
      },
      {
        "original": "Run the `reviewer` agent once, with the changed files, the headers, the plan and the implementer's Verified table.",
        "display": "Run the `reviewer` agent once, with the changed files, the headers, the plan and the implementer's Verified table.",
        "normalized_offset": 5488,
        "replacement": null
      },
      {
        "original": "Findings in the contract, failure, test, facade, omission, performance and guideline dimensions go back to the implementer as one correction pass with the same ownership list. A test finding that would add a scenario or a row does not: it goes to the user with the change it alone would catch.",
        "display": "Findings in the contract, failure, test, facade, omission, performance and guideline dimensions go back to the implementer as one correction pass with the same ownership list. A test finding that would add a scenario or a row does not: it goes to the user with the change it alone would catch.",
        "normalized_offset": 5605,
        "replacement": null
      },
      {
        "original": "Then state what is implemented, what is verified and by which command, what is omitted and where each note is, and what is open. Keep those four apart.",
        "display": "Then state what is implemented, what is verified and by which command, what is omitted and where each note is, and what is open. Keep those four apart.",
        "normalized_offset": 6494,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "researcher": {
    "source": ".claude/agents/researcher.md",
    "project": "serenity",
    "sha256": "7c764a39a3408f4fa733d45282ae2e2cde3fc6fc21d3e0887e857187a5180cec",
    "text": "---\nname: researcher\n[...]\ntools: Read, Grep, Glob, Bash, WebFetch\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: sonnet\n---\n[...]\nOutput the mechanism as the document states it, its preconditions and its stated limits,\neach cited to a section, page or timestamp. Separate what the document states from what\nyou infer, and label each inference as one.\n[...]\n- Do not propose designs, simplifications or alternatives.\n[...]\n- Do not summarize a file you did not read in this session.",
    "selections": [
      {
        "original": "---\nname: researcher",
        "display": "---\nname: researcher",
        "normalized_offset": 0,
        "replacement": null
      },
      {
        "original": "tools: Read, Grep, Glob, Bash, WebFetch\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: sonnet\n---",
        "display": "tools: Read, Grep, Glob, Bash, WebFetch\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: sonnet\n---",
        "normalized_offset": 492,
        "replacement": null
      },
      {
        "original": "Output the mechanism as the document states it, its preconditions and its stated limits, each cited to a section, page or timestamp. Separate what the document states from what you infer, and label each inference as one.",
        "display": "Output the mechanism as the document states it, its preconditions and its stated limits, each cited to a section, page or timestamp. Separate what the document states from what you infer, and label each inference as one.",
        "normalized_offset": 2676,
        "replacement": null
      },
      {
        "original": "- Do not propose designs, simplifications or alternatives.",
        "display": "- Do not propose designs, simplifications or alternatives.",
        "normalized_offset": 3407,
        "replacement": null
      },
      {
        "original": "- Do not summarize a file you did not read in this session.",
        "display": "- Do not summarize a file you did not read in this session.",
        "normalized_offset": 3677,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "implementer": {
    "source": ".claude/agents/implementer.md",
    "project": "serenity",
    "sha256": "3bbe7cdfc5849fb87acf02900082b1ba01d36324b9f61c6cf41d92696bee2f96",
    "text": "---\nname: implementer\n[...]\nmodel: opus\n---\n[...]\n- Create or edit only files inside the ownership list.\n- Public headers are the approved contract. If the work needs a header change, stop at\nthe boundary and record it under \"Needs outside ownership\" with the file, the change and\nwhy; do not edit it, do not work around it, do not move logic into a file you own to\navoid it.\n[...]\n- The plan's test list is closed. Write the scenarios it names and no others; one you\nthink is missing goes under \"Needs outside ownership\" with the change it alone would\ncatch.\n[...]",
    "selections": [
      {
        "original": "---\nname: implementer",
        "display": "---\nname: implementer",
        "normalized_offset": 0,
        "replacement": null
      },
      {
        "original": "model: opus\n---",
        "display": "model: opus\n---",
        "normalized_offset": 279,
        "replacement": null
      },
      {
        "original": "- Create or edit only files inside the ownership list.\n- Public headers are the approved contract. If the work needs a header change, stop at the boundary and record it under \"Needs outside ownership\" with the file, the change and why; do not edit it, do not work around it, do not move logic into a file you own to avoid it.",
        "display": "- Create or edit only files inside the ownership list.\n- Public headers are the approved contract. If the work needs a header change, stop at the boundary and record it under \"Needs outside ownership\" with the file, the change and why; do not edit it, do not work around it, do not move logic into a file you own to avoid it.",
        "normalized_offset": 843,
        "replacement": null
      },
      {
        "original": "- The plan's test list is closed. Write the scenarios it names and no others; one you think is missing goes under \"Needs outside ownership\" with the change it alone would catch.",
        "display": "- The plan's test list is closed. Write the scenarios it names and no others; one you think is missing goes under \"Needs outside ownership\" with the change it alone would catch.",
        "normalized_offset": 1516,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "brief-inputs": {
    "source": ".claude/agents/implementer.md",
    "project": "serenity",
    "sha256": "3bbe7cdfc5849fb87acf02900082b1ba01d36324b9f61c6cf41d92696bee2f96",
    "text": "[...]\n## Inputs you must receive\nThe prompt gives you the absolute path of the slice plan,\nthe public headers already written for this step, an\nexplicit list of files or globs you own, and the presets\nand machine to build on. If any of these is missing, stop\nand report what is missing instead of guessing.\n[...]",
    "selections": [
      {
        "original": "## Inputs you must receive\n\nThe prompt gives you the absolute path of the slice plan, the public headers already written for this step, an explicit list of files or globs you own, and the presets and machine to build on. If any of these is missing, stop and report what is missing instead of guessing.",
        "display": "## Inputs you must receive\n\nThe prompt gives you the absolute path of the slice plan, the public headers already written for this step, an explicit list of files or globs you own, and the presets and machine to build on. If any of these is missing, stop and report what is missing instead of guessing.",
        "normalized_offset": 518,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "report-format": {
    "source": ".claude/agents/implementer.md",
    "project": "serenity",
    "sha256": "3bbe7cdfc5849fb87acf02900082b1ba01d36324b9f61c6cf41d92696bee2f96",
    "text": "[...]\n## Report format\nReturn exactly these four sections, in this order:\n1. **Verified**: a table with columns Command | Exit code | Evidence. Only commands you\nran in this session, with their actual exit codes, and the machine they ran on.\n2. **Not verified**: everything the plan expects of this step that you did not\ndemonstrate.\n3. **Omissions and open differences**: each source step you omitted, with the note's\nlocation; each header promise you could not meet, one line each as `UNRESOLVED:\n<path>:<line> <what>`.\n4. **Needs outside ownership**: files outside your list that the work requires.\nNever use \"complete\", \"ready\" or a synonym unless the Verified table is non-empty and\nevery row passed.",
    "selections": [
      {
        "original": "## Report format\n\nReturn exactly these four sections, in this order:\n\n1. **Verified**: a table with columns Command | Exit code | Evidence. Only commands you ran in this session, with their actual exit codes, and the machine they ran on.\n\n2. **Not verified**: everything the plan expects of this step that you did not demonstrate.\n\n3. **Omissions and open differences**: each source step you omitted, with the note's location; each header promise you could not meet, one line each as `UNRESOLVED: <path>:<line> <what>`.\n\n4. **Needs outside ownership**: files outside your list that the work requires.\n\nNever use \"complete\", \"ready\" or a synonym unless the Verified table is non-empty and every row passed.",
        "display": "## Report format\n\nReturn exactly these four sections, in this order:\n\n1. **Verified**: a table with columns Command | Exit code | Evidence. Only commands you ran in this session, with their actual exit codes, and the machine they ran on.\n\n2. **Not verified**: everything the plan expects of this step that you did not demonstrate.\n\n3. **Omissions and open differences**: each source step you omitted, with the note's location; each header promise you could not meet, one line each as `UNRESOLVED: <path>:<line> <what>`.\n\n4. **Needs outside ownership**: files outside your list that the work requires.\n\nNever use \"complete\", \"ready\" or a synonym unless the Verified table is non-empty and every row passed.",
        "normalized_offset": 2673,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  },
  "reviewer": {
    "source": ".claude/agents/reviewer.md",
    "project": "serenity",
    "sha256": "3748a3604a1dcb43ea05da3082c5ff62b3a362096a445561aa7e55c31c9d1a9a",
    "text": "---\nname: reviewer\n[...]\ntools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: opus\n---\n[...]\nThe brief names the files changed in the step, the public headers they implement, the\nslice plan, and the verification the implementer ran. Read all of them.\n[...]\n<path>:<line> | <dimension> | <header line or AGENTS.md rule> | <one-sentence difference>\n[...]\nDo not judge, approve or excuse.\n[...]",
    "selections": [
      {
        "original": "---\nname: reviewer",
        "display": "---\nname: reviewer",
        "normalized_offset": 0,
        "replacement": null
      },
      {
        "original": "tools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: fable\n---",
        "display": "tools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: opus\n---",
        "normalized_offset": 204,
        "replacement": "tools: Read, Grep, Glob, Bash\ndisallowedTools: Write, Edit, NotebookEdit\nmodel: opus\n---"
      },
      {
        "original": "The brief names the files changed in the step, the public headers they implement, the slice plan, and the verification the implementer ran. Read all of them.",
        "display": "The brief names the files changed in the step, the public headers they implement, the slice plan, and the verification the implementer ran. Read all of them.",
        "normalized_offset": 657,
        "replacement": null
      },
      {
        "original": "<path>:<line> | <dimension> | <header line or AGENTS.md rule> | <one-sentence difference>",
        "display": "<path>:<line> | <dimension> | <header line or AGENTS.md rule> | <one-sentence difference>",
        "normalized_offset": 1320,
        "replacement": null
      },
      {
        "original": "Do not judge, approve or excuse.",
        "display": "Do not judge, approve or excuse.",
        "normalized_offset": 3626,
        "replacement": null
      }
    ],
    "reflow": "Whitespace only; words and punctuation preserved except declared replacements."
  }
};
