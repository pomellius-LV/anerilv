// Cloudflare Pages Function: Protected Admin Services API (v1.16)
// GET, POST, PUT, DELETE /api/admin/services
// Supports inline WYSIWYG editing of names (LV/RU/EN), prices, visibility, creation, and deletion in D1.

interface Env {
  DB?: any;
}

const SECTION_ORDER_SQL = `
  CASE s.category_id
    WHEN 'hair' THEN 1
    WHEN 'nails' THEN 2
    WHEN 'cosmetology' THEN 3
    WHEN 'permanent' THEN 4
    WHEN 'waxing' THEN 5
    WHEN 'solarium' THEN 6
    ELSE 99
  END
`;

const SELECT_ADMIN_SERVICE_SQL = `
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
`;

const CYRILLIC_TO_LATIN: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'jo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
  'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'ju', 'я': 'ja'
};

function slugifyText(input: string): string {
  const lower = input.toLowerCase().trim()
    .replace(/[āá]/g, 'a')
    .replace(/[ēé]/g, 'e')
    .replace(/[īí]/g, 'i')
    .replace(/[ūú]/g, 'u')
    .replace(/[č]/g, 'c')
    .replace(/[ģ]/g, 'g')
    .replace(/[ķ]/g, 'k')
    .replace(/[ļ]/g, 'l')
    .replace(/[ņ]/g, 'n')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z');

  let transliterated = '';
  for (const ch of lower) {
    transliterated += CYRILLIC_TO_LATIN[ch] !== undefined ? CYRILLIC_TO_LATIN[ch] : ch;
  }

  return transliterated
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);
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
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const { results } = await env.DB.prepare(`
      ${SELECT_ADMIN_SERVICE_SQL}
      GROUP BY s.id
      ORDER BY ${SECTION_ORDER_SQL}, s.order_num ASC
    `).all();

    return new Response(JSON.stringify({
      status: 'ok',
      ok: true,
      count: results?.length || 0,
      services: results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ status: 'error', ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env; data?: Record<string, any> }) => {
  const { request, env, data } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'Cloudflare D1 datubāze nav piesaistīta serverim.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
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
      subcategory_lv,
      subcategory_ru,
      subcategory_en
    } = body;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Pakalpojuma unikālais ID ir obligāts un nevar būt tukšs.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const cleanId = id.trim();

    if (price !== undefined && (price === null || String(price).trim() === '')) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Cenas lauks nevar būt tukšs.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // 1. Verify existence of the service in D1
    const existing = await env.DB.prepare(
      'SELECT id, category_id, subcategory_title, price, is_active FROM services WHERE id = ?'
    ).bind(cleanId).first();

    if (!existing) {
      return new Response(JSON.stringify({
        ok: false,
        error: `Pakalpojums ar ID "${cleanId}" netika atrasts D1 datubāzē.`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const nextPrice = price !== undefined ? String(price).trim() : existing.price;

    // 2. Update services table
    await env.DB.prepare(`
      UPDATE services 
      SET 
        price = ?,
        old_price = COALESCE(?, old_price),
        duration = COALESCE(?, duration),
        order_num = COALESCE(?, order_num),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      nextPrice,
      old_price !== undefined ? old_price : null,
      duration !== undefined ? duration : null,
      order_num !== undefined ? order_num : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      cleanId
    ).run();

    // 3. Upsert translations safely WITHOUT clobbering existing localized subcategory names
    const upsertLang = async (lang: 'lv' | 'ru' | 'en', rawName: unknown, rawSub: unknown) => {
      const cleanName = typeof rawName === 'string' ? rawName.trim() : '';
      const cleanSub = typeof rawSub === 'string' && rawSub.trim() !== '' ? rawSub.trim() : null;
      if (!cleanName && !cleanSub) return;

      if (cleanName) {
        const insertSub = cleanSub || existing.subcategory_title || '';
        await env.DB.prepare(`
          INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(service_id, lang) DO UPDATE SET
            name = excluded.name,
            subcategory_title_localized = COALESCE(?, service_translations.subcategory_title_localized)
        `).bind(cleanId, lang, cleanName, insertSub, cleanSub).run();
      } else if (cleanSub) {
        await env.DB.prepare(`
          UPDATE service_translations
          SET subcategory_title_localized = ?
          WHERE service_id = ? AND lang = ?
        `).bind(cleanSub, cleanId, lang).run();
      }
    };

    await upsertLang('lv', name_lv, subcategory_lv);
    await upsertLang('ru', name_ru, subcategory_ru);
    await upsertLang('en', name_en, subcategory_en);

    // 4. Write audit log (non-blocking)
    const userEmail = data?.adminEmail || 'pomellius@gmail.com';
    try {
      const actionType = nextPrice !== existing.price ? 'UPDATE_PRICE' : 'UPDATE_SERVICE';
      const oldSnapshot = JSON.stringify({ price: existing.price, is_active: existing.is_active });
      const newSnapshot = JSON.stringify({
        price: nextPrice,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
        name_lv: name_lv || undefined,
        name_ru: name_ru || undefined,
        name_en: name_en || undefined
      });

      await env.DB.prepare(`
        INSERT INTO audit_logs (user_email, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, ?, 'service', ?, ?, ?)
      `).bind(userEmail, actionType, cleanId, oldSnapshot, newSnapshot).run();
    } catch {
      // Non-blocking audit log
    }

    const refreshed = await env.DB.prepare(`
      ${SELECT_ADMIN_SERVICE_SQL}
      WHERE s.id = ?
      GROUP BY s.id
    `).bind(cleanId).first();

    return new Response(JSON.stringify({
      ok: true,
      id: cleanId,
      price: nextPrice,
      old_price: existing.price,
      service: refreshed || null,
      message: 'Izmaiņas veiksmīgi saglabātas Cloudflare D1 datubāzē.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env; data?: Record<string, any> }) => {
  const { request, env, data } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'Cloudflare D1 datubāze nav piesaistīta serverim.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const body: any = await request.json();
    const {
      id,
      category_id,
      subcategory_title,
      subcategory_lv,
      subcategory_ru,
      subcategory_en,
      order_num,
      price,
      old_price,
      duration,
      name_lv,
      name_ru,
      name_en
    } = body;

    const cleanCategory = typeof category_id === 'string' ? category_id.trim() : '';
    const cleanSubcategory = typeof subcategory_title === 'string' ? subcategory_title.trim() : '';
    const cleanPrice = price !== undefined && price !== null ? String(price).trim() : '';

    const cleanLv = typeof name_lv === 'string' ? name_lv.trim() : '';
    const cleanRu = typeof name_ru === 'string' ? name_ru.trim() : '';
    const cleanEn = typeof name_en === 'string' ? name_en.trim() : '';
    const primaryName = cleanLv || cleanRu || cleanEn;

    if (!cleanCategory) {
      return new Response(JSON.stringify({ ok: false, error: 'Kategorijas ID (category_id) ir obligāts.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    if (!primaryName) {
      return new Response(JSON.stringify({ ok: false, error: 'Pakalpojuma nosaukums ir obligāts.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    if (!cleanPrice) {
      return new Response(JSON.stringify({ ok: false, error: 'Cenas lauks ir obligāts.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // Generate clean unique deterministic ID
    let candidateId = typeof id === 'string' && id.trim()
      ? id.trim()
      : `${cleanCategory}_${slugifyText(cleanSubcategory || 'item')}_${slugifyText(cleanLv || cleanEn || cleanRu) || Date.now().toString(36)}`;

    const duplicate = await env.DB.prepare('SELECT id FROM services WHERE id = ?').bind(candidateId).first();
    if (duplicate) {
      candidateId = `${candidateId}_${Date.now().toString(36)}`;
    }

    // Compute clean order_num at end of category
    let finalOrder = typeof order_num === 'number' && Number.isFinite(order_num) ? order_num : null;
    if (finalOrder === null) {
      const maxRow = await env.DB.prepare(
        'SELECT COALESCE(MAX(order_num), 0) as max_order FROM services WHERE category_id = ?'
      ).bind(cleanCategory).first();
      finalOrder = Number(maxRow?.max_order || 0) + 1;
    }

    // Inherit localized subcategory names from sibling rows if omitted
    const resolveSubLoc = async (lang: 'lv' | 'ru' | 'en', explicit?: string): Promise<string> => {
      if (typeof explicit === 'string' && explicit.trim() !== '') return explicit.trim();
      if (cleanSubcategory) {
        const sibling = await env.DB.prepare(`
          SELECT st.subcategory_title_localized as sub_loc
          FROM services s
          JOIN service_translations st ON s.id = st.service_id
          WHERE s.category_id = ? AND s.subcategory_title = ? AND st.lang = ? AND st.subcategory_title_localized != ''
          LIMIT 1
        `).bind(cleanCategory, cleanSubcategory, lang).first();
        if (sibling?.sub_loc) return sibling.sub_loc;
      }
      return cleanSubcategory;
    };

    const subLocLv = await resolveSubLoc('lv', subcategory_lv);
    const subLocRu = await resolveSubLoc('ru', subcategory_ru);
    const subLocEn = await resolveSubLoc('en', subcategory_en);

    await env.DB.prepare(`
      INSERT INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(candidateId, cleanCategory, cleanSubcategory, finalOrder, cleanPrice, old_price || null, duration || null).run();

    await env.DB.prepare(
      'INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, ?, ?, ?)'
    ).bind(candidateId, 'lv', cleanLv || primaryName, subLocLv).run();

    await env.DB.prepare(
      'INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, ?, ?, ?)'
    ).bind(candidateId, 'ru', cleanRu || primaryName, subLocRu).run();

    await env.DB.prepare(
      'INSERT INTO service_translations (service_id, lang, name, subcategory_title_localized) VALUES (?, ?, ?, ?)'
    ).bind(candidateId, 'en', cleanEn || primaryName, subLocEn).run();

    // Audit log
    const userEmail = data?.adminEmail || 'pomellius@gmail.com';
    try {
      await env.DB.prepare(`
        INSERT INTO audit_logs (user_email, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, 'CREATE_SERVICE', 'service', ?, '', ?)
      `).bind(userEmail, candidateId, JSON.stringify({ category_id: cleanCategory, subcategory_title: cleanSubcategory, price: cleanPrice, name: primaryName })).run();
    } catch {
      // Non-blocking
    }

    const created = await env.DB.prepare(`
      ${SELECT_ADMIN_SERVICE_SQL}
      WHERE s.id = ?
      GROUP BY s.id
    `).bind(candidateId).first();

    return new Response(JSON.stringify({
      ok: true,
      id: candidateId,
      service: created || null,
      message: 'Jauns pakalpojums pievienots D1 datubāzei.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env; data?: Record<string, any> }) => {
  const { request, env, data } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!env.DB || !id || id.trim() === '') {
    return new Response(JSON.stringify({ ok: false, error: 'Trūkst pakalpojuma ID vai D1 savienojuma.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const cleanId = id.trim();

  try {
    const existing = await env.DB.prepare('SELECT id, category_id, price FROM services WHERE id = ?').bind(cleanId).first();
    if (!existing) {
      return new Response(JSON.stringify({ ok: false, error: 'Pakalpojums nav atrasts D1 datubāzē.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    await env.DB.prepare('DELETE FROM service_translations WHERE service_id = ?').bind(cleanId).run();
    await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(cleanId).run();

    const userEmail = data?.adminEmail || 'pomellius@gmail.com';
    try {
      await env.DB.prepare(`
        INSERT INTO audit_logs (user_email, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, 'DELETE_SERVICE', 'service', ?, ?, '')
      `).bind(userEmail, cleanId, JSON.stringify(existing)).run();
    } catch {
      // Non-blocking
    }

    return new Response(JSON.stringify({
      ok: true,
      deleted: cleanId,
      message: 'Pakalpojums dzēsts no Cloudflare D1 datubāzes.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
