// Cloudflare Pages Function: Public Site Settings API
// GET /api/public/settings

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ status: 'offline', settings: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const { results } = await env.DB.prepare('SELECT key, value FROM site_settings').all();
    const settings: Record<string, string> = {};
    if (results && Array.isArray(results)) {
      results.forEach((row: any) => {
        settings[row.key] = row.value;
      });
    }

    return new Response(JSON.stringify({
      status: 'ok',
      settings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', message: error?.message, settings: {} }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
