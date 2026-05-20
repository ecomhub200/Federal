#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate INDEX_MAP.md + INDEX_MAP_part1..4.md from the CURRENT app/index.html.

The original map was a stale 2026-05-15 / 159,387-line snapshot; the live file
is now ~151,729 lines, so every snapshot line in every modular-prompt drifted
~7.6k lines and the `End L = next-declaration-start - 1` heuristic produced a
phantom (navigateTo listed as 16,441 LOC when it is a 12-line boot stub).

This regenerator:
  * re-derives Start L / End L (heuristic, kept for continuity) / Name / Type
    from the live file,
  * ADDS brace-matched `True End L` / `True LOC` columns (string/comment/regex/
    template aware) so phantoms are corrected in the data,
  * PRESERVES the curated `Depends on` / `Tab/feature` / `Proposed module`
    columns by name-join against the prior map (consensus across duplicate
    names, else TODO-REVIEW),
  * preserves `Used by` for uniquely-named matches, recomputes the coarse
    substring fan-out otherwise.

Read-only on app/index.html. Writes INDEX_MAP*.md (+ .regenerated sidecars
when --sidecar) and prints a stats block consumed by INDEX_MAP_REGEN_NOTES.md.
"""
import os
import re
import sys
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "app", "index.html")
OUT_DIR = os.path.join(ROOT, "docs", "Cowork")
SNAPSHOT_DATE = "2026-05-20"

BANDS = [
    (1, 40000, "INDEX_MAP_part1.md", "L1–40000", 1),
    (40001, 80000, "INDEX_MAP_part2.md", "L40001–80000", 2),
    (80001, 120000, "INDEX_MAP_part3.md", "L80001–120000", 3),
    (120001, None, "INDEX_MAP_part4.md", "L120001–end", 4),
]

RE_WINDOW = re.compile(r"^(\s*)window\.([A-Za-z_$][\w$]*)\s*=\s*(async\s+)?function\b")
RE_FN = re.compile(r"^(\s*)(async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(")
RE_CONST = re.compile(r"^(\s*)const\s+([A-Za-z_$][\w$]*)\s*=\s*(async\s+)?(function\b|.*=>)")
RE_GLOBAL = re.compile(r"^(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=")
RE_LISTEN = re.compile(r"^(document|window)\.addEventListener\(\s*['\"]([^'\"]+)['\"]")

DEFAULT_MODULE = "app/modules/app/unassigned.js"
DEFAULT_TAB = "Unassigned"
COARSE = "(coarse — see PLAN §5)"

HEURISTIC_NOTE = (
    "> **End L is a heuristic** (next declaration start − 1). **Used by** = "
    "approximate whole-file substring fan-out (coarse risk signal). **Depends on** "
    "is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. "
    "Tab/module are prefix/line-band heuristics.\n"
    ">\n"
    "> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, "
    "well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 "
    "early-boot block) it WILDLY overestimates and creates phantom "
    '"16,440-line functions." Trust this column only for blocks under 500 lines '
    "OR when cross-verified by brace-counting.\n"
    ">\n"
    "> `True End L`/`True LOC` are brace-matched (string/comment/regex/template "
    "aware) and authoritative; prefer them. `End L`/`LOC` are retained only to "
    "show the legacy heuristic and its drift."
)


def detect_declarations(lines):
    """Return list of dicts: {start (1-based), name, type}."""
    decls = []
    for i, line in enumerate(lines):
        m = RE_WINDOW.match(line)
        if m:
            decls.append({"start": i + 1, "name": m.group(2), "type": "window fn"})
            continue
        m = RE_FN.match(line)
        if m:
            t = "async fn" if m.group(2) else "fn"
            decls.append({"start": i + 1, "name": m.group(3), "type": t})
            continue
        m = RE_CONST.match(line)
        if m:
            t = "async const arrow" if m.group(3) else "const arrow"
            decls.append({"start": i + 1, "name": m.group(2), "type": t})
            continue
    return decls


def brace_end(lines, start_idx, hard_cap):
    """String/comment/regex/template-aware end-line finder.

    Walks from start_idx (0-based) until the body's first `{` closes (depth 0),
    OR for expression-bodied arrows until the statement terminates at paren/
    bracket depth 0. Returns (end_line_1based, ok_bool). ok=False -> unbalanced
    within hard_cap (emit '?').
    """
    n = len(lines)
    end_scan = min(n, start_idx + hard_cap)

    depth = 0          # {} depth (also tracks ${ } via tmpl stack)
    paren = 0          # () depth
    bracket = 0        # [] depth
    seen_body_brace = False
    state = "code"     # code | sq | dq | tpl | line | block | regex
    tmpl_stack = []    # remembers brace depth at each `${`
    prev_sig = ""      # last significant char (for regex disambiguation)
    arrow_seen = False
    saw_arrow_no_brace = False

    for li in range(start_idx, end_scan):
        line = lines[li]
        L = len(line)
        j = 0
        while j < L:
            c = line[j]
            nx = line[j + 1] if j + 1 < L else ""

            if state == "line":
                break  # rest of line is comment
            if state == "block":
                if c == "*" and nx == "/":
                    state = "code"
                    j += 2
                    continue
                j += 1
                continue
            if state == "sq":
                if c == "\\":
                    j += 2
                    continue
                if c == "'":
                    state = "code"
                j += 1
                continue
            if state == "dq":
                if c == "\\":
                    j += 2
                    continue
                if c == '"':
                    state = "code"
                j += 1
                continue
            if state == "tpl":
                if c == "\\":
                    j += 2
                    continue
                if c == "`":
                    state = "code"
                    j += 1
                    continue
                if c == "$" and nx == "{":
                    tmpl_stack.append(depth)
                    depth += 1
                    state = "code"
                    j += 2
                    continue
                j += 1
                continue
            if state == "regex":
                if c == "\\":
                    j += 2
                    continue
                if c == "[":
                    # char class - skip naively to matching ]
                    j += 1
                    while j < L and line[j] != "]":
                        if line[j] == "\\":
                            j += 1
                        j += 1
                    j += 1
                    continue
                if c == "/":
                    state = "code"
                j += 1
                continue

            # state == code
            if c == "/" and nx == "/":
                state = "line"
                break
            if c == "/" and nx == "*":
                state = "block"
                j += 2
                continue
            if c == "'":
                state = "sq"
                j += 1
                prev_sig = c
                continue
            if c == '"':
                state = "dq"
                j += 1
                prev_sig = c
                continue
            if c == "`":
                state = "tpl"
                j += 1
                prev_sig = c
                continue
            if c == "/":
                # regex literal vs division: regex if prev significant char is
                # an operator / opener / empty
                if prev_sig in ("", "(", ",", "=", ":", "[", "!", "&", "|",
                                "?", "{", "}", ";", "+", "-", "*", "%", "<",
                                ">", "~", "^"):
                    state = "regex"
                    j += 1
                    continue
                j += 1
                prev_sig = c
                continue

            if c == "=" and nx == ">":
                arrow_seen = True
                prev_sig = ">"
                j += 2
                continue
            if c == "{":
                depth += 1
                seen_body_brace = True
                prev_sig = c
                j += 1
                continue
            if c == "}":
                depth -= 1
                if tmpl_stack and depth == tmpl_stack[-1]:
                    tmpl_stack.pop()
                    state = "tpl"
                    j += 1
                    prev_sig = c
                    continue
                if seen_body_brace and depth == 0:
                    return (li + 1, True)
                prev_sig = c
                j += 1
                continue
            if c == "(":
                paren += 1
                prev_sig = c
                j += 1
                continue
            if c == ")":
                paren -= 1
                prev_sig = c
                j += 1
                continue
            if c == "[":
                bracket += 1
                prev_sig = c
                j += 1
                continue
            if c == "]":
                bracket -= 1
                prev_sig = c
                j += 1
                continue
            if not c.isspace():
                prev_sig = c
            j += 1

        # End-of-line bookkeeping for expression-bodied arrows (no body brace)
        if not seen_body_brace and arrow_seen and state == "code":
            stripped = line.rstrip()
            if (depth == 0 and paren <= 0 and bracket <= 0 and stripped
                    and stripped[-1] in (";", ",")):
                return (li + 1, True)
            # bare one-liner: `const x = a => a + 1` with nothing trailing
            if (li == start_idx and depth == 0 and paren <= 0
                    and bracket <= 0 and not stripped.endswith(
                        ("&&", "||", "+", "-", "?", ":", "=>", "(", ",", "."))):
                return (li + 1, True)
        if state == "line":
            state = "code"

    if seen_body_brace:
        return (None, False)  # opened a block that never closed in cap
    # expression arrow we could not terminate -> fall back to heuristic
    return (None, False)


def parse_old_parts():
    """name -> consensus(curated triple) / TODO ; name -> refs (unique only)."""
    by_name = defaultdict(list)
    # Original 9-col layout: Start | End | LOC | Name | Type | Dep | Used | Tab | Module
    row9 = re.compile(
        r"^\|\s*(\d+)\s*\|\s*([\d—\?]+)\s*\|\s*([\d—\?]+)\s*\|\s*`([^`]+)`\s*\|"
        r"\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|"
        r"\s*`([^`]+)`\s*\|\s*$"
    )
    # Extended 11-col layout (post-2026-05-16):
    # Start | End | TrueEnd | LOC | TrueLOC | Name | Type | Dep | Used | Tab | Module
    row11 = re.compile(
        r"^\|\s*(\d+)\s*\|\s*([\d—\?]+)\s*\|\s*([\d—\?]+)\s*\|\s*([\d—\?]+)\s*\|"
        r"\s*([\d—\?]+)\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|"
        r"\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*$"
    )
    for _, _, fn, _, _ in BANDS:
        p = os.path.join(OUT_DIR, fn)
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8") as f:
            for line in f:
                m = row11.match(line)
                if m:
                    name = m.group(6)
                    depends = m.group(8).strip()
                    used = m.group(9).strip()
                    tab = m.group(10).strip()
                    module = m.group(11).strip()
                else:
                    m = row9.match(line)
                    if not m:
                        continue
                    name = m.group(4)
                    depends = m.group(6).strip()
                    used = m.group(7).strip()
                    tab = m.group(8).strip()
                    module = m.group(9).strip()
                by_name[name].append((depends, tab, module, used))
    curated = {}
    used_unique = {}
    todo = set()
    for name, rows in by_name.items():
        triples = {(d, t, mo) for (d, t, mo, _) in rows}
        if len(triples) == 1:
            d, t, mo = next(iter(triples))
            curated[name] = (d, t, mo)
        else:
            todo.add(name)
        if len(rows) == 1:
            used_unique[name] = rows[0][3]
    return curated, used_unique, todo, by_name


def parse_old_globals_listeners():
    """master globals: name->module ; listeners: event->module (most common)."""
    p = os.path.join(OUT_DIR, "INDEX_MAP.md")
    g_mod = {}
    l_mod = defaultdict(Counter)
    if not os.path.exists(p):
        return g_mod, {}
    section = None
    grow = re.compile(
        r"^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*(?:const|let|var)\s*\|[^|]*\|\s*`([^`]+)`\s*\|"
    )
    lrow = re.compile(
        r"^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*`[^`]+`\s*\|\s*\w+\s*\|\s*`([^`]+)`\s*\|"
    )
    with open(p, encoding="utf-8") as f:
        for line in f:
            if line.startswith("## Top-level globals"):
                section = "g"
                continue
            if line.startswith("## Event listeners"):
                section = "l"
                continue
            if section == "g":
                m = grow.match(line)
                if m:
                    g_mod[m.group(1)] = m.group(2)
            elif section == "l":
                m = lrow.match(line)
                if m:
                    l_mod[m.group(1)][m.group(2)] += 1
    return g_mod, {ev: c.most_common(1)[0][0] for ev, c in l_mod.items()}


def main():
    sidecar = "--sidecar" in sys.argv
    with open(SRC, encoding="utf-8") as f:
        lines = f.read().split("\n")
    if lines and lines[-1] == "":
        lines = lines[:-1]  # trailing newline -> match `wc -l` semantics
    total_lines = len(lines)

    decls = detect_declarations(lines)
    decls.sort(key=lambda d: d["start"])

    # heuristic end = next declaration start - 1 (global ordering); last = EOF
    for idx, d in enumerate(decls):
        nxt = decls[idx + 1]["start"] if idx + 1 < len(decls) else total_lines + 1
        d["hend"] = nxt - 1
        if d["hend"] < d["start"]:
            d["hend"] = d["start"]
        d["hloc"] = d["hend"] - d["start"] + 1
        cap = max(d["hloc"] + 2000, 4000)
        te, ok = brace_end(lines, d["start"] - 1, cap)
        if ok and te is not None and te >= d["start"]:
            d["tend"] = te
            d["tloc"] = te - d["start"] + 1
        else:
            d["tend"] = None
            d["tloc"] = None

    curated, used_unique, todo, by_name = parse_old_parts()

    # fan-out for names without a unique-match (and a fallback for all)
    joined_text = "\n".join(lines)

    def fanout(name):
        return max(0, joined_text.count(name + "(") - 1)

    matched = newcnt = todocnt = 0
    for d in decls:
        nm = d["name"]
        if nm in curated:
            dep, tab, mod = curated[nm]
            d["dep"], d["tab"], d["mod"] = dep, tab, mod
            d["used"] = used_unique.get(nm) or ("refs:%d" % fanout(nm))
            matched += 1
        elif nm in todo:
            d["dep"], d["tab"] = "—", DEFAULT_TAB
            d["mod"] = "TODO-REVIEW (dup name)"
            d["used"] = "refs:%d" % fanout(nm)
            todocnt += 1
        else:
            d["dep"], d["tab"] = "—", DEFAULT_TAB
            d["mod"] = DEFAULT_MODULE + " (new)"
            d["used"] = "refs:%d" % fanout(nm)
            newcnt += 1

    # ---- globals ----
    g_old, l_old = parse_old_globals_listeners()
    callable_starts = {d["start"] for d in decls}
    globals_rows = []
    for i, line in enumerate(lines):
        if (i + 1) in callable_starts:
            continue
        m = RE_GLOBAL.match(line)
        if not m:
            continue
        kw, nm = m.group(1), m.group(2)
        mod = g_old.get(nm, DEFAULT_MODULE)
        globals_rows.append((i + 1, nm, kw, mod))

    # ---- listeners ----
    listener_rows = []
    for i, line in enumerate(lines):
        m = RE_LISTEN.match(line)
        if not m:
            continue
        target, ev = m.group(1), m.group(2)
        mod = l_old.get(ev, DEFAULT_MODULE)
        listener_rows.append((i + 1, ev, target, mod))

    # ---- counts ----
    c_named = sum(1 for d in decls if d["type"] in ("fn", "async fn"))
    c_window = sum(1 for d in decls if d["type"] == "window fn")
    c_arrow = sum(1 for d in decls if d["type"] in ("const arrow", "async const arrow"))
    total_decl = len(decls)

    suffix = ".regenerated" if sidecar else ""

    # ---- emit parts ----
    band_counts = {}
    for lo, hi, fn, label, num in BANDS:
        rows = [d for d in decls if d["start"] >= lo and (hi is None or d["start"] <= hi)]
        band_counts[num] = len(rows)
        out = []
        out.append("# index.html function inventory — PART %d (%s)" % (num, label))
        out.append("")
        out.append("Snapshot: %s · source `app/index.html` (%d lines)"
                   % (SNAPSHOT_DATE, total_lines))
        out.append("")
        out.append("Declarations in this part: **%d**" % len(rows))
        out.append("")
        out.append(HEURISTIC_NOTE)
        out.append("")
        out.append("| Start L | End L | True End L | LOC | True LOC | Name | Type "
                   "| Depends on | Used by | Tab/feature | Proposed module |")
        out.append("|---|---|---|---|---|---|---|---|---|---|---|")
        for d in rows:
            te = str(d["tend"]) if d["tend"] is not None else "?"
            tl = str(d["tloc"]) if d["tloc"] is not None else "?"
            out.append("| %d | %d | %s | %d | %s | `%s` | %s | %s | %s | %s | `%s` |"
                       % (d["start"], d["hend"], te, d["hloc"], tl, d["name"],
                          d["type"], d["dep"], d["used"], d["tab"], d["mod"]))
        with open(os.path.join(OUT_DIR, fn + suffix), "w", encoding="utf-8") as fh:
            fh.write("\n".join(out) + "\n")

    # ---- emit master ----
    m = []
    m.append("# index.html function inventory (master)")
    m.append("")
    m.append("Snapshot: %s" % SNAPSHOT_DATE)
    m.append("")
    m.append("- Total file size: **%d** lines" % total_lines)
    m.append("- Total declarations inventoried: **%d** (named fns **%d**, "
             "window fns **%d**, const-arrow **%d**)"
             % (total_decl, c_named, c_window, c_arrow))
    m.append("- Top-level globals: **%d** · Top-level event listeners: **%d**"
             % (len(globals_rows), len(listener_rows)))
    m.append("")
    m.append("## Function inventory parts (by start line)")
    m.append("")
    m.append("| Part | Line band | File |")
    m.append("|---|---|---|")
    for lo, hi, fn, label, num in BANDS:
        m.append("| %d | %s | [`%s`](%s) |" % (num, label, fn, fn))
    m.append("")
    m.append("## Top-level globals (let / const / var at module scope)")
    m.append("")
    m.append("> Mutated/Read columns are coarse — shared-global mutation "
             "analysis is in `MODULAR_PLAN.md` §5. Globals still read by "
             "remaining inline code must NOT be moved (expose `window` mirror).")
    m.append("")
    m.append("| L | Name | Type | Mutated/Read | Proposed module |")
    m.append("|---|---|---|---|---|")
    for ln, nm, kw, mod in globals_rows:
        m.append("| %d | `%s` | %s | %s | `%s` |" % (ln, nm, kw, COARSE, mod))
    m.append("")
    m.append("## Event listeners attached at module top-level")
    m.append("")
    m.append("| L | Event | Selector / target | Handler | Proposed module |")
    m.append("|---|---|---|---|---|")
    for ln, ev, target, mod in listener_rows:
        m.append("| %d | `%s` | `%s` | inline | `%s` |" % (ln, ev, target, mod))
    with open(os.path.join(OUT_DIR, "INDEX_MAP.md" + suffix), "w", encoding="utf-8") as fh:
        fh.write("\n".join(m) + "\n")

    nav = next((d for d in decls if d["name"] == "navigateTo"), None)
    print("=== gen_index_map stats ===")
    print("source_lines=%d" % total_lines)
    print("declarations=%d named=%d window=%d const_arrow=%d"
          % (total_decl, c_named, c_window, c_arrow))
    print("globals=%d listeners=%d" % (len(globals_rows), len(listener_rows)))
    print("name_join matched=%d dup_todo=%d new=%d" % (matched, todocnt, newcnt))
    print("part_counts=%s" % band_counts)
    if nav:
        print("navigateTo start=%d hend=%d hloc=%d tend=%s tloc=%s"
              % (nav["start"], nav["hend"], nav["hloc"],
                 nav["tend"], nav["tloc"]))
    unbalanced = sum(1 for d in decls if d["tend"] is None)
    print("brace_unbalanced_or_expr=%d" % unbalanced)
    print("sidecar=%s" % sidecar)


if __name__ == "__main__":
    main()
