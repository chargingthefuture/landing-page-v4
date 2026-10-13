// POST /api/unmet { needs: [{ need, jobTitleIds }] } — records needs that matched nobody, as in-demand
// needs for the owner to fill. The page sends each need at most once per visit. Nothing about the
// visitor is stored; the landing_page login may only add rows to directory_unmet_needs.
import { neon } from '@neondatabase/serverless';

const MAX_NEEDS = 30;
const MAX_IDS = 60;

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST is allowed on /api/unmet.' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'Recording is unavailable: DATABASE_URL is not set on this deployment.' });
  }
  const needs = (Array.isArray(readBody(req).needs) ? readBody(req).needs : [])
    .slice(0, MAX_NEEDS)
    .map((n) => ({
      need: String(n?.need || '').slice(0, 160),
      ids: (Array.isArray(n?.jobTitleIds) ? n.jobTitleIds : []).map((x) => String(x).slice(0, 64)).filter(Boolean).slice(0, MAX_IDS),
    }))
    .filter((n) => n.need);
  if (!needs.length) return res.status(400).json({ error: 'No need to record.' });
  try {
    const sql = neon(process.env.DATABASE_URL);
    // Only record a need that really matches nobody right now, so a stale page cannot add noise.
    const recorded = [];
    for (const n of needs) {
      const [{ c }] = await sql`SELECT directory_public_match_count(${n.ids}::text[]) AS c`;
      if (c === 0) {
        await sql`INSERT INTO directory_unmet_needs (need, job_title_ids) VALUES (${n.need}, ${n.ids}::text[])`;
        recorded.push(n.need);
      }
    }
    return res.status(201).json({ recorded });
  } catch (err) {
    console.error('unmet: recording failed:', err?.message);
    return res.status(502).json({ error: 'The need could not be recorded.', code: err?.code || null });
  }
}
