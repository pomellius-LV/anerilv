// Cloudflare Pages Function: Protected Admin Site Settings API
// GET, PUT /api/admin/settings

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ status: 'offline', settings: {} }), { status: 200 });
  }

  try {
    const { results } = await env.DB.prepare('SELECT key, value, updated_at FROM site_settings').all();
    const settings: Record<string, string> = {};
    if (results && Array.isArray(results)) {
      results.forEach((row: any) => {
        settings[row.key] = row.value;
      });
    }
    return new Response(JSON.stringify({ status: 'ok', settings }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response(JSON.stringify({ status: 'offline' }), { status: 500 });

  try {
    const body: Record<string, string> = await request.json();

    for (const [key, val] of Object.entries(body)) {
      await env.DB.prepare(`
        INSERT INTO site_settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).bind(key, String(val)).run();
    }

    return new Response(JSON.stringify({ ok: true, updatedKeys: Object.keys(body) }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
