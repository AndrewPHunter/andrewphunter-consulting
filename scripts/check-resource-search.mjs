import assert from "node:assert/strict";
import { test } from "node:test";
import {
  searchResources,
  paginate,
  readState,
  stateURL,
  pageNumbers,
} from "../themes/consulting/assets/js/resource-search.mjs";

const topics = [
  { id: "engineering", label: "Engineering in practice" },
  { id: "governance", label: "AI and governance" },
];
const formats = { training: "Trainings", essay: "Essays", lesson: "Lessons" };
const items = [
  {
    id: "body",
    title: "Reviewing changes",
    description: "A team exercise.",
    body: "Keep evidence of agent decisions.",
    kind: "Training",
    format: "training",
    topics: ["engineering", "governance"],
  },
  {
    id: "title",
    title: "Agent decisions",
    description: "Evaluate the work.",
    body: "",
    kind: "Essay",
    format: "essay",
    topics: ["engineering"],
  },
  {
    id: "code",
    title: "Cradle",
    description: "Build a transformer in C#.",
    body: "",
    kind: "Lessons",
    format: "lesson",
    topics: ["engineering"],
  },
];
const state = { q: "", topic: "", format: "", page: 1 };
const search = (changes) =>
  searchResources(items, { ...state, ...changes }, topics, formats).map(
    (item) => item.id,
  );

test("search uses local body text and ranks a title match first", () => {
  assert.deepEqual(search({ q: "AGENT decisions" }), ["title", "body"]);
  assert.deepEqual(search({ q: "evidence" }), ["body"]);
  assert.deepEqual(search({ q: "C#" }), ["code"]);
  assert.deepEqual(search({ q: "no matching phrase" }), []);
});

test("topic, format, and query filters intersect", () => {
  assert.deepEqual(
    search({ q: "agent", topic: "governance", format: "training" }),
    ["body"],
  );
  assert.deepEqual(search({ topic: "governance", format: "essay" }), []);
  assert.deepEqual(search({ format: "lesson" }), ["code"]);
  assert.deepEqual(search({}), ["body", "title", "code"]);
});

test("pagination handles exact boundaries, empty results, and stale page numbers", () => {
  for (const [count, expected] of [
    [0, 1],
    [12, 1],
    [13, 2],
    [24, 2],
    [25, 3],
  ]) {
    const rows = Array.from({ length: count }, (_, i) => i);
    const last = paginate(rows, 999);
    assert.equal(last.totalPages, expected);
    assert.equal(last.page, expected);
    assert.ok(last.items.length <= 12);
    const combined = Array.from(
      { length: expected },
      (_, i) => paginate(rows, i + 1).items,
    ).flat();
    assert.deepEqual(combined, rows);
  }
});

test("shareable URL state survives encoding and rejects invalid filters/pages", () => {
  const selected = {
    q: "C# & agents",
    topic: "engineering",
    format: "lesson",
    page: 2,
  };
  const url = stateURL("/resources/search/", selected);
  assert.deepEqual(
    readState(
      url.split("?")[1],
      topics.map((t) => t.id),
      Object.keys(formats),
    ),
    selected,
  );
  assert.deepEqual(
    readState("?topic=unknown&format=bad&page=-3", ["engineering"], ["essay"]),
    state,
  );
  assert.equal(readState("?page=2.5", [], []).page, 1);
  assert.equal(stateURL("/resources/search/", state), "/resources/search/");
  assert.deepEqual(pageNumbers(15, 100), [1, 14, 15, 16, 100]);
});
