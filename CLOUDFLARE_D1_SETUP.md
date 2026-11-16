# ИНСТРУКЦИЯ ПО НАСТРОЙКЕ CLOUDFLARE D1, CLOUDFLARE ACCESS И РЕЗЕРВНОГО КОПИРОВАНИЯ (v1.13)

**Проект:** Salons Aneri (`anerilv`)  
**Версия:** `1.13`  
**Администратор:** `pomellius@gmail.com`  
**Команда Cloudflare One (Team Name):** `pomellius` (`pomellius.cloudflareaccess.com`)
**Статус безопасности:** Строгая криптографическая проверка подписи Cloudflare Access JWT через Web Crypto API и официальные JWKS сертификаты. Никаких обходов по заголовкам, PIN-кодов или фиктивных токенов.

---

## 1. АРХИТЕКТУРА CLOUDFLARE D1 (PRODUCTION И PREVIEW)

В аккаунте Cloudflare используются две изолированные базы данных:
- **Production:** `aneri-production-db` (боевая база данных сайта anerilv.pages.dev / aneri.lv)
- **Preview:** `aneri-preview-db` (тестовая база для веток и предварительного просмотра)

### Привязка в Cloudflare Dashboard (D1 Database Bindings):
1. Перейдите в **Cloudflare Dashboard**: [dash.cloudflare.com](https://dash.cloudflare.com)
2. Откройте **Workers & Pages** -> проект **anerilv** -> вкладка **Settings** -> раздел **Functions**.
3. Прокрутите до **D1 database bindings**:
   - Для среды **Production**:
     - **Variable name:** `DB` *(обязательно заглавными буквами)*
     - **D1 database:** выберите `aneri-production-db`
   - Для среды **Preview**:
     - **Variable name:** `DB`
     - **D1 database:** выберите `aneri-preview-db`
4. Нажмите **Save**.

*Важно: Никогда не привязывайте базу `aneri-production-db` к среде Preview, чтобы предотвратить случайное изменение рабочих данных из тестовых сборок.*

---

## 2. МИГРАЦИИ И ЗАЩИТА ЦЕН ОТ ПЕРЕЗАПИСИ

Все миграции в папке `/migrations` спроектированы по принципу идемпотентности:
- `0001_initial_schema.sql` — создает структуру 10 таблиц и журнал миграций `schema_migrations`.
- `0002_seed_full_catalog.sql` — загружает полный каталог (82 услуги, 246 локализаций) с оператором `INSERT OR IGNORE`. Если администратор изменил цену через панель управления, повторный запуск миграции **не затрет** актуальные цены!
- `0003_seed_all_articles.sql` — загружает 11 SEO-статей (33 локализации) с оператором `INSERT OR IGNORE`.

### Применение миграций в Production:
Выполняйте миграции вручную в Cloudflare Dashboard (**D1 SQL Database** -> `aneri-production-db` -> **Console**) или через Wrangler CLI (а также автоматически через GitHub Actions при добавлении секрета `CLOUDFLARE_API_TOKEN` в репозитории GitHub):
```bash
npx wrangler d1 execute aneri-production-db --file=migrations/0001_initial_schema.sql
npx wrangler d1 execute aneri-production-db --file=migrations/0002_seed_full_catalog.sql
npx wrangler d1 execute aneri-production-db --file=migrations/0003_seed_all_articles.sql
```

Проверка состояния базы в консоли:
```sql
SELECT COUNT(*) FROM services;              -- возвращает 82
SELECT COUNT(*) FROM service_translations;  -- возвращает 246
SELECT COUNT(*) FROM articles;              -- возвращает 11
SELECT name, applied_at FROM schema_migrations;
```

---

## 3. СТРОГАЯ КРИПТОГРАФИЧЕСКАЯ АВТОРИЗАЦИЯ CLOUDFLARE ACCESS (v1.12)

В версии 1.12 реализована полная проверка подлинности через Web Crypto API (`functions/api/_middleware.ts`):
1. Из каждого запроса к `/api/admin/*` извлекается подписанный JWT из заголовка `Cf-Access-Jwt-Assertion`.
2. Заголовок `Cf-Access-Authenticated-User-Email` **никогда не используется самостоятельно** для предоставления доступа. Запрос без валидного JWT отвергается с HTTP 401.
3. Сервер запрашивает официальные публичные RSA-ключи (JWKS) с эндпоинта `https://<team-domain>.cloudflareaccess.com/cdn-cgi/access/certs` (с кэшированием в памяти на 1 час).
4. Проверяется соответствие идентификатора ключа `kid` и алгоритма `RS256`.
5. Функция `crypto.subtle.verify` проверяет криптографическую подпись токена.
6. Проверяется срок действия (`exp > now`) и время выпуска (`iat <= now + 300`).
7. Проверяется эмитент (`iss` должен соответствовать настроенному домену команды Cloudflare Access).
8. Если задан `CF_ACCESS_AUD`, проверяется соответствие аудитории приложения (`aud`).
9. Email пользователя извлекается **исключительно** из подтвержденного криптографического payload токена и сверяется со списком разрешенных администраторов (`pomellius@gmail.com`).
10. Все операции редактирования цен фиксируются в таблице `audit_logs` с указанием верифицированного email из JWT.

### Настройка Cloudflare Zero Trust (для Вашего аккаунта `pomellius`):
1. Откройте **Cloudflare One**: [one.dash.cloudflare.com](https://one.dash.cloudflare.com)
2. В левом меню выберите **Access** -> **Applications** -> **Add an application** -> **Self-hosted**.
3. В разделе **Application domain** добавьте защищаемые адреса:
   - Domain: `aneri.lv`, Path: `admin*`
   - Нажмите **Add application domain**, укажите Domain: `aneri.lv`, Path: `api/admin*`
   - *(При необходимости добавьте также `anerilv.pages.dev` с путями `admin*` и `api/admin*`)*
4. В разделе **Policies** создайте правило:
   - Policy name: `Owner Policy`
   - Action: `Allow`
   - Configure rules -> Include -> Selector: `Emails` -> Value: `pomellius@gmail.com`
5. Сохраните приложение и скопируйте **Application Audience (AUD) Tag**.
6. В настройках Cloudflare Pages (`anerilv` -> Settings -> Environment variables) укажите:
   - `CF_ACCESS_TEAM_DOMAIN`: `pomellius.cloudflareaccess.com`
   - `CF_ACCESS_AUD`: *(скопированный AUD тег вашего приложения)*

*Примечание: В окне предпросмотра AI Studio (`*.run.app`) Cloudflare Zero Trust и база D1 не работают — это локальная среда разработки. Для входа в админ-панель открывайте `https://aneri.lv/admin`.*

---

## 4. НАСТОЯЩИЙ СЕРВЕРНЫЙ РЕЗЕРВНЫЙ БЭКАП D1 (v1.13)

Защищенный серверный эндпоинт `GET /api/admin/backup`:
- Считывает данные напрямую из базы D1 для всех 10 системных таблиц (`categories`, `category_translations`, `services`, `service_translations`, `articles`, `article_translations`, `site_settings`, `admin_users`, `audit_logs`, `schema_migrations`).
- Формирует полный снимок в формате JSON со счетчиками записей, метаданными времени создания и версией `1.13`.
- В административной панели во вкладке **База данных** кнопка *"Lejupielādēt D1 Datu Bāzes Rezerves Kopiju (JSON)"* вызывает этот серверный эндпоинт и скачивает официальный архив базы.

---

## 5. БЫСТРАЯ ПРОВЕРКА РАБОТОСПОСОБНОСТИ

1. Откройте рабочий сайт: `https://aneri.lv` (или `https://anerilv.pages.dev`).
2. В футере нажмите значок замка рядом с надписью `v1.13` или перейдите напрямую на `https://aneri.lv/admin`.
3. Авторизуйтесь через Cloudflare Access под `pomellius@gmail.com`.
4. Измените цену любой услуги — изменение мгновенно запишется в таблицу `services` базы D1, зафиксируется в `audit_logs` и отобразится на сайте без нового деплоя.
