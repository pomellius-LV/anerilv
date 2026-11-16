const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Load contentData
let rawContent = fs.readFileSync('data/content.ts', 'utf8');
rawContent = rawContent.replace(/import\s+.*?;/g, '');
rawContent = 'const getArticlesForLanguage = () => [];\n' + rawContent;
rawContent = rawContent.replace('export const contentData: Record<Language, Content> =', 'const contentData =');
rawContent = rawContent + '\nmodule.exports = { contentData };';

const tempContentPath = '/tmp/temp_content_for_seed.js';
fs.writeFileSync(tempContentPath, rawContent);
const { contentData } = require(tempContentPath);

// Helper for SQL escaping
function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// Slug generator
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
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
    .replace(/[ž]/g, 'z')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

// English translations dictionary for services not explicitly translated in en
const enFallbackMap = {
  // Hair
  'Matu griezums (īsiem matiem)': 'Haircut (short hair)',
  'Matu griezums (vidēji gariem)': 'Haircut (medium hair)',
  'Matu griezums (gariem matiem)': 'Haircut (long hair)',
  'Matu veidošana': 'Hair styling',
  'Griezums + Veidošana': 'Cut + Blow Dry & Styling',
  'Veidošana ar ruļļiem': 'Roller setting & styling',
  'Vakara frizūra': 'Evening hairstyle / Updo',
  'Krāsošana 1 tonī (darbs)': 'Single tone coloring (labor)',
  'Balināšana ar foliju (darbs)': 'Foil highlights (labor)',
  'Balināšana ar cepurīti (darbs)': 'Cap highlighting (labor)',
  'Kolorēšana': 'Coloring / Balayage',
  'Ķīmiskie ilgviļņi': 'Classic perm',
  'Bio-ilgviļņi': 'Bio-perm',
  'Matu mazgāšana un žāvēšana': 'Wash and blow-dry',
  'Ponija griezums': 'Bangs / Fringe trim',
  'Keratīna taisnošana \'GLOBAL\' (īsi)': 'Keratin straightening \'GLOBAL\' (short)',
  'Keratīna taisnošana \'GLOBAL\' (vidēji)': 'Keratin straightening \'GLOBAL\' (medium)',
  'Keratīna taisnošana \'GLOBAL\' (gari)': 'Keratin straightening \'GLOBAL\' (long)',
  'Vīriešu matu griezums (ar mazgāšanu)': 'Men\'s haircut (with wash)',
  'Matu griezums ar mašīnīti (1 uzgalis)': 'Clipper cut (single guard)',
  'Bārdas korekcija': 'Beard trim & shaping',
  'Bārdas korekcija ar mašīnīti': 'Clipper beard trim',
  'Pensionāru griezums (kungiem)': 'Senior haircut (gentlemen 65+)',
  'Pensionāru griezums (dāmām)': 'Senior haircut (ladies 65+)',
  'Pensionāru veidošana (dāmām)': 'Senior styling (ladies 65+)',
  'Pensionāru griezums + veidošana': 'Senior cut + styling (ladies 65+)',
  'Bērnu matu griezums (līdz 7 gadiem)': 'Kids haircut (up to 7 y.o.)',
  'Bērnu matu griezums (no 7 gadiem)': 'Junior haircut (7+ y.o.)',

  // Nails
  'Klasiskais manikīrs': 'Classic manicure',
  'Eiropas manikīrs': 'European manicure',
  'Aparātu manikīrs': 'Hardware manicure',
  'Kombinētais manikīrs': 'Combined manicure',
  'Manikīrs ar parasto laku': 'Manicure with regular polish',
  'Manikīrs ar Gelish pārklājumu': 'Manicure with Gelish gel polish',
  'Gelish noņemšana': 'Gelish removal',
  'Gelish noņemšana + manikīrs': 'Gelish removal + manicure',
  'Nagu lakošana': 'Nail polishing',
  'Franču dizains': 'French design',
  'Viena naga remonts': 'Single nail repair',
  'SPA manikīrs (ar parafīna vanniņu)': 'SPA manicure (with paraffin bath)',
  'Parafīna vanniņa rokām': 'Paraffin hand bath treatment',
  'Klasiskais pedikīrs': 'Classic pedicure',
  'Aparātu pedikīrs': 'Hardware pedicure',
  'Kombinētais pedikīrs': 'Combined pedicure',
  'Pedikīrs ar Gelish pārklājumu': 'Pedicure with Gelish gel polish',
  'Ekspress pedikīrs (tikai pirksti)': 'Express pedicure (toes only)',
  'Pēdu apstrāde': 'Foot & heel treatment',
  'SPA pedikīrs (ar masku un masāžu)': 'SPA pedicure (mask & massage)',
  'Parafīna vanniņa kājām': 'Paraffin foot bath',

  // Cosmetology
  'Klasiskā sejas tīrīšana': 'Classic facial cleansing',
  'Ultraskaņas sejas tīrīšana': 'Ultrasonic facial cleansing',
  'Kombinētā sejas tīrīšana': 'Combined deep facial cleansing',
  'Sejas masāža (klasiskā)': 'Facial massage (classic)',
  'Sejas masāža ar masku': 'Facial massage with nourishing mask',
  'Mitrinoša procedūra sejai': 'Intensive moisturizing facial',
  'Anti-age procedūra sejai': 'Anti-aging facial treatment',
  'Skropstu krāsošana': 'Eyelash tinting',
  'Uzacu korekcija un krāsošana': 'Eyebrow shaping and tinting',
  'Glikolskābes pīlings': 'Glycolic acid peel',
  'Mandeļu pīlings': 'Mandelic acid peel',
  'Salicilskābes pīlings': 'Salicylic acid peel',
  'PRX-T33 biorevitalizācijas pīlings': 'PRX-T33 biorevitalization peel',

  // Permanent
  'Uzacu pūdertehnika': 'Powder brows technique',
  'Uzacu mikrobleidings': 'Eyebrow microblading',
  'Acu līnija (klasiskā bultiņa)': 'Classic eyeliner',
  'Starpskropstu līnija': 'Lash line enhancement',
  'Lūpu kontūra ar tonēšanu': 'Lip contour with shading',
  'Lūpu akvareļtehnika': 'Watercolor full lip blush',

  // Waxing
  'Kājas visā garumā': 'Full legs waxing',
  'Kājas līdz ceļiem': 'Half legs waxing',
  'Bikini zona (klasiskais)': 'Classic bikini waxing',
  'Bikini zona (dziļais / franču)': 'Deep / French bikini waxing',
  'Paduses': 'Underarms waxing',
  'Rokas visā garumā': 'Full arms waxing',
  'Sejas zonas (ūsiņas, zods)': 'Facial zones (upper lip, chin)',

  // Solarium
  'Solārijs 1 minūte': 'Solarium 1 minute',
  'Solārijs 5 minūtes': 'Solarium 5 minutes',
  'Solārijs 10 minūtes': 'Solarium 10 minutes',
  'Solārijs 15 minūtes': 'Solarium 15 minutes',
  'Abonements 50 minūtes': 'Subscription 50 minutes',
  'Abonements 100 minūtes': 'Subscription 100 minutes',
  'Abonements 150 minūtes': 'Subscription 150 minutes'
};

