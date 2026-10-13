// POST /api/match { jobTitleIds } — saves what a visitor needs, as job titles, and returns its code.
// GET  /api/match?code=ABCDE-FGHJK — returns the saved titles with today's match count beside the count when saved.
// A saved match holds the code, the job titles and the count; never a name, contact detail or IP address.
import { randomInt } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const ALPHA = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';

function makeCode() {
  let s = '';
  for (let i = 0; i < 10; i++) s += ALPHA[randomInt(ALPHA.length)];
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

// Accepts any spacing, dashes or case; returns ABCDE-FGHJK or null.
function normalizeCode(raw) {
  const v = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (v.length !== 10 || [...v].some((ch) => !ALPHA.includes(ch))) return null;
  return `${v.slice(0, 5)}-${v.slice(5)}`;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'Saving is unavailable: DATABASE_URL is not set on this deployment.' });
  }
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'POST') {
    const asked = (Array.isArray(readBody(req).jobTitleIds) ? readBody(req).jobTitleIds : [])
      .map((x) => String(x).slice(0, 64)).filter(Boolean).slice(0, 60);
    if (!asked.length) return res.status(400).json({ error: 'Pick what you need before saving.' });
    try {
      // Keep only titles that are in the list, in the order they were sent.
      const known = new Set((await sql`SELECT job_title_id FROM directory_public_skill_counts WHERE job_title_id = ANY (${asked}::text[])`).map((r) => r.job_title_id));
      const ids = [...new Set(asked.filter((id) => known.has(id)))];
      if (!ids.length) return res.status(400).json({ error: 'None of those needs are in the list. Pick again and save.' });
      const count = (await sql`SELECT directory_public_match_count(${ids}::text[]) AS n`)[0]?.n ?? null;
      // A code collision is very unlikely; try a few times rather than fail.
      for (let attempt = 0; attempt < 4; attempt++) {
        const code = makeCode();
        const saved = await sql`INSERT INTO directory_landing_match_codes (code, job_title_id, job_title_ids, people_at_save)
                                VALUES (${code}, ${ids[0]}, ${ids}::text[], ${count})
                                ON CONFLICT (code) DO NOTHING RETURNING code`;
        if (saved.length) return res.status(201).json({ code, people: count });
      }
      return res.status(500).json({ error: 'Could not make a new code. Try saving again.' });
    } catch (err) {
      console.error('match: saving failed:', err?.message);
      return res.status(502).json({ error: 'The match could not be saved. Try again in a minute.' });
    }
  }

  if (req.method === 'GET') {
    const code = normalizeCode(req.query?.code);
    if (!code) return res.status(400).json({ error: 'A code is 10 letters and numbers, like ABCDE-FGHJK.' });
    try {
      const rows = await sql`SELECT COALESCE(job_title_ids, ARRAY[job_title_id]) AS ids, people_at_save, created_at
                               FROM directory_landing_match_codes WHERE code = ${code}`;
      if (!rows.length) return res.status(404).json({ error: 'No saved match has that code. Check the letters, or save a new match.' });
      const r = rows[0];
      const [now] = await Promise.all([
        sql`SELECT directory_public_match_count(${r.ids}::text[]) AS n`,
        sql`UPDATE directory_landing_match_codes SET last_seen_at = NOW() WHERE code = ${code}`,
      ]);
      return res.status(200).json({
        code, jobTitleIds: r.ids, people: now[0]?.n ?? null, peopleAtSave: r.people_at_save, savedAt: r.created_at,
      });
    } catch (err) {
      console.error('match: lookup failed:', err?.message);
      return res.status(502).json({ error: 'The saved match could not be read. Try again in a minute.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Only GET and POST are allowed on /api/match.' });
}
