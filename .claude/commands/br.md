---
description: Do the task on a descriptive branch and open the PR correctly the first time — title and body set at creation.
---

Do the work described in `$ARGUMENTS` on a properly named branch and open its PR with the title and
body set at creation. This is the default workflow this repo already mandates — this command exists
because sessions keep ignoring it and developing on the auto-generated `claude/<slug>` branch. If
`$ARGUMENTS` is empty, apply this routine to the work already done in this session: move any commits
off the session branch onto a descriptive branch and open the PR from there.

Adapted from `commands/br.md` in `chargingthefuture/agents`. What differs here: no parity line, and
the only check is the Vercel build.

## 1. Branch first, before any edit

- Create a descriptive branch off the latest `main`, named `<type>/<short-description>`
  (`fix/footer-blog-link`, `feat/category-filter`, `docs/readme-quickstart`).
- Never develop on, commit to, or open a PR from the session's auto-generated `claude/<slug>`
  branch. If commits already exist there, move them: branch off `main` with the descriptive name,
  cherry-pick or rebase the commits onto it, and abandon the session branch.

## 2. Do the task

- Keep the change minimal and surgical — change only what the task requires.
- Never overwrite shipped design or copy without the owner's approval. `index.html` and
  `src/paper.css` share the color tokens and type; change both together, per `CLAUDE.md`.
- Never put a model identifier in any repo artifact.

## 3. Verify locally before pushing

Run `npm run build` (type-check and production build). Fix what it finds. Do not push red.

## 4. Open the PR correctly the first time

- Title: Conventional Commit (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `ci:`, `perf:`,
  `test:`, `build:`, `style:`, `revert:`).
- Body: what changed and why, in plain words, and `Closes #<issue>` for any issue it resolves. Never
  quote the owner.
- Open ready for review, never as a draft.

## 5. Pick the lane

- Low-risk — copy, styling, layout, docs, refactors: enable auto-merge (SQUASH) right after
  opening.
- Risky — a serverless function in `api/` that reads or writes data, or anything touching a secret:
  open it ready but do not enable auto-merge, and say in the summary that it waits on the owner.

## 6. Report and stop — no PR watching

Do not watch the PR (owner directive, 2026-09-26). Do not subscribe to its activity, do not schedule
a check-in, and do not wait for the Vercel preview. The harness may subscribe on its own; unsubscribe
straight away.

Report once, right after opening: branch name, PR number, lane, and what the local build showed.
Plain language, no pleasantries. When the owner wants to know where open PRs stand, they run `/pr`.
