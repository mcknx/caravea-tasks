# How I used AI on this

## Tools

- **Claude Code (Claude Opus)**: my coding driver. It wrote first drafts of the code, tests and this README while I directed and reviewed every diff.
- **jev (TypeSafe's judgment model)**: my decision driver. I ask it typed questions and only treat an answer as decided at 0.80 confidence or above.
  - **SQLite instead of PostgreSQL:** 0.80, so decided. Zero setup for whoever reviews this.
  - **Which module to build:** tasks scored highest (0.46), ahead of bookings (0.38), inventory (0.33) and expenses (0.32). None reached 0.80, so I took the top pick. The brief says the idea isn't scored anyway.
  - **Pure JSON API vs. Laravel + Inertia (0.51) and how many tests to write (0.52):** a coin-flip, so these were my own calls. I chose a JSON API, because the brief asks for a separate Next.js frontend, and feature tests on every endpoint.

## One thing the AI got wrong

Claude's first browser test failed on the edit step: "element is not visible" when choosing a status.

- **What it assumed:** only one form is on the page.
- **What actually happens in Next.js 16:** pages you navigate away from stay **mounted but hidden** (React Activity), so going back is instant. After visiting "New task" and then "Edit", both forms were in the DOM, and the test grabbed the hidden one.
- **How I found it:** I opened the edit page in a script and listed every `<main>` with its visibility. Three pages were mounted, and only "Edit task" was visible.
- **The fix:** every lookup in the test is scoped to `main:visible` (`web/tests/e2e.mjs`).
- **Why it matters:** this isn't a bug in the app, but a test or script written for the old Next.js model can silently act on a page the user can't see.

A second, smaller one: the AI's training is older than Next.js 16 and Laravel 13. The `web/AGENTS.md` that `create-next-app` generates says exactly that ("This is NOT the Next.js you know"). So before writing the frontend, I had it read the docs bundled in `node_modules/next/dist/docs`, which is how it learned about Cache Components and the `<Suspense>` requirement.

## My setup

- **Context files the AI read:**
  - `api/CLAUDE.md` / `api/AGENTS.md`: Laravel's own agent guidelines.
  - `web/AGENTS.md`: Next.js's warning to read the bundled docs.
  - My global `CLAUDE.md`, which sets my rules: smallest working change, reuse before writing, no new dependency unless needed, and a test left behind for any non-trivial logic.
- **Skills (Claude Code):**
  - `brainstorming`: design first, approved by me before any code.
  - `test-driven-development`: the 7 API tests were written first and watched fail.
  - `ponytail`: keeps the code minimal.
- **Process:** design → my approval → failing tests → implementation → tests pass → real-browser e2e → commit. It's visible in the commit history.

## Prompt history

The build was driven from one Claude Code session. The prompts that shaped it:

1. Paste the assessment brief, then "start caravea".
2. Claude proposes a design (module, API shape, SQLite, tests, README plan). I approve it: "yes just go".
3. In that session Claude scaffolds both apps, writes the failing Laravel tests, implements the API until 7/7 pass, reads the Next 16 docs, builds the UI, then writes and debugs the browser test (the hidden-form issue above).
4. I review the screenshots and diffs, then ask for this README and these notes.
