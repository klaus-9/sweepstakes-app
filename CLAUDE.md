# CLAUDE.md — Global Instructions

## Start of every session: read these first

Before doing anything else in a session, read all three files in the `About Me/` folder
and act on them for the entire session:

1. **`About Me/about-me.md`** — who Ankit is, his work, tools, and how he likes to work.
   Use this as context for every decision.
2. **`About Me/writing-rules.md`** — how to write so it doesn't sound like AI. Apply these
   rules to *everything* I write: chat replies, docs, code comments, commit messages.
3. **`About Me/memory.md`** — my running memory of where projects stand. Read it to regain
   context, and **keep it updated** (see below).

## Keep memory current

`About Me/memory.md` is the system that stops me forgetting where we are.

- **Append** new developments to its **Log** (newest at the bottom), dated `YYYY-MM-DD`.
- **Update existing entries in place** when a fact changes, rather than adding a
  contradictory one.
- Update it when: a project's status changes, a decision is made, a new project starts,
  or an open question gets answered. Do this proactively, not only when asked.

## Naming convention for these files

- Markdown files: **kebab-case**, lowercase, words separated by hyphens, `.md` extension
  (e.g. `about-me.md`, `writing-rules.md`, `meeting-notes.md`).
- Keep names short and descriptive.

## Scope note

These instructions load when this folder (`sweepstakes-app`) is the selected Cowork
folder. To apply them across all projects, keep the `About Me/` folder somewhere stable
and point to it, or copy this `CLAUDE.md` into other project roots.
