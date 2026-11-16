// Cloudflare Pages Function: Public Services API
// GET /api/public/services?lang=lv|ru|en

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const lang = (url.searchParams.get('lang') || 'lv').toLowerCase();

  // If DB is not bound in Cloudflare yet, inform client gracefully
  if (!env.DB) {
    return new Response(JSON.stringify({
      status: 'offline',
      message: 'Cloudflare D1 binding DB is not attached. Falling back to bundled catalog.',
      services: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  }

  try {
    // Parameterized query joining services with translations
    const query = `
      SELECT 
        s.id,
        s.category_id,
        s.subcategory_title,
        s.order_num,
        s.price,
        s.old_price,
        s.duration,
        s.image,
        COALESCE(st.name, s.id) as name,
        COALESCE(st.subcategory_title_localized, s.subcategory_title) as subcategory_localized,
        COALESCE(st.description, '') as description
      FROM services s
      LEFT JOIN service_translations st ON s.id = st.service_id AND st.lang = ?
      WHERE s.is_active = 1
      ORDER BY s.category_id, s.order_num ASC
    `;

    const { results } = await env.DB.prepare(query).bind(lang).all();

    return new Response(JSON.stringify({
      status: 'ok',
      lang,
      count: results ? results.length : 0,
      services: results || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error?.message || 'Database query failed',
      services: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