const enCategoryTitleMap = {
  'Dāmām': 'Ladies',
  'Kungiem': 'Gentlemen',
  'Pensionāriem (no 65 gadiem)': 'Pensioners (65+)',
  'Bērniem': 'Kids',
  'Manikīrs': 'Manicure',
  'Pedikīrs': 'Pedicure',
  'Kosmētiskās procedūras': 'Cosmetic Procedures',
  'Pīlingi': 'Peels',
  'Procedūras': 'Procedures',
  'Zonas': 'Zones',
  'Apmeklējums / Abonements': 'Visit / Subscription'
};

// Build 0002_seed_full_catalog.sql
let seed002 = `-- ====================================================================
-- SALONS ANERI: CLOUDFLARE D1 FULL CATALOG SEED
-- Migration: 0002_seed_full_catalog.sql
-- Description: Complete 100% catalog seed of all 6 salon sections and 82 services with full LV, RU, EN translations
-- Safety: Uses INSERT OR IGNORE to prevent overwriting admin modifications
-- ====================================================================

-- 1. Ensure migrations table exists
CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Core Categories
INSERT OR IGNORE INTO categories (id, order_num, is_active) VALUES
('hair', 1, 1),
('nails', 2, 1),
('cosmetology', 3, 1),
('permanent', 4, 1),
('waxing', 5, 1),
('solarium', 6, 1);

-- 3. Category Translations
INSERT OR IGNORE INTO category_translations (category_id, lang, title, description) VALUES
('hair', 'lv', 'Frizētavas pakalpojumi', 'Griezumi, krāsošana un matu kopšana dāmām, kungiem un bērniem.'),
('hair', 'ru', 'Парикмахерский зал', 'Стрижки, окрашивание и уход за волосами для дам, мужчин и детей.'),
('hair', 'en', 'Hairdressing Services', 'Haircuts, coloring and haircare for ladies, gentlemen and children.'),
('nails', 'lv', 'Manikīrs un Pedikīrs', 'Klasiskais un aparātu manikīrs, pedikīrs, Gelish pārklājums.'),
('nails', 'ru', 'Маникюр и Педикюр', 'Классический и аппаратный маникюр, педикюр, покрытие Gelish.'),
('nails', 'en', 'Manicure & Pedicure', 'Classic and hardware manicure, pedicure, Gelish coating.'),
('cosmetology', 'lv', 'Kosmetoloģija un Pīlingi', 'Sejas tīrīšana, mezoterapija, krio procedūras un pīlingi.'),
('cosmetology', 'ru', 'Косметология и Пилинги', 'Чистка лица, мезотерапия, криопроцедуры и пилинги.'),
('cosmetology', 'en', 'Cosmetology & Peels', 'Facial cleansing, mesotherapy, cryotherapy and peels.'),
('permanent', 'lv', 'Permanentais grims', 'Ilgnoturīgs grims uzacīm, lūpām un acu līnijai.'),
('permanent', 'ru', 'Перманентный макияж', 'Долговременный макияж бровей, губ и стрелок.'),
('permanent', 'en', 'Permanent Makeup', 'Long-lasting makeup for eyebrows, lips and eyeliner.'),
('waxing', 'lv', 'Vaksācija', 'Gluda āda visām zonām: seja, rokas, kājas, bikini.'),
('waxing', 'ru', 'Депиляция воском', 'Гладкая кожа для всех зон: лицо, руки, ноги, бикини.'),
('waxing', 'en', 'Waxing Depilation', 'Smooth skin for all zones: face, arms, legs, bikini.'),
('solarium', 'lv', 'Solārijs', 'Profesionāls vertikālais solārijs skaistam iedegumam.'),
('solarium', 'ru', 'Солярий', 'Профессиональный вертикальный солярий для красивого загара.'),
('solarium', 'en', 'Solarium Tanning', 'Professional vertical solarium for a radiant, sun-kissed tan.');
\n`;

