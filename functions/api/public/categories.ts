// Cloudflare Pages Function: Public Categories API
// GET /api/public/categories?lang=lv|ru|en

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const lang = (url.searchParams.get('lang') || 'lv').toLowerCase();

  if (!env.DB) {
    return new Response(JSON.stringify({ status: 'offline', categories: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const query = `
      SELECT 
        c.id,
        c.order_num,
        COALESCE(ct.title, c.id) as title,
        COALESCE(ct.description, '') as description
      FROM categories c
      LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.lang = ?
      WHERE c.is_active = 1
      ORDER BY c.order_num ASC
    `;

    const { results } = await env.DB.prepare(query).bind(lang).all();

    return new Response(JSON.stringify({
      status: 'ok',
      lang,
      categories: results || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=120, s-maxage=600'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', message: error?.message, categories: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
