# Charging The Future landing page

One page: a blog reader taps what they need and sees how many people in the Skills Economy
directory match them, then chooses the free Goals board or the paid One Percent introduction.

- `index.html` is the match page at `/`. `app.html` and `src/` are the earlier site (moved from
  `landing-page-v3-deprecated`): The Schemes, Look Ma, Demos, Commons, Chat and Classic keep their
  old addresses because blog posts link to them. `vercel.json` sends any address without a file
  extension (other than `/` and `/api/...`) to `app.html`. `npm run build` (Vite) builds both
  pages into `dist`.
- A visitor taps what they need (the `NEEDS` list in `index.html` maps each need to job titles) and
  is told how many people match them, each counted once.
- `api/counts.js` returns live counts per job title, `api/count.js` counts the people matching a
  set of job titles once each, and `api/match.js` saves what a visitor picked as a code and looks it
  up. All read `DATABASE_URL`, the connection address of the `landing_page` login, which can only read
  the public count views, call the match count, and read and add saved matches (main repo,
  `ctf/scripts/sql/landing_page_login_grants.sql`).
- Without `DATABASE_URL`, or if the database cannot be reached, the page shows the counts baked into
  `index.html` (the `BAKED` list, from 2026-10-13), shows the largest single count as a floor
  (it cannot count a person once without the database), and hides saving.
- Live counts are exact, small ones included: no name or location is attached to a count. The
  baked-in counts were taken when groups under 5 were left blank, so the fallback still says
  "Fewer than 5" for those. The rules for these counts are in the main repo's `CLAUDE.md`, under "Public skill
  counts".
- "Advocates / Awareness Raisers" is a real skill, given from a person's activity on Quora and
  replaced once they join or reply. It sits behind the "Someone to speak up for me" need.
