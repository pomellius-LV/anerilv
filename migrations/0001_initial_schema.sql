-- ====================================================================
-- SALONS ANERI: CLOUDFLARE D1 DATABASE SCHEMA
-- Migration: 0001_initial_schema.sql
-- Description: Core tables for Categories, Services, Articles, Settings, and Translations (LV, RU, EN)
-- Version: 1.0.0 (Backwards-compatible, parameterized)
-- ====================================================================

-- 0. MIGRATIONS TRACKING TABLE
CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO schema_migrations (name) VALUES ('0001_initial_schema.sql');

-- 1. CATEGORIES (Parent sections like hair, nails, cosmetology, permanent, waxing, solarium)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,                       -- e.g. 'hair', 'nails', 'cosmetology', 'permanent', 'waxing', 'solarium'
    order_num INTEGER NOT NULL DEFAULT 0,      -- sorting order
    is_active INTEGER NOT NULL DEFAULT 1,      -- 1 = active, 0 = hidden
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORY TRANSLATIONS (Multilingual titles & descriptions for LV, RU, EN)
CREATE TABLE IF NOT EXISTS category_translations (
    category_id TEXT NOT NULL,
    lang TEXT NOT NULL CHECK(lang IN ('lv', 'ru', 'en')),
    title TEXT NOT NULL,                       -- e.g. "Frizētavas pakalpojumi" / "Парикмахерский зал"
    description TEXT DEFAULT '',
    PRIMARY KEY (category_id, lang),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. SERVICES (Individual beauty services)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,                       -- Unique identifier e.g. 'hair_women_cut_short'
    category_id TEXT NOT NULL,                 -- Foreign key to categories(id)
    subcategory_title TEXT NOT NULL DEFAULT '',-- e.g. 'Dāmām', 'Kungiem', 'Bērniem', 'Aparātu manikīrs'
    order_num INTEGER NOT NULL DEFAULT 0,      -- sorting order within category
    price TEXT NOT NULL,                       -- e.g. 'no 22.00 €', '22.00 - 40.00 €'
    old_price TEXT DEFAULT NULL,               -- promotional/discount price, e.g. '30.00 €'
    duration TEXT DEFAULT NULL,                -- procedure duration e.g. '45 min', '1.5 - 2 h'
    is_active INTEGER NOT NULL DEFAULT 1,      -- 1 = visible to public, 0 = inactive
    image TEXT DEFAULT NULL,                   -- optional image path or R2 URL
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. SERVICE TRANSLATIONS (Multilingual names & descriptions)
CREATE TABLE IF NOT EXISTS service_translations (
    service_id TEXT NOT NULL,
    lang TEXT NOT NULL CHECK(lang IN ('lv', 'ru', 'en')),
    name TEXT NOT NULL,                        -- e.g. "Matu griezums (īsiem matiem)" / "Стрижка (короткие волосы)"
    subcategory_title_localized TEXT DEFAULT '',
    description TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    PRIMARY KEY (service_id, lang),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- 5. ARTICLES / BLOG (SEO publications & care guides)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,                       -- e.g. 'beauty-salon-kengarags', 'haircare', 'keratin-vs-botox'
    slug TEXT UNIQUE NOT NULL,                 -- URL slug matching id
    image TEXT DEFAULT NULL,                   -- featured image path
    is_published INTEGER NOT NULL DEFAULT 1,   -- 1 = published, 0 = draft
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. ARTICLE TRANSLATIONS (Full markdown content & SEO meta)
CREATE TABLE IF NOT EXISTS article_translations (
    article_id TEXT NOT NULL,
    lang TEXT NOT NULL CHECK(lang IN ('lv', 'ru', 'en')),
    title TEXT NOT NULL,
    summary TEXT DEFAULT '',
    content TEXT NOT NULL,                     -- Markdown text with rich headings & bold formatting
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    related_service_id TEXT DEFAULT NULL,
    related_service_text TEXT DEFAULT NULL,
    PRIMARY KEY (article_id, lang),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 7. SITE SETTINGS & METADATA (Key-value store for contact info, working hours, notices)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,                      -- e.g. 'phone', 'address', 'hours_weekday', 'hours_sunday', 'instagram_url'
    value TEXT NOT NULL,                       -- Setting string value or JSON
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUTHORIZED ADMIN USERS (Cloudflare Access / Google Auth email list)
CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,                    -- e.g. 'pomellius@gmail.com'
    role TEXT NOT NULL DEFAULT 'admin',        -- 'owner', 'admin', 'manager'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT LOG (Tracks price changes and edits for safe rollback)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    action TEXT NOT NULL,                      -- 'UPDATE_PRICE', 'CREATE_SERVICE', 'UPDATE_SETTINGS'
    entity_type TEXT NOT NULL,                 -- 'service', 'article', 'setting'
    entity_id TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST PUBLIC QUERIES
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id, is_active, order_num);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
