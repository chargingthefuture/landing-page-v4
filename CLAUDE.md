# CLAUDE.md

Repo: `chargingthefuture/landing-page`. Public-facing marketing/landing site. Vite + React + TypeScript single-page app at the repo root (npm).

## Agent Communication Rules (always apply)

Canonical source: [`chargingthefuture/chargingthefuture` → `.github/instructions/098-agent-communication-rules.mdc`](https://github.com/chargingthefuture/chargingthefuture/blob/main/.github/instructions/098-agent-communication-rules.mdc). Full rules reproduced here since that file lives in another repo.

### Mandatory
- Communicate as a robot/system agent, not a human. Do not use TL;DR, etc.
- Be maximally concise; eliminate every non-essential word.
- Avoid all pleasantries, greetings, and human-like courtesies.
- Provide direct facts and actions only; no hedging or qualifiers.
- Use structured formats (lists, tables, code blocks) instead of prose.
- Omit explanatory preamble; lead with actionable information.

### Response Structure
- Lead with facts, not context-setting.
- Use line breaks for visual separation instead of verbose transitions.
- Combine related information into single messages; avoid multi-step back-and-forth unless necessary.

### Text Formatting
- Minimize bold text. Applies to both chat responses and any `.md` (or other) files agents create or edit.
- Do not bold for emphasis, do not bold every list-item label, and do not bold entire sentences. Bold has no logical value when overused; it adds visual noise without adding information.
- Acceptable bold use is rare and structural only: e.g. a single table header or a one-word inline label where the surrounding document already uses that convention. When in doubt, do not bold.
- Prefer plain prose, lists, headings, and tables to carry structure instead of bold.

### Prohibited
- Verbose explanations of obvious operations.
- Unnecessary elaboration on what the agent is about to do ("I will now...", "I'm going to...").
- Multiple introductory sentences before the actual content.
- Filler comments or padding.

### No running commentary while working (owner directive, 2026-11-23)
- Do not narrate work in progress: no text between tool calls announcing what was just found or what comes next. The owner follows the session on a phone, and every such line is output the account pays for.
- Write text only when the work is done, when it is blocked on something only the owner can decide or do, or when a decision changes what the owner gets (a different approach than asked, something skipped).
- A tool call's short description field is not commentary and stays.

### Banned pleasantries (enforced by the Stop hook)
- Never in a reply: thanks / thank you, you're welcome, no problem, my pleasure, glad, happy to, excited, delighted, sorry, any form of apology, cheers, congrats / congratulations, "I appreciate" / "we appreciate", "hope this / that / you / it", feel free, warm / best / kind regards, looking forward.
- `.claude/hooks/check-no-pleasantries.mjs` blocks a reply that carries one of these or a word in Excluded Vocabulary below, and asks for a plain restatement. The hook is the source of truth; if this list and the hook differ, the hook wins. Keep the two in step. When it blocks, restate once, briefly, then stop.

### Plain language
- No jargon, acronyms or insider terms in replies, pull requests, commit messages, comments or documentation. Prefer the plain word ("make sure" over "ensure idempotency").
- If a technical term is genuinely needed, define it in plain words on first use. Code identifiers, file paths, command names and proper nouns are exempt.

### American English (owner directive, 2026-11-23)
- Replies, pull requests, commit messages, code comments, documentation and site copy use American spelling: "color", "behavior", "organize", "center", "license", "canceled", "gray".
- Code identifiers, paths, quoted text and proper nouns keep their exact spelling. Lines you touch that use British spelling switch to American.

### No phases
- Never break work into "Phase 1 / Phase 2" or phased buckets. List tasks one after another in the order they must happen, and name a blocking dependency where order matters ("B is blocked by A").

### Information Density Priority
- Max substantive content per message.
- Min transitional or explanatory language.
- Facts before context.
- Structured data before narrative summary.

### Excluded Vocabulary

| Do not use | Use instead | Reason |
|---|---|---|
| punch list | list | Jargon; unclear meaning. |
| stale | drop it; if you mean something specific, name it (out-of-date, superseded, no longer current) | "Deprecated" means retired, not out of date, so it is not a substitute. |
| flywheel | a plain description of the loop (for example "each answer improves the next") | Jargon. |
| console | dashboard | Developer jargon for a screen. The code identifiers `console.log`, `console.error` and `console.info` are exempt. |
| whole, wholly | entire, all of, end to end, or drop it | The word itself, in every frame. Most uses carry nothing. |
| "that/this/which/it is the point of / here" | end on the fact itself | The sentence after the facts that says which of them mattered. If a sentence only labels what came before it, delete it. |

## Architecture

- Two pages from one Vite build. `index.html` is `/`, the Skill Match page: plain HTML, CSS and script, with serverless functions in `api/`. `app.html` is the older Vite + React + TypeScript app (`src/`, routed with `wouter`) that serves `/look-ma`, `/schemes`, `/demos` and the other v3 paths blog posts still link to; `vercel.json` sends every path without a dot there. Most of that app's copy lives in `src/App.tsx`.
- `/schemes` mirrors the ClickLog scheme tag list one-for-one. Canonical names live in the app repo (`chargingthefuture/chargingthefuture` → `ctf/packages/shared/src/click-log/tags.ts`, `CLICK_LOG_SCHEME_TAGS`); when that list gains a scheme, add it here too. Descriptions are owned in this repo. See the SOURCE OF TRUTH NOTE above the `SCHEMES` array in `src/App.tsx`.
- Design sync (one-way, design → this repo): `chargingthefuture/design` is the source of truth for landing-page layout and copy. Its mirror of this app lives at `artifacts/ctf-landing/src/App.tsx` in that repo. Replicate visual and copy changes from there into this repo's `src/App.tsx` by hand. Sync direction is one-way; never write back to the design repo.
- Ownership boundary: demo links (`youtubeId` / `protonLink`) and plugin descriptions (`desc`) in the `FEATURES` array are owned in this repo's code, not in design. Do not sync those from the design mocks (they are intentionally deprecated there). See the SOURCE OF TRUTH NOTE in `src/App.tsx` and the design repo's `sync-manifest.json` / `DESIGN_BOUNDARY.md`.
- Design: one design across the project's sites, one color per site. farahbrunache.com (the paid tier) is forest green; this site (the free tier) is burgundy. `index.html` holds the color tokens and type (Newsreader, DM Sans, DM Mono, self-hosted through `src/brand-fonts.css`; no request goes to Google); `src/paper.css` copies them for `/look-ma` and `/schemes`, framed by `src/components/PaperShell.tsx`. Change both together. The remaining v3 pages still use the older comic style (Bangers, Space Grotesk, self-hosted in `public/fonts` via `src/fonts.css`).
- Deploy: handled by the Vercel GitHub app. Pushes/merges to `main` deploy production; PRs get preview deployments. `vercel.json` sends paths without a dot (other than `api/`, `assets/`, `fonts/`) to `app.html`. No GitHub Actions workflows in this repo; CI status on PRs comes from Vercel.

## Commands (run from repo root)

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server (Vite) |
| `npm run build` | Type-check + production build (`tsc -b && vite build` → `dist/`) |
| `npm run preview` | Serve the production build locally |

## Git Branch and PR Naming (always apply)

- Branch names must be descriptive — never use auto-generated or random identifiers (e.g. `claude/gifted-archimedes-oHMEA`).
- Use the pattern `<type>/<short-description>`, e.g. `fix/footer-blog-link`, `feat/category-filter`, `docs/add-claude-md`.
- PR titles must match: concise, action-oriented, no random strings.
- If a branch was created with a bad name, rename it before opening the PR: create a new descriptive branch from the same commits, open the PR from that, close the old one, delete the old branch.

## Pull requests and the merge lifecycle (all agents)

A task is not finished when the code is written — it is finished when the change is merged and the
branch is cleaned up. Carry every change through that path, in this order, without being asked:

1. Open a pull request when the work is complete. Once the task's changes are committed and the
   descriptive branch is pushed, open a pull request from that branch against the default branch.
   Finished work should not sit on a branch with no pull request. Give the request a descriptive,
   plain-language title and a body that says what changed and why, in the same plain voice as every
   other reply.
2. Do not watch the request. Report once, right after opening, and stop; auto-merge (step 4)
   finishes it. See *No pull-request watching* below.
3. Keep it mergeable — fix conflicts. When a pass over open requests finds the default branch has
   moved ahead and a request has merge
   conflicts, bring the latest default-branch commits into the branch (rebase onto it, or merge
   it in) and resolve the conflicts, keeping both sides' intent. If a conflict is a real, ambiguous
   clash where either resolution changes how the code behaves, stop and ask rather than guess.
4. Merge when it is ready. Merge once the automated checks (continuous integration, or CI) are
   green and the request is mergeable with no unresolved "changes requested" review. Use the
   repository's default merge method. If required checks take a while, turn on auto-merge so the
   request merges itself the moment they pass, rather than waiting on it. Never force a merge over a
   failing required check or an open request for changes — fix the cause, or report it and stop.
5. Delete the branch after merge. Once the request is merged, delete the now-merged head branch
   so old branches do not pile up.

The gate in step 4 — green checks, mergeable, no open change-requests — is the safe default. A
repository that requires human review before merge should keep that requirement: set the gate to
match the repository's own rules rather than merging around them.

### Two lanes by risk (owner decision, 2026-06-05)

Pick the lane when the request is opened, from what the change touches:

- Low-risk lane, the default: copy, styling, layout, documentation, refactors, type, lint and test
  changes, dead-code removal. Open it ready for review and turn on auto-merge right away; it merges
  itself once the checks pass.
- Owner-review lane: anything that moves money or credits, touches sign-in or access checks, deletes
  or migrates stored data, changes a database schema, adds or changes an interface other code calls,
  or adds new stateful logic or a new feature area. Open it ready for review, not as a draft, and do
  not turn on auto-merge. Say in the body that it waits on the owner's review. It is not a blocker:
  keep working, and the owner reviews and merges it.

In this repository the risky areas also include a serverless function in `api/` that reads or
writes data, and anything touching a secret. If a risky
request merges before its review findings were applied, open a small follow-up request with the
findings that still hold.

Mechanism, by where the agent runs:

- Claude Code on the web: use the GitHub tools to open the request, update its branch from the
  default branch, and turn on auto-merge. Do not use the pull-request activity subscription. The
  harness may subscribe a session to every request it opens on its own; unsubscribe straight away.
- Local Claude Code / a terminal: `gh pr create` to open it, `gh pr checks` to read check state,
  `git rebase`/`git merge` to clear conflicts, and `gh pr merge --auto --delete-branch` (with the
  repository's merge method) to merge and remove the branch in one step.

## No PR watching (owner directive, 2026-09-26)

Never watch a pull request. After opening one, do not subscribe to its activity, do not schedule a check-in, and do not wait for its checks to finish. Report once and stop. The harness may subscribe a session to every pull request it opens on its own; unsubscribe straight away.

Watching fills the session with GitHub notices and full check lists, which brings on compaction sooner, and a compacted session loses what the owner said earlier. The owner merges from their phone and sees the checks there. Checks run locally before every push are what keep a pull request from going red; when the owner wants to know where open pull requests stand, they ask, and the agent makes one pass over them, not a watch.

## Keep sessions from filling up (owner directive, 2026-09-26)

Everything an agent reads stays in the session until compaction, and compaction swaps the earlier conversation for a summary. So spend the session on the owner's words, not on raw output.

- Hand broad searches to a helper agent that returns only its conclusion. Anything that means reading across several files or directories to answer one question goes to a helper; a single lookup in a known file is done directly.
- Read only the part of a file the task needs, by line range or search, not entire files.
- Read only failed checks and the failing part of a log. Never pull a full list of passing checks or a full log to confirm something is green.
- Take a screenshot only when a visual change has to be checked, and look at it once.

The owner can also compact on their own terms: typing `/compact` followed by what to keep (for example, `/compact keep the open PR list and today's rules`) compacts at a moment they choose, with their instructions shaping the summary. `/clear` starts the session over. Rules that must outlive any session go in this file, not in chat.

## Slash commands (always apply)

Each routine is a file in `.claude/commands/`, copied from `chargingthefuture/agents` and adapted to this repository's build. The owner does not have to type the command for it to apply; the request itself is the trigger.

| Command | Applies when |
|---|---|
| `/br` | Any request that changes files: branch off `main`, surgical change, `npm run build`, open the PR with title and body set at creation, auto-merge on a low-risk one. Never the session's `claude/` branch. |
| `/pr` | Open pull requests are behind, conflicted or failing the Vercel build. One pass; fix each, do not report that it needs something. |
| `/fix` | The owner points at a sentence that reads badly. Rewrite it, fix every copy, push. Two-line reply, no explanation. |
| `/fl` | The owner asks whether the chat can be archived. Open tasks only; an open pull request is not one. |
| `/sync` | The owner asks to bring this repository in line with the `chargingthefuture/agents` baseline. One pull request. |

## Search tooling

- Prefer `rg` (ripgrep) for recursive text and file discovery.
- Keep a grep fallback where a search command is shown: `if command -v rg >/dev/null 2>&1; then rg -n "pattern" path; else grep -RIn "pattern" path; fi`

## Never quote the owner in repository artifacts (all agents)

Do not quote the owner's messages anywhere the repository can see: not in a commit message, a pull
request title or body, a change log, a test script, a rule file, or a code comment. A pasted message
is the owner's prompt published to git history. Write what the code does and why, in your own words.
`Owner directive: an admin list hides nothing.` is correct; a block quote of the message, however
short, is not. Quoting the product's own strings (a button label, an error the route returns) is
fine; that is the artifact under discussion.

## Record a reason the owner gives in neutral words (all agents)

When the owner gives a reason for a decision, write a neutral version of it in any repository, and
never their own wording, especially in a public one. In a queue line, a commit message or a pull
request body, name no person's motive or affiliation. The full reason stays in chat.

## The owner has no terminal (all agents)

The owner works from a phone: no shell, no local checkout. Never end a piece of work with a command
for the owner to run. When something has to happen outside the repository, deliver it as a screen
in the app, as text the owner pastes into a web dashboard (the statement itself, with no shell
wrapper), or as a workflow the owner can run from the GitHub app.

## Dates come from the owner's clock (all agents)

The owner is on Eastern time (UTC-4 in summer, UTC-5 in winter); agent containers run on UTC. Any
date written into a file, a post, a file name or a change log is the owner's date. Take it from a
commit the owner authored (`git log -1 --format=%ad --date=iso`), or subtract the offset from UTC;
never from the container's `date`, which is a day ahead from 20:00 the owner's time.

## Remove what nothing uses, in the same change (all agents)

When a change leaves something with no users — a column, a function, a flag, a setting, a screen —
delete it as part of that change. Do not list it as a follow-up or ask whether to remove it. Verify
first: search the entire repository for readers and writers, including scripts, migrations and
generated files. Something already unused before you arrived is different: mention it and leave it
unless told otherwise.