// 4. Iterate over services
const lvSections = contentData.lv.prices.sections;
const ruSections = contentData.ru.prices.sections;
const enSections = contentData.en.prices.sections;

let totalServiceCount = 0;
let serviceSql = '-- 4. Services Table\n';
let translationSql = '-- 5. Service Translations (LV, RU, EN)\n';

lvSections.forEach((lvSec, sIdx) => {
  const ruSec = ruSections[sIdx];
  const enSec = enSections.find(s => s.id === lvSec.id);
  
  let orderInCat = 1;

  lvSec.categories.forEach((lvCat, cIdx) => {
    const ruCat = ruSec?.categories[cIdx];
    const catSlug = slugify(lvCat.title);

    lvCat.services.forEach((lvSrv, srvIdx) => {
      totalServiceCount++;
      const ruSrv = ruCat?.services[srvIdx];
      
      // Look for EN service match in enSec
      let enSrv = null;
      let enCatTitle = enCategoryTitleMap[lvCat.title] || lvCat.title;
      if (enSec) {
        for (const cat of enSec.categories) {
          const match = cat.services.find(s => 
            s.name.toLowerCase().includes(lvSrv.name.toLowerCase().slice(0, 8)) ||
            (enFallbackMap[lvSrv.name] && s.name.toLowerCase() === enFallbackMap[lvSrv.name].toLowerCase())
          );
          if (match) {
            enSrv = match;
            enCatTitle = cat.title;
            break;
          }
        }
      }

      const enName = enSrv ? enSrv.name : (enFallbackMap[lvSrv.name] || lvSrv.name);
      const ruName = ruSrv ? ruSrv.name : lvSrv.name;
      const ruCatTitle = ruCat ? ruCat.title : lvCat.title;

      // Stable clean ID
      const srvSlug = slugify(lvSrv.name);
      const serviceId = `${lvSec.id}_${catSlug}_${srvSlug}`;

      serviceSql += `INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES (${esc(serviceId)}, ${esc(lvSec.id)}, ${esc(lvCat.title)}, ${orderInCat}, ${esc(lvSrv.price)}, NULL, NULL, 1);\n`;

      // Insert Translations
      translationSql += `INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES (${esc(serviceId)}, 'lv', ${esc(lvSrv.name)}, ${esc(lvCat.title)}, '');\n`;
      translationSql += `INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES (${esc(serviceId)}, 'ru', ${esc(ruName)}, ${esc(ruCatTitle)}, '');\n`;
      translationSql += `INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES (${esc(serviceId)}, 'en', ${esc(enName)}, ${esc(enCatTitle)}, '');\n`;

      orderInCat++;
    });
  });
});

