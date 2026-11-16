// Cloudflare Pages Function: Protected Admin Dashboard Stats API
// GET /api/admin/stats

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({
      status: 'offline',
      database: 'Not Connected (Check Cloudflare Pages D1 binding DB)',
      totalServices: 0,
      activeServices: 0,
      totalArticles: 0,
      recentPriceChanges: []
    }), { status: 200 });
  }

  try {
    const totalServicesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM services').first();
    const activeServicesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM services WHERE is_active = 1').first();
    const totalArticlesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM articles').first();
    const { results: recentLogs } = await env.DB.prepare(`
      SELECT user_email, action, entity_id, old_value, new_value, timestamp 
      FROM audit_logs 
      ORDER BY timestamp DESC 
      LIMIT 10
    `).all();

    return new Response(JSON.stringify({
      status: 'online',
      database: 'Connected to Cloudflare D1',
      totalServices: totalServicesRow ? totalServicesRow.count : 0,
      activeServices: activeServicesRow ? activeServicesRow.count : 0,
      totalArticles: totalArticlesRow ? totalArticlesRow.count : 0,
      recentPriceChanges: recentLogs || []
    }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({
      status: 'error',
      database: 'Error querying D1: ' + e.message,
      totalServices: 0,
      activeServices: 0,
      totalArticles: 0,
      recentPriceChanges: []
    }), { status: 200 });
  }
};
