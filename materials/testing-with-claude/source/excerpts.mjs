// Exact source selections. [...] marks omissions; only line wrapping changes.
export const excerpts = {
  "value": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "A scenario is written only after its author names the change that this scenario alone would catch. If a compile error, another scenario or reading a one-line body catches it, the scenario is not written.",
        "display": "A scenario is written only after its author names the change that this scenario alone would catch. If a compile error, another scenario or reading a one-line body catches it, the scenario is not written.",
        "offset": 12283
      }
    ],
    "text": "[...]\nA scenario is written only after its author names the change that this scenario\nalone would catch. If a compile error, another scenario or reading a one-line\nbody catches it, the scenario is not written.\n[...]"
  },
  "internals": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "Do not assert internal structure, synchronization strategy or algorithm steps unless the header promises them.",
        "display": "Do not assert internal structure, synchronization strategy or algorithm steps unless the header promises them.",
        "offset": 11940
      }
    ],
    "text": "[...]\nDo not assert internal structure, synchronization strategy or algorithm steps\nunless the header promises them.\n[...]"
  },
  "passthrough": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "Do not assert what a one-line wrapper forwards to: an intrinsic, a libc or std function, an OS or GPU API call. That tests the platform, not our code.",
        "display": "Do not assert what a one-line wrapper forwards to: an intrinsic, a libc or std function, an OS or GPU API call. That tests the platform, not our code.",
        "offset": 11787
      }
    ],
    "text": "[...]\nDo not assert what a one-line wrapper forwards to: an intrinsic, a libc or std\nfunction, an OS or GPU API call. That tests the platform, not our code.\n[...]"
  },
  "settings": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "Tests never assert the shipped graphs' or scenes' current settings, which change with the demo; they build their own inputs.",
        "display": "Tests never assert the shipped graphs' or scenes' current settings, which change with the demo; they build their own inputs.",
        "offset": 11660
      }
    ],
    "text": "[...]\nTests never assert the shipped graphs' or scenes' current settings, which\nchange with the demo; they build their own inputs.\n[...]"
  },
  "refactor": {
    "source": "AGENTS.md",
    "project": "frizzle",
    "sha256": "cc7197798bb76e9298810670beb0e0db2f85c54c5cf0bd2600972dc0770a2479",
    "selections": [
      {
        "original": "A behavior-preserving change that forces a test change means the test asserted implementation: narrow it to its contract or delete it. A changed contract is the only reason to change a test, and the change goes back to review.",
        "display": "A behavior-preserving change that forces a test change means the test asserted implementation: narrow it to its contract or delete it. A changed contract is the only reason to change a test, and the change goes back to review.",
        "offset": 11024
      }
    ],
    "text": "[...]\nA behavior-preserving change that forces a test change means the test asserted\nimplementation: narrow it to its contract or delete it. A changed contract is\nthe only reason to change a test, and the change goes back to review.\n[...]"
  },
  "shape": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "One table-driven scenario per invariant; never one executable per function.",
        "display": "One table-driven scenario per invariant; never one executable per function.",
        "offset": 12487
      },
      {
        "original": "A new test file is for a new public header, not a new function.",
        "display": "A new test file is for a new public header, not a new function.",
        "offset": 12665
      }
    ],
    "text": "[...]\nOne table-driven scenario per invariant; never one executable per function.\n[...]\nA new test file is for a new public header, not a new function.\n[...]"
  },
  "integration": {
    "source": "AGENTS.md",
    "project": "serenity",
    "sha256": "c819ec117101c561e71f103e714698be8e7f872564cfc7d38dea676aeae2a3e6",
    "selections": [
      {
        "original": "the integration test keeps one probe that the path is wired. GPU tests are a few integration tests, never duplicating a unit test.",
        "display": "the integration test keeps one probe that the path is wired. GPU tests are a few integration tests, never duplicating a unit test.",
        "offset": 12150
      }
    ],
    "text": "[...]\nthe integration test keeps one probe that the path is wired. GPU tests are a\nfew integration tests, never duplicating a unit test.\n[...]"
  },
  "implementer": {
    "source": ".claude/agents/implementer.md",
    "project": "serenity",
    "sha256": "3bbe7cdfc5849fb87acf02900082b1ba01d36324b9f61c6cf41d92696bee2f96",
    "selections": [
      {
        "original": "The plan's test list is closed. Write the scenarios it names and no others; one you think is missing goes under \"Needs outside ownership\" with the change it alone would catch.",
        "display": "The plan's test list is closed. Write the scenarios it names and no others; one you think is missing goes under \"Needs outside ownership\" with the change it alone would catch.",
        "offset": 1518
      }
    ],
    "text": "[...]\nThe plan's test list is closed. Write the scenarios it names and no others; one\nyou think is missing goes under \"Needs outside ownership\" with the change it\nalone would catch.\n[...]"
  },
  "reviewer": {
    "source": ".claude/agents/reviewer.md",
    "project": "serenity",
    "sha256": "3748a3604a1dcb43ea05da3082c5ff62b3a362096a445561aa7e55c31c9d1a9a",
    "selections": [
      {
        "original": "- test: a test asserts something other than a public contract",
        "display": "- test: a test asserts something other than a public contract",
        "offset": 1580
      },
      {
        "original": "a scenario not on the plan's test list, one whose change another scenario, the compiler or a one-line body also catches, a second row for one error, a test that makes again an input a fixture holds",
        "display": "a scenario not on the plan's test list, one whose change another scenario, the compiler or a one-line body also catches, a second row for one error, a test that makes again an input a fixture holds",
        "offset": 1886
      }
    ],
    "text": "[...]\n- test: a test asserts something other than a public contract\n[...]\na scenario not on the plan's test list, one whose change another scenario, the\ncompiler or a one-line body also catches, a second row for one error, a test\nthat makes again an input a fixture holds\n[...]"
  }
};
