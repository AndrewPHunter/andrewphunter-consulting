export const PAGE_SIZE = 12;

function normalize(value = "") {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .trim();
}

export function readState(search, topics, formats) {
  const params = new URLSearchParams(search);
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") || "").trim().slice(0, 200),
    topic: topics.includes(params.get("topic")) ? params.get("topic") : "",
    format: formats.includes(params.get("format")) ? params.get("format") : "",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}

export function stateURL(pathname, state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.topic) params.set("topic", state.topic);
  if (state.format) params.set("format", state.format);
  if (state.page > 1) params.set("page", state.page);
  return pathname + (params.size ? `?${params}` : "");
}

export function searchResources(items, state, topics, formats) {
  const query = normalize(state.q);
  const terms = query.split(/\s+/).filter(Boolean);
  return items
    .flatMap((item, order) => {
      if (state.topic && !item.topics.includes(state.topic)) return [];
      if (state.format && state.format !== item.format) return [];
      const title = normalize(item.title);
      const description = normalize(item.description);
      const text = normalize(
        [
          item.title,
          item.description,
          item.body,
          item.kind,
          formats[item.format],
          ...item.topics.map(
            (id) => topics.find((topic) => topic.id === id)?.label || id,
          ),
        ].join(" "),
      );
      if (!terms.every((term) => text.includes(term))) return [];
      const score =
        (query && title.includes(query) ? 20 : 0) +
        terms.reduce(
          (sum, term) =>
            sum +
            (title.includes(term) ? 5 : 0) +
            (description.includes(term) ? 2 : 0),
          0,
        );
      return [{ item, score, order }];
    })
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((result) => result.item);
}

export function paginate(items, requestedPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  return {
    page,
    totalPages,
    start,
    items: items.slice(start, start + PAGE_SIZE),
  };
}

export function pageNumbers(page, total) {
  return [...new Set([1, page - 1, page, page + 1, total])]
    .filter((number) => number >= 1 && number <= total)
    .sort((a, b) => a - b);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function mountSearch(root) {
  const app = root.querySelector("[data-search-app]");
  const form = root.querySelector("form");
  const query = form.elements.q;
  const topic = form.elements.topic;
  const format = form.elements.format;
  const status = root.querySelector("[data-search-status]");
  const results = root.querySelector("[data-search-results]");
  const navigation = root.querySelector("[data-search-pagination]");
  const clear = root.querySelector("[data-search-clear]");
  const retry = root.querySelector("[data-search-retry]");
  let data, state, timer;
  app.hidden = false;

  function render(historyMode = "replace", focusResults = false) {
    const matches = searchResources(
      data.items,
      state,
      data.topics,
      data.formats,
    );
    const pager = paginate(matches, state.page);
    state.page = pager.page;
    query.value = state.q;
    topic.value = state.topic;
    format.value = state.format;
    const url = stateURL(location.pathname, state);
    if (url !== location.pathname + location.search)
      history[`${historyMode}State`](null, "", url);
    clear.hidden = !(state.q || state.topic || state.format);
    const filtered = !clear.hidden;
    const noun = filtered ? "result" : "resource";
    status.textContent =
      matches.length > PAGE_SIZE
        ? `${pager.start + 1}–${pager.start + pager.items.length} of ${matches.length} ${noun}s`
        : `${matches.length} ${noun}${matches.length === 1 ? "" : "s"}`;
    results.replaceChildren();
    for (const item of pager.items) {
      const row = element("a", "resource-row");
      row.href = item.url;
      const body = element("div");
      body.append(
        element("h2", "", item.title),
        element("p", "", item.description),
      );
      const arrow = element("span", "row-arrow", item.external ? "↗" : "→");
      arrow.setAttribute("aria-hidden", "true");
      row.append(element("span", "resource-kind", item.kind), body, arrow);
      results.append(row);
    }
    if (!matches.length) {
      const empty = element("div", "search-empty");
      empty.append(
        element("h2", "", "No matching resources."),
        element(
          "p",
          "",
          "Try fewer words or broaden the topic and format filters.",
        ),
      );
      results.append(empty);
    }
    navigation.replaceChildren();
    navigation.hidden = pager.totalPages <= 1;
    if (!navigation.hidden) {
      function pageLink(number, text, label) {
        const link = element("a", "", text);
        link.href = stateURL(location.pathname, { ...state, page: number });
        if (label) link.setAttribute("aria-label", label);
        if (number === pager.page) link.setAttribute("aria-current", "page");
        link.addEventListener("click", (event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          event.preventDefault();
          clearTimeout(timer);
          state.page = number;
          render("push", true);
        });
        return link;
      }
      if (pager.page > 1)
        navigation.append(pageLink(pager.page - 1, "← Previous"));
      const list = element("ol");
      let previous = 0;
      for (const number of pageNumbers(pager.page, pager.totalPages)) {
        if (number - previous > 1) {
          const gap = element("li", "pagination-gap", "…");
          gap.setAttribute("aria-hidden", "true");
          list.append(gap);
        }
        const entry = element("li");
        entry.append(pageLink(number, String(number), `Page ${number}`));
        list.append(entry);
        previous = number;
      }
      navigation.append(list);
      if (pager.page < pager.totalPages)
        navigation.append(pageLink(pager.page + 1, "Next →"));
    }
    if (focusResults) {
      results.focus({ preventScroll: true });
      status.scrollIntoView({ block: "start" });
    }
  }

  function update(mode = "push") {
    clearTimeout(timer);
    state = {
      q: query.value.trim(),
      topic: topic.value,
      format: format.value,
      page: 1,
    };
    render(mode);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
  });
  query.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => update("replace"), 180);
  });
  topic.addEventListener("change", () => update());
  format.addEventListener("change", () => update());
  clear.addEventListener("click", () => {
    clearTimeout(timer);
    state = { q: "", topic: "", format: "", page: 1 };
    render("push");
    query.focus();
  });
  window.addEventListener("popstate", () => {
    clearTimeout(timer);
    if (!data) return;
    state = readState(
      location.search,
      data.topics.map((t) => t.id),
      Object.keys(data.formats),
    );
    render();
  });

  async function load() {
    form.hidden = true;
    retry.hidden = true;
    status.textContent = "Loading the resource library…";
    try {
      const response = await fetch(root.dataset.index);
      if (!response.ok) throw new Error(`Index returned ${response.status}`);
      data = await response.json();
      if (
        !Array.isArray(data.items) ||
        !Array.isArray(data.topics) ||
        !data.formats
      )
        throw new Error("Invalid resource index");
      const availableFormats = [
        ...new Set(data.items.map((item) => item.format)),
      ];
      for (const item of data.topics)
        topic.add(new Option(item.label, item.id));
      for (const [id, label] of Object.entries(data.formats)) {
        if (availableFormats.includes(id)) format.add(new Option(label, id));
      }
      state = readState(
        location.search,
        data.topics.map((t) => t.id),
        availableFormats,
      );
      form.hidden = false;
      render();
    } catch {
      status.textContent =
        "The resource library couldn't load. Try again, or browse by topic from Resources.";
      retry.hidden = false;
    }
  }
  retry.addEventListener("click", load);
  await load();
}

if (typeof document !== "undefined") {
  const root = document.querySelector("[data-resource-search]");
  if (root) mountSearch(root);
}
