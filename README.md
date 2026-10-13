# Charging The Future landing page

One static page: a blog reader picks a skill and sees how many people in the Skills Economy
directory could help, then chooses the free Goals board or the paid One Percent introduction.

- `index.html` is the entire site. No build step; Vercel serves it as is.
- The counts are written into `index.html` (the `DATA` list). They come from a query the owner
  runs in the Neon dashboard. Any skill with fewer than 5 people shows no number, so nobody can be
  picked out. The rules for these counts are in the main repo's `CLAUDE.md`, under "Public skill
  counts".
- "Advocates / Awareness Raisers" is left out on purpose: it is the placeholder title for people
  added from Quora who listed no skill.
