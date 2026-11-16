// Cloudflare Pages Function: Protected Admin Services API
// GET, POST, PUT, DELETE /api/admin/services
// Enforces real D1 unique service IDs and strict existence verification

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({
      status: 'offline',
      ok: false,
      message: 'Cloudflare D1 binding "DB" is not attached. Please attach D1 database in Cloudflare Pages dashboard.',
      services: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        s.id,
        s.category_id,
        s.subcategory_title,
        s.order_num,
        s.price,
        s.old_price,
        s.duration,
        s.is_active,
        s.image,
        s.updated_at,
        MAX(CASE WHEN st.lang = 'lv' THEN st.name END) as name_lv,
        MAX(CASE WHEN st.lang = 'ru' THEN st.name END) as name_ru,
        MAX(CASE WHEN st.lang = 'en' THEN st.name END) as name_en,
        MAX(CASE WHEN st.lang = 'lv' THEN st.subcategory_title_localized END) as subcategory_lv,
        MAX(CASE WHEN st.lang = 'ru' THEN st.subcategory_title_localized END) as subcategory_ru,
        MAX(CASE WHEN st.lang = 'en' THEN st.subcategory_title_localized END) as subcategory_en
      FROM services s
      LEFT JOIN service_translations st ON s.id = st.service_id
      GROUP BY s.id
      ORDER BY s.category_id, s.order_num ASC
    `).all();

    return new Response(JSON.stringify({
      status: 'ok',
      ok: true,
      count: results?.length || 0,
      services: results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ status: 'error', ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'Cloudflare D1 datubāze nav piesaistīta serverim.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: any = await request.json();
    const {
      id,
      price,
      old_price,
      duration,
      order_num,
      is_active,
      name_lv,
      name_ru,
      name_en,
      subcategory_title
    } = body;

    // Strict validation of real ID and price
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Pakalpojuma unikālais ID ir obligāts un nevar būt tukšs.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (price === undefined || price === null || String(price).trim() === '') {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Cenas lauks ir obligāts.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Verify existence of the service in D1
    const existing = await env.DB.prepare('SELECT id, price, is_active FROM services WHERE id = ?').bind(id.trim()).first();
    if (!existing) {
      return new Response(JSON.stringify({
        ok: false,
        error: `Pakalpojums ar ID "${id}" netika atrasts D1 datubāzē.`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Perform UPDATE on services table
    const updateRes = await env.DB.prepare(`
      UPDATE services 
      SET 
        price = ?,
        old_price = ?,
        duration = COALESCE(?, duration),
        order_num = COALESCE(?, order_num),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      String(price).trim(),
      old_price !== undefined ? old_price : null,
      duration !== undefined ? duration : null,
      order_num !== undefined ? order_num : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id.trim()
    ).run();

    const changes = updateRes?.meta?.changes ?? updateRes?.changes ?? 0;
    if (changes === 0 && String(price).trim() === existing.price) {
      // Price was identical, but let's confirm row is intact
    } else if (changes === 0) {
      return new Response(JSON.stringify({
        ok: false,
        error: `D1 datubāze neatjaunināja ierakstu ar ID "${id}" (0 izmaiņu).`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Update translations if provided
    if (name_lv) {
      await env.DB.prepare(`
        INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized)
        VALUES (?, 'lv', ?, ?)
        ON CONFLICT(service_id, lang) DO UPDATE SET name = excluded.name, subcategory_title_localized = COALESCE(excluded.subcategory_title_localized, subcategory_title_localized)
      `).bind(id.trim(), name_lv, subcategory_title || '').run();
    }
    if (name_ru) {
      await env.DB.prepare(`
        INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized)
        VALUES (?, 'ru', ?, ?)
        ON CONFLICT(service_id, lang) DO UPDATE SET name = excluded.name, subcategory_title_localized = COALESCE(excluded.subcategory_title_localized, subcategory_title_localized)
      `).bind(id.trim(), name_ru, subcategory_title || '').run();
    }
    if (name_en) {
      await env.DB.prepare(`
        INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized)
        VALUES (?, 'en', ?, ?)
        ON CONFLICT(service_id, lang) DO UPDATE SET name = excluded.name, subcategory_title_localized = COALESCE(excluded.subcategory_title_localized, subcategory_title_localized)
      `).bind(id.trim(), name_en, subcategory_title || '').run();
    }

    // 4. Log in audit_logs using verified admin email from middleware
    const userEmail = (context as any).data?.adminEmail || 'pomellius@gmail.com';
    try {
      await env.DB.prepare(`
        INSERT INTO audit_logs (user_email, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, 'UPDATE_PRICE', 'service', ?, ?, ?)
      `).bind(
        userEmail,
        id.trim(),
        existing.price || '',
        String(price).trim()
      ).run();
    } catch {
      // Audit log non-blocking
    }

    return new Response(JSON.stringify({
      ok: true,
      id: id.trim(),
      price: String(price).trim(),
      old_price: existing.price,
      message: 'Cena veiksmīgi saglabāta Cloudflare D1 datubāzē.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'D1 not attached' }), { status: 503 });
  }

  try {
    const body: any = await request.json();
    const {
      id,
      category_id,
      subcategory_title,
      price,
      old_price,
      duration,
      name_lv,
      name_ru,
      name_en
    } = body;

    const realId = (id || `${category_id}_${Date.now()}`).trim();

    await env.DB.prepare(`
      INSERT INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active)
      VALUES (?, ?, ?, 99, ?, ?, ?, 1)
    `).bind(realId, category_id, subcategory_title || '', price, old_price || null, duration || null).run();

    if (name_lv) {
      await env.DB.prepare('INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, "lv", ?, ?)')
        .bind(realId, name_lv, subcategory_title || '').run();
    }
    if (name_ru) {
      await env.DB.prepare('INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, "ru", ?, ?)')
        .bind(realId, name_ru, subcategory_title || '').run();
    }
    if (name_en) {
      await env.DB.prepare('INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, "en", ?, ?)')
        .bind(realId, name_en, subcategory_title || '').run();
    }

    return new Response(JSON.stringify({ ok: true, id: realId, message: 'Pakalpojums izveidots D1.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!env.DB || !id) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing ID or database' }), { status: 400 });
  }

  try {
    const existing = await env.DB.prepare('SELECT id FROM services WHERE id = ?').bind(id.trim()).first();
    if (!existing) {
      return new Response(JSON.stringify({ ok: false, error: 'Pakalpojums nav atrasts D1.' }), { status: 404 });
    }

    await env.DB.prepare('DELETE FROM service_translations WHERE service_id = ?').bind(id.trim()).run();
    await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id.trim()).run();
    return new Response(JSON.stringify({ ok: true, deleted: id.trim() }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
};
