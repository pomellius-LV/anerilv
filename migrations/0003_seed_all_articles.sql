-- ====================================================================
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

-- 2. Articles Registry
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('beauty-salon-kengarags', 'beauty-salon-kengarags', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('facial-cleansing', 'facial-cleansing', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('hair-loss', 'hair-loss', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('haircare', 'haircare', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('hardware-pedicure', 'hardware-pedicure', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('keratin-vs-botox', 'keratin-vs-botox', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('manicure-tips', 'manicure-tips', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('nail-trends', 'nail-trends', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('permanent-makeup-care', 'permanent-makeup-care', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('solarium-rules', 'solarium-rules', NULL, 1);
INSERT OR IGNORE INTO articles (id, slug, image, is_published) VALUES ('waxing-vs-laser', 'waxing-vs-laser', NULL, 1);

-- 3. Article Translations (LV, RU, EN)
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('beauty-salon-kengarags', 'lv', 'Skaistumkopšanas salons Ķengaragā: pilns pakalpojumu klāsts netālu no jums', 'Meklējat labu frizētavu vai skaistumkopšanas salonu Ķengaragā? Salons Aneri piedāvā matu griezumus, manikīru, pedikīru, vaksāciju un solāriju. Uzziniet cenas un pierakstieties!', 'Ja dzīvojat Rīgā un meklējat kvalitatīvus skaistumkopšanas pakalpojumus netālu no mājām, salons Aneri ir tieši tas, kas jums nepieciešams. Mūsu frizētava Ķengaragā piedāvā pilnu pakalpojumu klāstu visai ģimenei. Mēs lepojamies, ka varam piedāvāt augsta līmeņa servisu par pieejamām cenām.

### Frizieru pakalpojumi ikvienam

Mūsu salonā strādā pieredzējuši meistari, kuri seko līdzi jaunākajām tendencēm. Nepieciešams stilīgs **sieviešu matu griezums**, klasisks **vīriešu matu griezums** vai glīts **bērnu matu griezums**? Mēs visu izdarīsim visaugstākajā līmenī. Piedāvājam arī profesionālu jebkuras sarežģītības matu krāsošanu, izmantojot kvalitatīvu Matrix un L''Oreal kosmētiku. Matu griezumu cenas varat uzzināt mūsu cenrādī.

### Ideāls manikīrs un pedikīrs

Koptas rokas un kājas ir katra cilvēka vizītkarte. Piedāvājam klasisko un **aparāta manikīru** Rīgā. Īpaši populārs ir **gēllakas pārklājums** (daudzi to joprojām sauc par Gelish), kas turas līdz pat 4 nedēļām. Pie mums pieejams arī profesionāls **pedikīrs** par lielisku cenu, tostarp vīriešu pedikīrs.

### Gluda āda un skaists iedegums

Tiem, kas sapņo par gludu ādu, pieejama **vaksācija** Rīgā, tostarp delikātā dziļā bikini zona. Un, ja vēlaties iegūt skaistu un vienmērīgu iedegumu jebkurā gadalaikā, mūsu **solārijs** Ķengaragā vienmēr ir jūsu rīcībā. Mēs regulāri mainām lampas jūsu drošībai.

### Kosmetoloģija un permanentais grims

Rūpes par seju uzticiet mūsu kosmetologiem. Piedāvājam dažādus **sejas tīrīšanas** veidus, pīlingus un atjaunojošas procedūras. Turklāt salonā Aneri pieejams **permanentais grims** (uzacis, lūpas, starpskropstu telpa), kas izcels jūsu dabisko skaistumu un ietaupīs laiku no rītiem.

Daudzi vietējie iedzīvotāji atceras mūsu atrašanās vietu — agrāk šeit atradās slavenais restorāns Ščecina. Šodien šajā adresē (Latgales iela 264, blakus TC Dole un Mego) atrodas mājīgs skaistumkopšanas salons Rīgā, kur katrs klients jūtas īpašs. Nāciet pie mums pēc skaistuma un lieliska garastāvokļa!', 'Skaistumkopšanas salons Ķengarags | Frizētava, Manikīrs, Solārijs', 'Meklējat labu frizētavu vai skaistumkopšanas salonu Ķengaragā? Salons Aneri piedāvā matu griezumus, manikīru, pedikīru, vaksāciju un solāriju. Uzziniet cenas un pierakstieties!', 'hair', 'Skatīt visas pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('beauty-salon-kengarags', 'ru', 'Салон красоты в Кенгарагсе: полный спектр услуг рядом с вами', 'Ищете хорошую парикмахерскую или салон красоты в Кенгарагсе? Салон Aneri предлагает стрижки, маникюр, педикюр, ваксацию и солярий. Узнайте цены и запишитесь!', 'Если вы живете в Риге и ищете качественные услуги красоты недалеко от дома, салон Aneri — это именно то, что вам нужно. Наша парикмахерская в Кенгарагсе предлагает полный спектр услуг для всей семьи. Мы гордимся тем, что можем предложить высокий уровень сервиса по доступным ценам.

### Парикмахерские услуги для каждого

В нашем салоне работают опытные мастера, которые следят за последними тенденциями. Нужна стильная **женская стрижка**, классическая **мужская стрижка** или аккуратная **детская стрижка**? Мы сделаем все на высшем уровне. Также мы предлагаем профессиональное окрашивание волос любой сложности, используя качественную косметику Matrix и L''Oreal. Узнать цены на стрижки можно в нашем прайс-листе.

### Идеальный маникюр и педикюр

Ухоженные руки и ноги — визитная карточка каждого человека. Мы предлагаем классический и **аппаратный маникюр** в Риге. Особой популярностью пользуется **покрытие гель-лак** (многие по привычке называют его Гелиш), которое держится до 4 недель. Также у нас доступен профессиональный **педикюр** по отличной цене, включая мужской педикюр.

### Гладкая кожа и красивый загар

Для тех, кто мечтает о гладкой коже, доступна **ваксация** в Риге, включая деликатную зону глубокого бикини. А если вы хотите получить красивый и ровный загар в любое время года, наш **солярий** в Кенгарагсе всегда к вашим услугам. Мы регулярно меняем лампы для вашей безопасности.

### Косметология и перманентный макияж

Заботу о лице доверьте нашим косметологам. Мы предлагаем различные виды **чистки лица**, пилинги и омолаживающие процедуры. Кроме того, в салоне Aneri доступен **перманентный макияж** (брови, губы, межресничное пространство), который подчеркнет вашу естественную красоту и сэкономит время по утрам.

Многие местные жители помнят наше местоположение — раньше здесь находился известный ресторан Щецин. Сегодня же по этому адресу (ул. Латгалес 264, рядом с ТЦ Dole и Mego) располагается уютный салон красоты Рига, где каждый клиент чувствует себя особенным. Приходите к нам за красотой и отличным настроением!', 'Салон красоты Кенгарагс | Парикмахерская, Маникюр, Солярий', 'Ищете хорошую парикмахерскую или салон красоты в Кенгарагсе? Салон Aneri предлагает стрижки, маникюр, педикюр, ваксацию и солярий. Узнайте цены и запишитесь!', 'hair', 'Смотреть все цены на услуги');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('beauty-salon-kengarags', 'en', 'Beauty Salon in Kengarags: A Full Range of Services Near You', 'Looking for a good hair salon or beauty salon in Kengarags? Aneri Salon offers haircuts, manicures, pedicures, waxing, and a solarium. Find out prices and book!', 'If you live in Riga and are looking for quality beauty services close to home, Aneri Salon is exactly what you need. Our hair salon in Kengarags offers a full range of services for the whole family. We are proud to offer a high level of service at affordable prices.

### Hairdressing Services for Everyone
Our salon employs experienced masters who follow the latest trends. Need a stylish **women''s haircut**, a classic **men''s haircut**, or a neat **kids'' haircut**? We will do everything at the highest level. We also offer professional hair coloring of any complexity, using quality Matrix and L''Oreal cosmetics. You can find out the prices for haircuts in our price list.

### Perfect Manicure and Pedicure
Well-groomed hands and feet are everyone''s calling card. We offer classic and **hardware manicures** in Riga. Especially popular is the **gel polish coating** (many still call it Gelish out of habit), which lasts up to 4 weeks. We also have a professional **pedicure** available at a great price, including men''s pedicures.

### Smooth Skin and a Beautiful Tan
For those dreaming of smooth skin, **waxing** in Riga is available, including the delicate deep bikini zone. And if you want to get a beautiful and even tan at any time of the year, our **solarium** in Kengarags is always at your service. We regularly change the lamps for your safety.

### Cosmetology and Permanent Makeup
Entrust the care of your face to our cosmetologists. We offer various types of **facial cleansing**, peels, and rejuvenating procedures. In addition, **permanent makeup** (eyebrows, lips, lash line) is available at Aneri Salon, which will emphasize your natural beauty and save time in the mornings.

Many locals remember our location — the famous Szczecin restaurant used to be here. Today, at this address (Latgales iela 264, next to TC Dole and Mego), there is a cozy beauty salon in Riga, where every client feels special. Come to us for beauty and a great mood!', 'Beauty Salon Kengarags | Hairdresser, Manicure, Solarium', 'Looking for a good hair salon or beauty salon in Kengarags? Aneri Salon offers haircuts, manicures, pedicures, waxing, and a solarium. Find out prices and book!', 'hair', 'View all service prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('facial-cleansing', 'lv', 'Sejas tīrīšana: kāpēc tā ir nepieciešama un kādu veidu izvēlēties', 'Uzziniet par dažādiem sejas tīrīšanas veidiem un to priekšrocībām. Profesionāla sejas kopšana un kosmetologa pakalpojumi Salons Aneri.', 'Regulāra sejas tīrīšana ir pamats veselīgai, mirdzošai un jauneklīgai ādai. Ikdienā mūsu āda saskaras ar putekļiem, kosmētiku un pilsētas piesārņojumu, kas nosprosto poras un var izraisīt iekaisumus. Mājas apstākļos nav iespējams veikt tik dziļu attīrīšanu kā kosmetologa kabinetā. Salons Aneri piedāvā vairākus sejas tīrīšanas veidus: **mehānisko**, **ultraskaņas** un **kombinēto**. 

**Mehāniskā tīrīšana** ir ideāli piemērota problemātiskai ādai ar izteiktiem komedoniem. 

**Ultraskaņas tīrīšana** ir maiga un nesāpīga metode, kas lieliski noņem atmirušās šūnas un atsvaidzina sejas krāsu. 

**Kombinētā tīrīšana** apvieno abas metodes maksimālam rezultātam. 

Mūsu pieredzējušie kosmetologi Rīgā, Ķengaragā, palīdzēs izvēlēties tieši jūsu ādas tipam un stāvoklim piemērotāko procedūru. Pēc profesionālas tīrīšanas āda labāk elpo, un ikdienas kopšanas līdzekļi iedarbojas daudz efektīvāk.', 'Sejas tīrīšana Rīgā | Kosmetologs Ķengaragā | Salons Aneri', 'Uzziniet par dažādiem sejas tīrīšanas veidiem un to priekšrocībām. Profesionāla sejas kopšana un kosmetologa pakalpojumi Salons Aneri.', 'cosmetology', 'Skatīt kosmetoloģijas pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('facial-cleansing', 'ru', 'Чистка лица: зачем она нужна и какой вид выбрать', 'Узнайте о различных видах чистки лица и их преимуществах. Профессиональный уход за кожей и услуги косметолога в салоне Aneri.', 'Регулярная чистка лица — это основа здоровой, сияющей и молодой кожи. Ежедневно наша кожа сталкивается с пылью, косметикой и городским загрязнением, что забивает поры и может вызвать воспаления. В домашних условиях невозможно провести такое глубокое очищение, как в кабинете косметолога. Салон Aneri предлагает несколько видов чистки лица: **механическую**, **ультразвуковую** и **комбинированную**. 

**Механическая чистка** идеально подходит для проблемной кожи с выраженными комедонами. 

**Ультразвуковая чистка** — это мягкий и безболезненный метод, который отлично удаляет омертвевшие клетки и освежает цвет лица. 

**Комбинированная чистка** объединяет оба метода для максимального результата. 

Наши опытные косметологи в Риге, в Кенгарагсе, помогут выбрать процедуру, подходящую именно для вашего типа и состояния кожи. После профессиональной чистки кожа лучше дышит, а средства для ежедневного ухода действуют гораздо эффективнее.', 'Чистка лица в Риге | Косметолог Кенгарагс | Салон Aneri', 'Узнайте о различных видах чистки лица и их преимуществах. Профессиональный уход за кожей и услуги косметолога в салоне Aneri.', 'cosmetology', 'Смотреть цены на услуги косметолога');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('facial-cleansing', 'en', 'Facial Cleansing: Why You Need It and Which Type to Choose', 'Learn about the different types of facial cleansing and their benefits. Professional skin care and cosmetologist services at Aneri Salon.', 'Regular facial cleansing is the foundation of healthy, glowing, and youthful skin. Every day, our skin faces dust, makeup, and urban pollution, which clogs pores and can cause breakouts. It is impossible to achieve the same deep cleansing at home as in a cosmetologist''s office. Aneri Salon offers several types of facial cleansing: **mechanical**, **ultrasonic**, and **combined**. 

**Mechanical cleansing** is ideal for problem skin with pronounced comedones. 

**Ultrasonic cleansing** is a gentle and painless method that perfectly removes dead cells and refreshes the complexion. 

**Combined cleansing** combines both methods for maximum results. 

Our experienced cosmetologists in Riga, Kengarags, will help you choose the procedure that is right for your skin type and condition. After professional cleansing, the skin breathes better, and daily care products work much more effectively.', 'Facial Cleansing in Riga | Cosmetologist | Aneri Salon', 'Learn about the different types of facial cleansing and their benefits. Professional skin care and cosmetologist services at Aneri Salon.', 'cosmetology', 'View Cosmetology Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hair-loss', 'lv', 'Matu izkrišana: cēloņi un efektīvi risinājumi', 'Kāpēc izkrīt mati un kā to apturēt? Uzziniet par matu izkrišanas cēloņiem un profesionālām procedūrām matu augšanas veicināšanai.', 'Matu izkrišana ir izplatīta problēma, kas var skart gan vīriešus, gan sievietes. Cēloņi var būt dažādi: stress, hormonālās izmaiņas, nepareizs uzturs vai nepiemērota matu kopšana. 

Lai apturētu matu izkrišanu, svarīgi ir sākt ar pareizu galvas ādas kopšanu. Izvēlieties **maigus šampūnus** un regulāri veiciet **galvas ādas pīlingu**, lai attīrītu poras un uzlabotu asinsriti. 

Salons Aneri piedāvā profesionālas matu kopšanas procedūras, kas stiprina matu saknes un veicina to augšanu. Mūsu frizieri Rīgā palīdzēs izvēlēties atbilstošus līdzekļus mājas lietošanai. 

Atcerieties, ka veselīgi mati sākas ar veselīgu galvas ādu. Ja problēma ir ilgstoša, ieteicams konsultēties ar trihologu, taču ikdienas pareiza kopšana ir pirmais solis ceļā uz bieziem un spēcīgiem matiem.', 'Matu izkrišana un ārstēšana | Frizieri Rīgā | Salons Aneri', 'Kāpēc izkrīt mati un kā to apturēt? Uzziniet par matu izkrišanas cēloņiem un profesionālām procedūrām matu augšanas veicināšanai.', 'hair', 'Skatīt friziera pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hair-loss', 'ru', 'Выпадение волос: причины и эффективные решения', 'Почему выпадают волосы и как это остановить? Узнайте о причинах выпадения волос и профессиональных процедурах для их укрепления.', 'Выпадение волос — распространенная проблема, которая может быть вызвана стрессом, гормональными изменениями, неправильным питанием или уходом. 

Чтобы остановить выпадение, важно начать с правильного ухода за кожей головы. Выбирайте **мягкие шампуни** и регулярно делайте **пилинг кожи головы** для очищения пор и улучшения кровообращения. 

Салон Aneri предлагает профессиональные процедуры по уходу за волосами, которые укрепляют корни и стимулируют рост. Наши парикмахеры в Риге помогут подобрать подходящие средства для домашнего использования. 

Помните, что здоровые волосы начинаются со здоровой кожи головы. При длительной проблеме рекомендуется консультация трихолога, но правильный ежедневный уход — это первый шаг к густым волосам.', 'Лечение выпадения волос | Парикмахерская Кенгарагс | Салон Aneri', 'Почему выпадают волосы и как это остановить? Узнайте о причинах выпадения волос и профессиональных процедурах для их укрепления.', 'hair', 'Смотреть цены на парикмахерские услуги');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hair-loss', 'en', 'Hair Loss: Causes and Effective Solutions', 'Why is your hair falling out and how can you stop it? Discover the causes of hair loss and professional treatments to stimulate growth.', 'Hair loss is a common issue that can affect both men and women. Causes range from stress and hormonal changes to poor diet or improper hair care. 

To combat hair loss, it is crucial to start with proper scalp care. Choose **gentle shampoos** and regularly **exfoliate your scalp** to unclog pores and improve blood circulation. 

Aneri Salon offers professional hair care treatments that strengthen hair roots and promote healthy growth. Our hairdressers in Riga will help you select the right products for your daily routine. 

Remember, healthy hair starts with a healthy scalp. While persistent issues may require a trichologist''s advice, a proper daily care routine is the first step towards thicker, stronger hair.', 'Hair Loss Treatments | Hairdresser Riga | Aneri Salon', 'Why is your hair falling out and how can you stop it? Discover the causes of hair loss and professional treatments to stimulate growth.', 'hair', 'View Hairdressing Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('haircare', 'lv', 'Kā pareizi kopt matus pēc krāsošanas: Profesionāļu padomi', 'Uzziniet, kā saglabāt matu krāsu spilgtu un matus veselīgus pēc krāsošanas. Padomi no Salons Aneri meistariem Ķengaragā.', 'Matu krāsošana ir lielisks veids, kā atsvaidzināt tēlu, taču pēc procedūras matiem nepieciešama īpaša aprūpe. 

Pirmkārt, izvēlieties **šampūnus un kondicionierus**, kas paredzēti krāsotiem matiem – tie nesatur agresīvus sulfātus, kas izmazgā pigmentu. 

Otrkārt, vismaz reizi nedēļā lietojiet **barojošu matu masku**. Neaizmirstiet par **termoaizsardzību** pirms matu žāvēšanas vai veidošanas ar karstajiem instrumentiem. 

Mūsu salonā Ķengaragā meistari vienmēr ieteiks jūsu matu tipam atbilstošākos profesionālos līdzekļus no Matrix un L''Oreal. Regulāra matu galu apgriešana palīdzēs uzturēt matu veselību un novērsīs to šķelšanos. 

Ja meklējat labu frizētavu Rīgā, kur par jūsu matiem parūpēsies pieredzējuši meistari, Salons Aneri ir pareizā izvēle. Mēs piedāvājam ne tikai krāsošanu, bet arī dziļās atjaunošanas procedūras.', 'Matu kopšana pēc krāsošanas | Frizētava Ķengaragā | Salons Aneri', 'Uzziniet, kā saglabāt matu krāsu spilgtu un matus veselīgus pēc krāsošanas. Padomi no Salons Aneri meistariem Ķengaragā.', 'hair', 'Skatīt friziera pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('haircare', 'ru', 'Как сохранить цвет и здоровье волос после окрашивания', 'Советы профессиональных парикмахеров по уходу за окрашенными волосами. Как продлить яркость цвета и восстановить структуру.', 'Окрашивание волос — это стресс для их структуры, поэтому правильный домашний уход критически важен. 

Во-первых, перейдите на **безсульфатные шампуни** для окрашенных волос — они бережно очищают и не вымывают пигмент. 

Во-вторых, используйте **увлажняющие и восстанавливающие маски** 1-2 раза в неделю. Обязательно наносите **термозащиту** перед сушкой феном или использованием утюжка. 

В нашем салоне в Кенгарагсе мастера работают на профессиональной косметике Matrix и L''Oreal и всегда помогут подобрать идеальный уход именно для вашего типа волос. Регулярная стрижка кончиков также поможет сохранить здоровый вид. Если вы ищете хорошую парикмахерскую в Риге, где заботятся о качестве волос, салон Aneri — ваш лучший выбор.', 'Уход за волосами после окрашивания | Салон Aneri Рига', 'Советы профессиональных парикмахеров по уходу за окрашенными волосами. Как продлить яркость цвета и восстановить структуру.', 'hair', 'Смотреть цены на парикмахерские услуги');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('haircare', 'en', 'How to Care for Your Hair After Coloring: Professional Tips', 'Learn how to keep your hair color vibrant and your hair healthy after coloring. Expert tips from Aneri Salon in Riga.', 'Coloring your hair is a great way to refresh your look, but it requires special care afterwards. 

First, switch to **sulfate-free shampoos** designed for color-treated hair—they clean gently without stripping the pigment. 

Second, use a **hydrating and repairing hair mask** at least once a week. Always apply a **heat protectant** before blow-drying or using hot styling tools. 

At our salon in Kengarags, our stylists work with professional brands like Matrix and L''Oreal and will recommend the perfect home care routine for your hair type. Regular trims are also essential to prevent split ends and keep your hair looking fresh. 

If you are looking for a top-quality hair salon in Riga, Aneri Salon is your best choice for both coloring and deep conditioning treatments.', 'Hair Care After Coloring | Hair Salon Riga | Aneri', 'Learn how to keep your hair color vibrant and your hair healthy after coloring. Expert tips from Aneri Salon in Riga.', 'hair', 'View Hairdressing Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hardware-pedicure', 'lv', 'Aparātpedikīrs: kāpēc tas ir labākais risinājums pēdu veselībai', 'Uzziniet par aparātpedikīra priekšrocībām un kāpēc tas ir drošākais un efektīvākais risinājums pēdu veselībai.', 'Aparātpedikīrs ir mūsdienīga un droša pēdu kopšanas metode. 

Atšķirībā no klasiskā pedikīra, šeit netiek izmantots ūdens (mērcēšana) un griezējinstrumenti, kas ievērojami samazina infekciju un sēnīšu slimību risku. Meistars izmanto speciālu iekārtu ar dažādiem uzgaļiem, kas maigi un precīzi noņem sabiezējumus, neskarot veselo ādu. 

Šī procedūra ir īpaši ieteicama cilvēkiem ar cukura diabētu, ieaugušiem nagiem, varžacīm vai ļoti sausu pēdu ādu. **Aparātpedikīrs** nodrošina ilgstošāku gluduma efektu nekā klasiskais pedikīrs. 

Salons Aneri piedāvā profesionālu **aparātpedikīru** Ķengaragā, kas nodrošinās jūsu pēdām ne tikai estētisku skaistumu, bet arī veselību un komfortu ikdienas solī.', 'Aparātpedikīrs Rīgā | Pēdu aprūpe | Salons Aneri', 'Uzziniet par aparātpedikīra priekšrocībām un kāpēc tas ir drošākais un efektīvākais risinājums pēdu veselībai.', 'nails', 'Skatīt manikīra un pedikīra cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hardware-pedicure', 'ru', 'Аппаратный педикюр: почему это лучший выбор для ваших ног', 'В чем разница между классическим и аппаратным педикюром? Преимущества аппаратной обработки стоп и ногтей.', 'Аппаратный педикюр — это современный, безопасный и гигиеничный метод ухода за стопами. 

В отличие от классического обрезного педикюра, здесь не используются ванночки с водой (размачивание) и лезвия. Мастер обрабатывает огрубевшую кожу и ногти специальным аппаратом с фрезами. Это полностью исключает риск порезов и грибковых инфекций. 

**Аппаратный метод** идеально справляется с натоптышами, стержневыми мозолями и проблемой вросшего ногтя. Кроме того, эффект гладких пяточек сохраняется значительно дольше. 

Регулярный **аппаратный педикюр** в салоне Aneri в Кенгарагсе сделает ваши стопы не только красивыми, но и здоровыми, обеспечив комфорт при каждом шаге.', 'Аппаратный педикюр в Риге | Салон красоты Aneri', 'В чем разница между классическим и аппаратным педикюром? Преимущества аппаратной обработки стоп и ногтей.', 'nails', 'Смотреть цены на маникюр и педикюр');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('hardware-pedicure', 'en', 'Hardware Pedicure: Why It Is the Best Choice for Your Feet', 'What is the difference between a classic and a hardware pedicure? Discover the benefits of machine foot care.', 'A **hardware (machine) pedicure** is a modern, safe, and highly hygienic method of foot care. Unlike a classic pedicure, it does not involve soaking the feet in water or using blades. 

The technician uses a special podiatry machine with various drill bits to gently remove calluses and dead skin without touching healthy tissue. This completely eliminates the risk of cuts and fungal infections. 

The hardware method is especially recommended for people with diabetes, ingrown toenails, or severe calluses. Moreover, the smooth effect lasts much longer than with a traditional pedicure. 

Regular hardware pedicures at Aneri Salon in Kengarags will keep your feet not only beautiful but also healthy and comfortable with every step.', 'Hardware Pedicure in Riga | Foot Care | Aneri Salon', 'What is the difference between a classic and a hardware pedicure? Discover the benefits of machine foot care.', 'nails', 'View Manicure & Pedicure Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('keratin-vs-botox', 'lv', 'Keratīna taisnošana pret matu botoksu: ko izvēlēties?', 'Kāda ir atšķirība starp keratīna taisnošanu un matu botoksu? Uzziniet, kura procedūra ir piemērotāka jūsu matiem.', 'Daudzas sievietes sapņo par gludiem, spīdīgiem un veselīgiem matiem. Divas populārākās procedūras šī mērķa sasniegšanai ir keratīna taisnošana un matu botokss. Bet kāda ir atšķirība? 

**Keratīna taisnošana** ir ideāli piemērota cirtainiem, nepaklausīgiem matiem. Tā iztaisno matu struktūru, novērš pūkošanos un piešķir intensīvu spīdumu, kas saglabājas vairākus mēnešus. 

Savukārt **matu botokss** ir dziļi atjaunojoša procedūra. Tā neiztaisno matus tik intensīvi kā keratīns, bet gan piepilda matu struktūru ar barības vielām, aminoskābēm un vitamīniem, padarot tos biezākus, elastīgākus un veselīgākus. Botokss ir lieliska izvēle bojātiem, sausiem un balinātiem matiem. 

Mūsu skaistumkopšanas salonā Ķengaragā meistari novērtēs jūsu matu stāvokli un ieteiks piemērotāko procedūru, lai sasniegtu labāko rezultātu.', 'Keratīna taisnošana un matu botokss | Salons Aneri Ķengaragā', 'Kāda ir atšķirība starp keratīna taisnošanu un matu botoksu? Uzziniet, kura procedūra ir piemērotāka jūsu matiem.', 'hair', 'Skatīt friziera pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('keratin-vs-botox', 'ru', 'Кератиновое выпрямление или ботокс для волос: что выбрать?', 'В чем разница между кератиновым выпрямлением и ботоксом для волос? Узнайте, какая процедура лучше подойдет для вашего типа волос.', 'Многие мечтают о гладких, блестящих и здоровых волосах. Две самые популярные процедуры для этого — кератиновое выпрямление и ботокс для волос. В чем же разница? 

**Кератиновое выпрямление** идеально подходит для кудрявых, непослушных и пушистых волос. Оно выпрямляет структуру, устраняет пушистость и придает интенсивный блеск на несколько месяцев. 

**Ботокс для волос**, напротив, направлен на глубокое восстановление. Он не выпрямляет волосы так сильно, как кератин, но наполняет их питательными веществами, аминокислотами и витаминами, делая более плотными, эластичными и здоровыми. Ботокс — отличный выбор для поврежденных, сухих и осветленных волос. 

В нашем салоне красоты в Кенгарагсе мастера оценят состояние ваших волос и порекомендуют наиболее подходящую процедуру.', 'Кератиновое выпрямление и ботокс для волос | Салон красоты Рига', 'В чем разница между кератиновым выпрямлением и ботоксом для волос? Узнайте, какая процедура лучше подойдет для вашего типа волос.', 'hair', 'Смотреть цены на парикмахерские услуги');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('keratin-vs-botox', 'en', 'Keratin Straightening vs. Hair Botox: Which to Choose?', 'What is the difference between Keratin Straightening and Hair Botox? Find out which treatment is best for your hair type.', 'Many women dream of smooth, shiny, and healthy hair. The two most popular treatments to achieve this are Keratin Straightening and Hair Botox. But what is the difference? 

**Keratin Straightening** is ideal for curly, frizzy, and unruly hair. It alters the hair structure to make it perfectly straight, eliminates frizz, and adds intense shine that lasts for months. 

**Hair Botox**, on the other hand, is a deep conditioning treatment. It does not straighten the hair as intensely as keratin but fills the hair fibers with nutrients, amino acids, and vitamins, making it thicker, more elastic, and healthier. Botox is an excellent choice for damaged, dry, or bleached hair. 

At our beauty salon in Kengarags, our experts will assess your hair condition and recommend the best procedure for you.', 'Keratin Straightening and Hair Botox | Beauty Salon Riga', 'What is the difference between Keratin Straightening and Hair Botox? Find out which treatment is best for your hair type.', 'hair', 'View Hairdressing Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('manicure-tips', 'lv', 'Kā pagarināt gēllakas noturību: 5 zelta likumi', 'Kā panākt, lai gēllaka turētos ilgāk? Noderīgi padomi perfekta manikīra saglabāšanai no Salons Aneri meistariem.', 'Lai gēllaka priecētu jūs 3-4 nedēļas, ir svarīgi ievērot dažus vienkāršus noteikumus. 

1. Pirmajās 24 stundās pēc manikīra izvairieties no ilgstošas saskares ar **karstu ūdeni** (piemēram, pirts vai karsta vanna), jo pārklājumam pilnībā jānostiprinās. 
2. Mājas darbus, kuros izmanto ķīmiskus tīrīšanas līdzekļus, vienmēr veiciet **gumijas cimdos**. 
3. Regulāri mitriniet kutikulu ar **speciālu eļļu** – tas ne tikai uzlabos nagu izskatu, bet arī novērsīs atslāņošanos. 
4. Neizmantojiet nagus kā instrumentus (piemēram, lai atvērtu bundžas). 
5. Ja pamanāt nelielu bojājumu, **neplēsiet laku**, bet pierakstieties pie mūsu meistariem uz korekciju. 

Salons Aneri piedāvā kvalitatīvu manikīru Ķengaragā, izmantojot tikai labākos materiālus, kas garantē ilgnoturīgu un skaistu rezultātu.', 'Gēllakas noturības noslēpumi | Manikīrs Rīgā | Salons Aneri', 'Kā panākt, lai gēllaka turētos ilgāk? Noderīgi padomi perfekta manikīra saglabāšanai no Salons Aneri meistariem.', 'nails', 'Skatīt manikīra un pedikīra cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('manicure-tips', 'ru', 'Секреты идеального маникюра: как продлить жизнь гель-лаку', 'Почему откалывается гель-лак? Узнайте, как правильно ухаживать за ногтями после маникюра, чтобы покрытие держалось до 4 недель.', 'Чтобы маникюр с гель-лаком радовал вас 3-4 недели, соблюдайте несколько простых правил. 

1. В первые 24 часа избегайте длительного контакта с **горячей водой** (бани, сауны, горячие ванны), так как покрытию нужно время для полной усадки. 
2. Всю домашнюю работу с бытовой химией выполняйте строго в **резиновых перчатках**. 
3. Ежедневно наносите **масло для кутикулы** — увлажненная кожа предотвращает появление заусенцев и отслоек материала. 
4. Не используйте ногти в качестве инструментов (например, чтобы что-то подковырнуть). 
5. Если лак начал скалываться, ни в коем случае **не сдирайте его самостоятельно**, чтобы не повредить ногтевую пластину. 

Приходите в салон Aneri на безопасное снятие и обновление покрытия. Мы предлагаем качественный маникюр в Риге с использованием лучших материалов.', 'Как продлить стойкость гель-лака | Маникюр Кенгарагс', 'Почему откалывается гель-лак? Узнайте, как правильно ухаживать за ногтями после маникюра, чтобы покрытие держалось до 4 недель.', 'nails', 'Смотреть цены на маникюр и педикюр');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('manicure-tips', 'en', 'Secrets to a Perfect Manicure: How to Make Gel Polish Last Longer', 'Why does gel polish chip? Learn how to properly care for your nails after a manicure so your polish lasts up to 4 weeks.', 'To keep your gel polish looking flawless for 3-4 weeks, follow a few simple rules. 

1. For the first 24 hours, **avoid prolonged contact with hot water** (like saunas or hot baths) as the polish needs time to fully set. 
2. Always **wear rubber gloves** when doing household chores with cleaning chemicals. 
3. **Apply cuticle oil daily**—moisturized skin prevents hangnails and lifting of the polish. 
4. **Never use your nails as tools** (e.g., to open cans). 
5. If you notice a small chip, **do not peel the polish off yourself**, as this will damage your natural nail plate. 

Instead, book an appointment at Aneri Salon for a safe removal or fix. We offer high-quality manicures in Riga using only the best materials for a long-lasting result.', 'How to Make Gel Polish Last | Manicure Riga | Aneri Salon', 'Why does gel polish chip? Learn how to properly care for your nails after a manicure so your polish lasts up to 4 weeks.', 'nails', 'View Manicure & Pedicure Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('nail-trends', 'lv', 'Aktuālākās manikīra tendences šajā sezonā', 'Kādas nagu krāsas un dizaini ir modē šosezon? Iedvesmojies savam nākamajam manikīram Salons Aneri.', 'Manikīra mode mainās katru sezonu, un vienmēr ir aizraujoši izmēģināt ko jaunu. 

Šosezon aktuāls ir **dabiskums un minimālisms** – "nude" toņi, maigi rozā un caurspīdīgi pārklājumi, kas izceļ nagu dabisko skaistumu. Tomēr klasika nekur nepazūd – **sarkans manikīrs** un elegants **franču manikīrs** (frenčs) joprojām ir topā. 

Drosmīgākām dāmām iesakām izmēģināt **metāliskus akcentus**, ģeometriskus rakstus vai **"cat eye"** (kaķa acs) efektu, kas īpaši skaisti izskatās saules gaismā. 

Attiecībā uz nagu formu – modē ir īsi, kopti nagi ar **mīkstu kvadrāta** vai ovālu formu. 

Neatkarīgi no tā, vai dodat priekšroku klasikai vai jaunākajiem trendiem, Salons Aneri meistari Ķengaragā palīdzēs realizēt jebkuru jūsu ideju, izmantojot plašu gēllaku paleti un modernākās tehnikas.', 'Manikīra tendences un dizains | Skaistumkopšanas salons Rīgā', 'Kādas nagu krāsas un dizaini ir modē šosezon? Iedvesmojies savam nākamajam manikīram Salons Aneri.', 'nails', 'Skatīt manikīra un pedikīra cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('nail-trends', 'ru', 'Самые актуальные тренды маникюра в этом сезоне', 'Какие цвета и дизайны ногтей в моде в этом сезоне? Вдохновитесь идеями для вашего следующего маникюра в салоне Aneri.', 'Мода на маникюр меняется каждый сезон, и всегда интересно пробовать что-то новое. 

В этом сезоне на пике популярности **естественность и минимализм** — нюдовые оттенки, нежно-розовые и полупрозрачные базы, подчеркивающие природную красоту ногтей. Однако классика остается неизменной: **красный маникюр** и элегантный **френч** всегда в тренде. 

Для более смелых образов рекомендуем **металлические акценты**, геометрические узоры или эффект **"кошачий глаз"**, который невероятно красиво переливается на солнце. 

Что касается формы — в моде короткие, ухоженные ногти формы **"мягкий квадрат"** или овал. 

Независимо от того, предпочитаете ли вы классику или последние тренды, мастера салона Aneri в Кенгарагсе помогут воплотить любую вашу идею, используя богатую палитру гель-лаков.', 'Тренды маникюра и дизайн ногтей | Салон красоты Рига', 'Какие цвета и дизайны ногтей в моде в этом сезоне? Вдохновитесь идеями для вашего следующего маникюра в салоне Aneri.', 'nails', 'Смотреть цены на маникюр и педикюр');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('nail-trends', 'en', 'Top Manicure Trends for This Season', 'What nail colors and designs are in style this season? Get inspired for your next manicure at Aneri Salon.', 'Manicure trends change every season, and it is always fun to try something new. 

This season, **natural beauty and minimalism** are highly popular—nude shades, soft pinks, and sheer bases that highlight the natural look of the nails. However, classics never fade: a **bold red manicure** and an **elegant French tip** are always in style. 

For a more daring look, we recommend trying **metallic accents**, **geometric patterns**, or the **"cat eye" effect**, which looks incredibly beautiful in the sunlight. 

As for nail shapes, short, well-groomed nails in a soft square or oval shape are currently trending. Whether you prefer a classic look or the latest trends, the nail technicians at Aneri Salon in Kengarags will help bring your ideas to life using a wide palette of high-quality gel polishes.', 'Nail Art Trends and Designs | Beauty Salon Riga', 'What nail colors and designs are in style this season? Get inspired for your next manicure at Aneri Salon.', 'nails', 'View Manicure & Pedicure Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('permanent-makeup-care', 'lv', 'Permanentais grims: viss par kopšanu pēc procedūras', 'Kā pareizi kopt uzacis, lūpas un acis pēc permanentā grima procedūras? Uzziniet svarīgākos noteikumus ilgnoturīgam rezultātam.', 'Permanentais grims ir ērts veids, kā izskatīties nevainojami jebkurā diennakts laikā. Taču, lai rezultāts jūs priecētu ilgi un krāsa saglabātos vienmērīga, ļoti svarīga ir pareiza kopšana dzīšanas periodā. 

Pirmās dienas pēc procedūras apstrādāto zonu **nedrīkst slapināt, kasīt vai plēst izveidojušos krevelīti**. Tas var novest pie pigmenta zuduma un rētu veidošanās. 

Izvairieties no **pirts, saunas, solārija un intensīviem treniņiem** vismaz 10-14 dienas. Lūpu un uzacu zonai meistars ieteiks speciālas dziedējošas ziedes, kas jāuzklāj plānā kārtiņā. 

Salons Aneri meistari Rīgā strādā tikai ar augstākās kvalitātes pigmentiem un vienmēr sniedz detalizētas instrukcijas par kopšanu mājās. Atcerieties, ka galējais rezultāts ir redzams tikai pēc aptuveni mēneša, kad āda ir pilnībā atjaunojusies.', 'Permanentā grima kopšana | Permanentais grims Rīgā', 'Kā pareizi kopt uzacis, lūpas un acis pēc permanentā grima procedūras? Uzziniet svarīgākos noteikumus ilgnoturīgam rezultātam.', 'permanent', 'Skatīt permanentā grima cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('permanent-makeup-care', 'ru', 'Перманентный макияж: всё об уходе после процедуры', 'Как правильно ухаживать за бровями, губами и веками после процедуры перманентного макияжа? Узнайте важные правила для стойкого результата.', 'Перманентный макияж — это удобный способ выглядеть безупречно в любое время суток. Однако, чтобы результат радовал вас долго, а цвет оставался равномерным, очень важен правильный уход в период заживления. 

В первые дни после процедуры обработанную зону **нельзя мочить, чесать или сдирать образовавшуюся корочку**. Это может привести к потере пигмента и образованию шрамов. 

Избегайте посещения **бани, сауны, солярия и интенсивных тренировок** как минимум 10-14 дней. Для зоны губ и бровей мастер порекомендует специальные заживляющие мази, которые нужно наносить тонким слоем. 

Мастера салона Aneri в Риге работают только с пигментами высочайшего качества и всегда дают подробные инструкции по домашнему уходу. Помните, что окончательный результат виден только примерно через месяц, когда кожа полностью восстановится.', 'Уход за перманентным макияжем | Татуаж в Риге', 'Как правильно ухаживать за бровями, губами и веками после процедуры перманентного макияжа? Узнайте важные правила для стойкого результата.', 'permanent', 'Смотреть цены на перманентный макияж');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('permanent-makeup-care', 'en', 'Permanent Makeup: Everything About Aftercare', 'How to properly care for eyebrows, lips, and eyelids after a permanent makeup procedure? Learn the important rules for a long-lasting result.', 'Permanent makeup is a convenient way to look flawless at any time of the day. However, for the result to please you for a long time and the color to remain even, proper care during the healing period is very important. 

In the first days after the procedure, the treated area **must not be wetted, scratched, or the formed crust peeled off**. This can lead to pigment loss and scarring. 

**Avoid visiting baths, saunas, solariums**, and intense workouts for at least 10-14 days. For the lip and eyebrow area, the master will recommend special healing ointments to be applied in a thin layer. 

The masters of Aneri Salon in Riga work only with the highest quality pigments and always provide detailed instructions for home care. Remember that the final result is visible only after about a month, when the skin has fully recovered.', 'Permanent Makeup Aftercare | Tattooing in Riga', 'How to properly care for eyebrows, lips, and eyelids after a permanent makeup procedure? Learn the important rules for a long-lasting result.', 'permanent', 'View Permanent Makeup Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('solarium-rules', 'lv', 'Kā pareizi sauļoties solārijā: drošības noteikumi', 'Uzziniet, kā pareizi un droši sauļoties solārijā, lai iegūtu skaistu iedegumu bez kaitējuma ādai. Ieteikumi no Salons Aneri.', 'Skaists un vienmērīgs iedegums izskatās pievilcīgi jebkurā gadalaikā. Tomēr, apmeklējot solāriju, ir svarīgi ievērot drošības noteikumus, lai nekaitētu ādai. 

Pirmkārt, vienmēr izmantojiet **speciālo solārija kosmētiku** – tā aizsargā ādu no izžūšanas un palīdz iegūt dziļāku, noturīgāku iedegumu. Parastie saules aizsargkrēmi solārijā neder! 

Otrkārt, sāciet ar **īsiem seansiem** (3-5 minūtes), īpaši, ja jums ir gaiša āda, un pakāpeniski palieliniet laiku. Starp seansiem jābūt vismaz 48 stundu pārtraukumam. 

Neaizmirstiet par **aizsargbrillēm** acīm un uzlīmēm dzimumzīmēm un krūšu galiem. 

Salons Aneri Ķengaragā piedāvā modernu un drošu solāriju ar regulāri mainītām lampām, lai jūsu iedegums būtu ne tikai skaists, bet arī veselīgs.', 'Solārijs Rīgā | Droša sauļošanās | Salons Aneri', 'Uzziniet, kā pareizi un droši sauļoties solārijā, lai iegūtu skaistu iedegumu bez kaitējuma ādai. Ieteikumi no Salons Aneri.', 'solarium', 'Skatīt solārija cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('solarium-rules', 'ru', 'Как правильно загорать в солярии: правила безопасности', 'Узнайте, как правильно и безопасно загорать в солярии, чтобы получить красивый загар без вреда для кожи. Рекомендации от салона Aneri.', 'Красивый и ровный загар выглядит привлекательно в любое время года. Однако при посещении солярия важно соблюдать правила безопасности, чтобы не навредить коже. 

Во-первых, всегда используйте **специальную косметику для солярия** — она защищает кожу от пересыхания и помогает получить более глубокий и стойкий загар. Обычные солнцезащитные кремы в солярии не подходят! 

Во-вторых, начинайте с **коротких сеансов** (3-5 минут), особенно если у вас светлая кожа, и постепенно увеличивайте время. Между сеансами должен быть перерыв не менее 48 часов. 

Не забывайте про **защитные очки** для глаз и стикини для родинок и сосков. 

Салон Aneri в Кенгарагсе предлагает современный и безопасный солярий с регулярно меняемыми лампами, чтобы ваш загар был не только красивым, но и здоровым.', 'Солярий в Риге | Безопасный загар | Салон Aneri', 'Узнайте, как правильно и безопасно загорать в солярии, чтобы получить красивый загар без вреда для кожи. Рекомендации от салона Aneri.', 'solarium', 'Смотреть цены на солярий');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('solarium-rules', 'en', 'How to Tan Safely in a Solarium: Safety Rules', 'Learn how to tan correctly and safely in a solarium to get a beautiful tan without harming your skin. Recommendations from Aneri Salon.', 'A beautiful and even tan looks attractive at any time of the year. However, when visiting a solarium, it is important to follow safety rules so as not to harm the skin. 

First, always use **special solarium cosmetics**—it protects the skin from drying out and helps to get a deeper, longer-lasting tan. Regular sunscreens do not work in a solarium! 

Second, **start with short sessions** (3-5 minutes), especially if you have light skin, and gradually increase the time. There should be a break of at least 48 hours between sessions. 

Do not forget about **protective goggles** for the eyes and stickers for moles and nipples. 

Aneri Salon in Kengarags offers a modern and safe solarium with regularly changed lamps so that your tan is not only beautiful but also healthy.', 'Solarium in Riga | Safe Tanning | Aneri Salon', 'Learn how to tan correctly and safely in a solarium to get a beautiful tan without harming your skin. Recommendations from Aneri Salon.', 'solarium', 'View Solarium Prices');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('waxing-vs-laser', 'lv', 'Vaksācija pret lāzerepilāciju: kuru metodi izvēlēties', 'Kāda ir atšķirība starp vaksāciju un lāzerepilāciju? Uzziniet abu metožu plusus un mīnusus, lai izvēlētos sev piemērotāko.', 'Gluda āda bez liekā apmatojuma ir daudzu sieviešu (un vīriešu) mērķis. Divas populārākās metodes šī mērķa sasniegšanai ir vaksācija un lāzerepilācija. 

**Vaksācija** ir ātra un pieejama metode, kas noņem matiņus ar visām saknēm. Rezultāts saglabājas no 3 līdz 6 nedēļām, un ar laiku matiņi kļūst plānāki un retāki. Tā ir lieliska izvēle tiem, kas vēlas tūlītēju rezultātu par saprātīgu cenu. 

**Lāzerepilācija**, savukārt, ir ilgtermiņa ieguldījums. Tā iznīcina matu folikulus, ievērojami samazinot apmatojuma augšanu nākotnē. Tomēr lāzerepilācijai nepieciešams kurss (parasti 6-8 procedūras), un tā var būt dārgāka. 

Salons Aneri Ķengaragā piedāvā profesionālu un maksimāli nesāpīgu vaksāciju ar augstas kvalitātes vaskiem, kas piemēroti pat visjutīgākajai ādai.', 'Vaksācija un epilācija Rīgā | Salons Aneri Ķengarags', 'Kāda ir atšķirība starp vaksāciju un lāzerepilāciju? Uzziniet abu metožu plusus un mīnusus, lai izvēlētos sev piemērotāko.', 'waxing', 'Skatīt vaksācijas pakalpojumu cenas');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('waxing-vs-laser', 'ru', 'Восковая депиляция против лазерной эпиляции: что выбрать', 'В чем разница между восковой депиляцией (ваксацией) и лазерной эпиляцией? Узнайте плюсы и минусы обоих методов.', 'Гладкая кожа без лишних волос — цель многих женщин (и мужчин). Два самых популярных метода для достижения этой цели — восковая депиляция (ваксация) и лазерная эпиляция. 

**Ваксация** — это быстрый и доступный метод, который удаляет волосы с корнем. Результат сохраняется от 3 до 6 недель, а со временем волоски становятся тоньше и реже. Это отличный выбор для тех, кто хочет мгновенный результат по разумной цене. 

**Лазерная эпиляция**, в свою очередь, — это долгосрочная инвестиция. Она разрушает волосяные фолликулы, значительно уменьшая рост волос в будущем. Однако для лазерной эпиляции требуется курс (обычно 6-8 процедур), и она может быть дороже. 

Салон Aneri в Кенгарагсе предлагает профессиональную и максимально безболезненную ваксацию высококачественными восками, подходящими даже для самой чувствительной кожи.', 'Ваксация и эпиляция в Риге | Салон Aneri Кенгарагс', 'В чем разница между восковой депиляцией (ваксацией) и лазерной эпиляцией? Узнайте плюсы и минусы обоих методов.', 'waxing', 'Смотреть цены на ваксацию');
INSERT OR IGNORE INTO article_translations (article_id, lang, title, summary, content, meta_title, meta_description, related_service_id, related_service_text) VALUES ('waxing-vs-laser', 'en', 'Waxing vs. Laser Hair Removal: Which to Choose', 'What is the difference between waxing and laser hair removal? Learn the pros and cons of both methods to choose the right one for you.', 'Smooth skin without unwanted hair is the goal of many women (and men). The two most popular methods to achieve this goal are waxing and laser hair removal. 

**Waxing** is a fast and affordable method that removes hair from the root. The result lasts from 3 to 6 weeks, and over time the hairs become thinner and sparser. It is a great choice for those who want an immediate result at a reasonable price. 

**Laser hair removal**, on the other hand, is a long-term investment. It destroys hair follicles, significantly reducing hair growth in the future. However, laser hair removal requires a course (usually 6-8 procedures) and can be more expensive. 

Aneri Salon in Kengarags offers professional and maximally painless waxing with high-quality waxes suitable even for the most sensitive skin.', 'Waxing and Epilation in Riga | Aneri Salon Kengarags', 'What is the difference between waxing and laser hair removal? Learn the pros and cons of both methods to choose the right one for you.', 'waxing', 'View Waxing Prices');

-- 4. Record Migration
INSERT OR IGNORE INTO schema_migrations (name) VALUES ('0003_seed_all_articles.sql');
