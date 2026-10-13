// POST /api/count { all: [jobTitleId…], groups: { key: [jobTitleId…] } }
// How many people match a visitor: once for everything they picked, and once per need.
// directory_public_match_count counts each person once, rounds down to a multiple of 5 and
// returns NULL under 5, so a small group never leaves the database.
import { neon } from '@neondatabase/serverless';

const MAX_GROUPS = 30;
const MAX_IDS = 60;

const cleanIds = (v) => (Array.isArray(v) ? v : []).map((x) => String(x).slice(0, 64)).filter(Boolean).slice(0, MAX_IDS);

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST is allowed on /api/count.' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'Counting is unavailable: DATABASE_URL is not set on this deployment.' });
  }
  const body = readBody(req);
  const all = cleanIds(body.all);
  const groups = Object.entries(body.groups && typeof body.groups === 'object' ? body.groups : {})
    .slice(0, MAX_GROUPS)
    .map(([key, ids]) => [String(key).slice(0, 120), cleanIds(ids)]);
  if (!all.length) return res.status(400).json({ error: 'Pick at least one thing you need.' });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const [total, ...each] = await Promise.all([
      sql`SELECT directory_public_match_count(${all}::text[]) AS n`,
      ...groups.map(([, ids]) => sql`SELECT directory_public_match_count(${ids}::text[]) AS n`),
    ]);
    return res.status(200).json({
      total: total[0]?.n ?? null,
      groups: Object.fromEntries(groups.map(([key], i) => [key, each[i][0]?.n ?? null])),
    });
  } catch (err) {
    console.error('count: directory_public_match_count failed:', err?.message);
    return res.status(502).json({ error: 'The count could not be read from the database.' });
  }
}
