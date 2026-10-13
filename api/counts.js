// GET /api/counts — live Directory counts per job title, for the match page.
// Reads only the two public views; any count under 5 is already blank in the database.
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Only GET is allowed on /api/counts.' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'Counts are unavailable: DATABASE_URL is not set on this deployment.' });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const [titles, totals] = await Promise.all([
      sql`SELECT job_title_id, sector, title, people
            FROM directory_public_skill_counts
           ORDER BY sector_order, sector, title_order, title`,
      sql`SELECT total FROM directory_public_totals`,
    ]);
    // Counts change a few times a day, so a five-minute copy at the edge is plenty.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({
      total: totals[0]?.total ?? 0,
      titles: titles.map((r) => ({ id: r.job_title_id, sector: r.sector, title: r.title, people: r.people })),
    });
  } catch (err) {
    console.error('counts: reading directory_public_skill_counts failed:', err?.message);
    return res.status(502).json({ error: 'Counts could not be read from the database.', code: err?.code || null });
  }
}
