// Cloudflare Pages Function: Protected Admin Articles API
// GET, POST, PUT, DELETE /api/admin/articles

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ status: 'offline', articles: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        a.id,
        a.slug,
        a.image,
        a.is_published,
        a.published_at,
        a.updated_at,
        MAX(CASE WHEN at.lang = 'lv' THEN at.title END) as title_lv,
        MAX(CASE WHEN at.lang = 'ru' THEN at.title END) as title_ru,
        MAX(CASE WHEN at.lang = 'en' THEN at.title END) as title_en,
        MAX(CASE WHEN at.lang = 'lv' THEN at.meta_title END) as meta_title_lv,
        MAX(CASE WHEN at.lang = 'ru' THEN at.meta_title END) as meta_title_ru,
        MAX(CASE WHEN at.lang = 'en' THEN at.meta_title END) as meta_title_en,
        MAX(CASE WHEN at.lang = 'lv' THEN at.meta_description END) as meta_desc_lv,
        MAX(CASE WHEN at.lang = 'ru' THEN at.meta_description END) as meta_desc_ru,
        MAX(CASE WHEN at.lang = 'en' THEN at.meta_description END) as meta_desc_en
      FROM articles a
      LEFT JOIN article_translations at ON a.id = at.article_id
      GROUP BY a.id
      ORDER BY a.published_at DESC
    `).all();

    return new Response(JSON.stringify({ status: 'ok', articles: results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response(JSON.stringify({ status: 'offline' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

  try {
    const body: any = await request.json();
    const { id, is_published, title_lv, title_ru, title_en, meta_title_lv, meta_desc_lv } = body;

    if (!id) return new Response(JSON.stringify({ error: 'Missing article ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

    if (is_published !== undefined) {
      await env.DB.prepare('UPDATE articles SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(is_published ? 1 : 0, id).run();
    }

    if (title_lv) {
      await env.DB.prepare(`
        UPDATE article_translations 
        SET title = ?, meta_title = COALESCE(?, meta_title), meta_description = COALESCE(?, meta_description)
        WHERE article_id = ? AND lang = 'lv'
      `).bind(title_lv, meta_title_lv || null, meta_desc_lv || null, id).run();
    }

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
