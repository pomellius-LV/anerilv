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

    // Enabled by default on initial rollout until explicitly configured in /admin
    if (settings.season_mode === undefined) settings.season_mode = 'auto';
    if (settings.snow_enabled === undefined) settings.snow_enabled = '1';
    if (settings.snow_size === undefined) settings.snow_size = '34';
    if (settings.snow_color === undefined) settings.snow_color = '#FFFFFF';
    if (settings.snow_count === undefined) settings.snow_count = '55';

    return new Response(JSON.stringify({
      status: 'ok',
      settings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=15, must-revalidate'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', message: error?.message, settings: {} }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
