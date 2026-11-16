// Cloudflare Pages Function: Public Articles API
// GET /api/public/articles?lang=lv|ru|en

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const lang = (url.searchParams.get('lang') || 'lv').toLowerCase();
  const slug = url.searchParams.get('slug');

  if (!env.DB) {
    return new Response(JSON.stringify({ status: 'offline', articles: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let query = `
      SELECT 
        a.id,
        a.slug,
        a.image,
        a.published_at,
        COALESCE(at.title, a.id) as title,
        COALESCE(at.summary, '') as summary,
        COALESCE(at.content, '') as content,
        COALESCE(at.meta_title, at.title) as meta_title,
        COALESCE(at.meta_description, at.summary) as meta_description
      FROM articles a
      LEFT JOIN article_translations at ON a.id = at.article_id AND at.lang = ?
      WHERE a.is_published = 1
    `;

    const params: any[] = [lang];

    if (slug) {
      query += ` AND a.slug = ?`;
      params.push(slug);
    }

    query += ` ORDER BY a.published_at DESC`;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      status: 'ok',
      lang,
      articles: results || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120, s-maxage=600'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', message: error?.message, articles: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
