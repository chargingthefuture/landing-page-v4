---
description: Unblock open PRs — fix conflicts, fix failing checks, update branches, and drive each one to merge without being told twice.
---

Work the repository's open pull requests until they merge, without asking me to confirm each step.
`$ARGUMENTS` may name one or more PR numbers or a branch name; if it is empty, sweep every open PR
that is blocked, behind, conflicted, or failing checks. Too many PRs get opened by agents and then
abandoned. Opening a PR is the start of the job, not the end. Do not report back with "the PR needs
X"; do X.

Adapted from `commands/pr.md` in `chargingthefuture/agents`. What differs here: the only check is
the Vercel build, and there is no parity line.

## 1. Take stock

List all open PRs with their mergeable state, check status, and review state. For each one decide
what is in the way:

- `dirty`: merge conflicts against `main`.
- `behind`: out of date with `main`.
- `blocked`: a failing or pending Vercel build.
- Waiting on owner review with a green build: nothing to fix; leave it, and say so.

Skip a PR only when it is a draft someone is actively working, or it sits green and waiting on the
owner. Everything else gets worked.

## 2. Fix conflicts

Check out the PR branch and merge the latest `main` into it. Resolve conflicts by understanding both
sides — never by blindly taking one side, and never by reverting shipped design or copy. If a
conflict is genuinely ambiguous — both sides changed the same logic and picking one loses behavior —
stop on that one PR, say exactly what the two sides do, and keep working the others.

## 3. Fix failing checks

Read the actual Vercel build log before touching anything. A real defect (type error, build error):
fix it on the PR branch, run `npm run build` until it passes, and push. An environmental failure
(rate limit, a Vercel outage): redeploy rather than push a commit to paper over it, and say which
failures were environmental.

## 4. Bring behind branches current, once

Update each PR that reads `behind` in this pass. A low-risk PR with auto-merge on completes itself
once it is green and current. If a low-risk PR has no auto-merge, enable it (SQUASH); leave a risky
one for the owner.

This command is one pass, not a watch (owner directive, 2026-09-26). Do not subscribe to PR
activity, do not schedule check-ins, and do not wait for checks you just triggered. Fix what is
broken now, push, report, and stop.

## 5. Address review comments

Verify each unresolved comment against the code. Fix the real ones; reply once, briefly, to any that
do not hold. Leave none unanswered.

## 6. Know when a PR is dead

If a PR is superseded or its branch is beyond saving, say so and recommend closing it with the
reason. Do not close one without saying so in the summary.

## 7. Report back

One short summary: what merged, what is green and waiting on the owner, what you fixed and how, what
was environmental, and anything stuck with the exact reason. Plain language, no pleasantries.