seed002 += serviceSql + '\n' + translationSql + '\n';

// 6. Settings & Admin Users
seed002 += `-- 6. Default Site Settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
('phone', '+371 20 000 000'),
('address', 'Latgales iela 264, Rīga, Ķengarags (t/c Mego)'),
('hours_weekday', 'Pirmdiena - Sestdiena: 09:00 - 20:00'),
('hours_sunday', 'Svētdiena: 10:00 - 18:00'),
('instagram_url', 'https://instagram.com'),
('facebook_url', 'https://facebook.com');

-- 7. Authorized Cloudflare Access Administrator
INSERT OR IGNORE INTO admin_users (email, role) VALUES ('pomellius@gmail.com', 'owner');

-- 8. Record Migration
INSERT OR IGNORE INTO schema_migrations (name) VALUES ('0002_seed_full_catalog.sql');
`;

fs.writeFileSync('migrations/0002_seed_full_catalog.sql', seed002);
console.log(`Successfully generated migrations/0002_seed_full_catalog.sql with ${totalServiceCount} services and ${totalServiceCount * 3} translations!`);

// ====================================================================
// Build 0003_seed_all_articles.sql
// ====================================================================
let seed003 = `-- ====================================================================
-- SALONS ANERI: CLOUDFLARE D1 ALL ARTICLES SEED
-- Migration: 0003_seed_all_articles.sql
-- Description: Complete 11 articles with 33 translations (LV, RU, EN), full markdown content, meta tags and related services
-- Safety: Uses INSERT OR IGNORE to prevent overwriting existing content
-- ====================================================================

-- 1. Ensure migrations table exists
CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\n`;

const lvDir = 'data/articles/lv';
const articleFiles = fs.readdirSync(lvDir).filter(f => f.endsWith('.ts'));

function loadArticle(lang, fileName) {
  const filePath = path.join('data/articles', lang, fileName);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8')
    .replace(/import\s+.*?;/g, '')
    .replace('export const article: Article =', 'const article =') + '\nmodule.exports = { article };';
  const mod = { exports: {} };
  vm.runInNewContext(raw, { module: mod, exports: mod.exports, console });
  return mod.exports.article;
}

let articlesSql = '-- 2. Articles Registry\n';
let articleTransSql = '-- 3. Article Translations (LV, RU, EN)\n';

articleFiles.forEach(file => {
  const lvArt = loadArticle('lv', file);
  const ruArt = loadArticle('ru', file);
  const enArt = loadArticle('en', file);

  const articleId = lvArt.id;
  const slug = articleId;

  articlesSql += `INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES (${esc(articleId)}, ${esc(slug)}, NULL, 1);\n`;

  // LV translation
  articlesSql += ``; // no-op
  articleTransSql += `INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES (${esc(articleId)}, 'lv', ${esc(lvArt.title)}, ${esc(lvArt.metaDescription)}, ${esc(lvArt.content)}, ${esc(lvArt.metaTitle)}, ${esc(lvArt.metaDescription)}, ${esc(lvArt.relatedService?.id || null)}, ${esc(lvArt.relatedService?.text || null)});\n`;

  // RU translation
  if (ruArt) {
    articleTransSql += `INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES (${esc(articleId)}, 'ru', ${esc(ruArt.title)}, ${esc(ruArt.metaDescription)}, ${esc(ruArt.content)}, ${esc(ruArt.metaTitle)}, ${esc(ruArt.metaDescription)}, ${esc(ruArt.relatedService?.id || null)}, ${esc(ruArt.relatedService?.text || null)});\n`;
  }

  // EN translation
  if (enArt) {
    articleTransSql += `INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES (${esc(articleId)}, 'en', ${esc(enArt.title)}, ${esc(enArt.metaDescription)}, ${esc(enArt.content)}, ${esc(enArt.metaTitle)}, ${esc(enArt.metaDescription)}, ${esc(enArt.relatedService?.id || null)}, ${esc(enArt.relatedService?.text || null)});\n`;
  }
});

seed003 += articlesSql + '\n' + articleTransSql + '\n';
seed003 += `-- 4. Record Migration\nINSERT OR IGNORE INTO schema_migrations (name) VALUES ('0003_seed_all_articles.sql');\n`;

fs.writeFileSync('migrations/0003_seed_all_articles.sql', seed003);
console.log(`Successfully generated migrations/0003_seed_all_articles.sql with ${articleFiles.length} articles and ${articleFiles.length * 3} translations!`);
