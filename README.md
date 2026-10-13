# Charging The Future landing page

One static page: a blog reader picks a skill and sees how many people in the Skills Economy
directory could help, then chooses the free Goals board or the paid One Percent introduction.

- `index.html` is the page. No build step; Vercel serves it as is.
- `api/counts.js` returns live counts and `api/match.js` saves a match as a code and looks it up.
  Both read `DATABASE_URL`, the connection address of the `landing_page` login, which can only read
  the public count views and read and add saved matches (main repo,
  `ctf/scripts/sql/landing_page_login_grants.sql`).
- Without `DATABASE_URL`, or if the database cannot be reached, the page shows the counts baked into
  `index.html` (the `BAKED` list, from 2026-10-13) and hides saving. Any skill with fewer than 5 people shows no number, so nobody can be
  picked out. The rules for these counts are in the main repo's `CLAUDE.md`, under "Public skill
  counts".
- "Advocates / Awareness Raisers" is a real skill, given from a person's activity on Quora and
  replaced once they join or reply. It is listed, but the page never opens on it.
