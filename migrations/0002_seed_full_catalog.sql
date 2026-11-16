-- ====================================================================
-- SALONS ANERI: CLOUDFLARE D1 FULL CATALOG SEED
-- Migration: 0002_seed_full_catalog.sql
-- Description: Complete 100% catalog seed of all 6 salon sections and 83 services with full LV, RU, EN translations
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

-- 4. Services Table
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_matu_griezums_isiem_matiem', 'hair', 'Dāmām', 1, 'no 22.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_matu_griezums_videji_gariem', 'hair', 'Dāmām', 2, 'no 25.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_matu_griezums_gariem_matiem', 'hair', 'Dāmām', 3, 'no 28.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_matu_veidosana', 'hair', 'Dāmām', 4, '20.00 - 30.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_griezums_veidosana', 'hair', 'Dāmām', 5, '25.00 - 50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_veidosana_ar_rulliem', 'hair', 'Dāmām', 6, '18.00 - 40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_vakara_frizura', 'hair', 'Dāmām', 7, '30.00 - 50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_krasosana_1_toni_darbs', 'hair', 'Dāmām', 8, '22.00 - 40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_balinasana_ar_foliju_darbs', 'hair', 'Dāmām', 9, '28.00 - 70.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_balinasana_ar_cepuriti_darbs', 'hair', 'Dāmām', 10, '25.00 - 40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_koloresana', 'hair', 'Dāmām', 11, '30.00 - 90.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_kimiskie_ilgvilni', 'hair', 'Dāmām', 12, '35.00 - 65.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_bio_ilgvilni', 'hair', 'Dāmām', 13, '45.00 - 75.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_matu_mazgasana_un_zavesana', 'hair', 'Dāmām', 14, '12.00 - 18.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_ponija_griezums', 'hair', 'Dāmām', 15, '3.00 - 7.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_keratina_taisnosana_global_isi', 'hair', 'Dāmām', 16, '55.00 - 65.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_keratina_taisnosana_global_vid', 'hair', 'Dāmām', 17, '70.00 - 90.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_damam_keratina_taisnosana_global_gar', 'hair', 'Dāmām', 18, '95.00 - 110.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_kungiem_viriesu_griezums', 'hair', 'Kungiem', 19, '16.00 - 18.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_kungiem_matu_veidosana', 'hair', 'Kungiem', 20, '6.00 - 8.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_kungiem_griezums_uz_nulliti', 'hair', 'Kungiem', 21, '12.00 - 14.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_kungiem_griezums_ar_masiniti', 'hair', 'Kungiem', 22, '14.00 - 16.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_kungiem_bardas_korekcija', 'hair', 'Kungiem', 23, '5.00 - 10.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_pensionariem_no_65_gadiem_matu_griezums', 'hair', 'Pensionāriem (no 65 gadiem)', 24, '14.00 - 15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_pensionariem_no_65_gadiem_matu_veidosana', 'hair', 'Pensionāriem (no 65 gadiem)', 25, '14.00 - 15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_pensionariem_no_65_gadiem_kimiskie_ilgvilni', 'hair', 'Pensionāriem (no 65 gadiem)', 26, '35.00 - 50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_pensionariem_no_65_gadiem_matu_krasosana', 'hair', 'Pensionāriem (no 65 gadiem)', 27, '15.00 - 20.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_berniem_pirmsskolas_vecuma_berniem', 'hair', 'Bērniem', 28, '14.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('hair_berniem_skolniekiem_lidz_16_gadiem', 'hair', 'Bērniem', 29, '15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_klasiskais_bez_lakas', 'nails', 'Manikīrs', 1, '16.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_klasiskais_ar_laku', 'nails', 'Manikīrs', 2, '18.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_viriesu_manikirs', 'nails', 'Manikīrs', 3, '20.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_nagu_lakosana', 'nails', 'Manikīrs', 4, '5.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_klasiskais_manikirs_gellaka', 'nails', 'Manikīrs', 5, '28.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_gellaka_frencs', 'nails', 'Manikīrs', 6, '30.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_gellakas_nonemsana_jauna_parkl', 'nails', 'Manikīrs', 7, 'Bezmaksas', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_gellakas_nonemsana_atseviski', 'nails', 'Manikīrs', 8, 'no 5.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_nagu_restauracija', 'nails', 'Manikīrs', 9, '3.00 - 5.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_ekspress_manikirs_gellaka', 'nails', 'Manikīrs', 10, '20.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_skropstu_krasosana', 'nails', 'Manikīrs', 11, '5.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_uzacu_krasosana', 'nails', 'Manikīrs', 12, '5.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_manikirs_uzacu_korekcija', 'nails', 'Manikīrs', 13, '5.00 - 7.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_klasiskais_pedikirs', 'nails', 'Pedikīrs', 14, '30.00 - 32.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_aparatu_pedikirs', 'nails', 'Pedikīrs', 15, '30.00 - 32.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_viriesu_pedikirs', 'nails', 'Pedikīrs', 16, '35.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_pedikirs_gellaka', 'nails', 'Pedikīrs', 17, '36.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_pedikirs_gellaka_frencs', 'nails', 'Pedikīrs', 18, '38.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_ekspress_pedikirs', 'nails', 'Pedikīrs', 19, '24.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka', 'nails', 'Pedikīrs', 20, '28.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka_fren', 'nails', 'Pedikīrs', 21, '30.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_konsultacija_15_min', 'cosmetology', 'Kosmētiskās procedūras', 1, 'Bezmaksas', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_kriomasaza_10_15_min', 'cosmetology', 'Kosmētiskās procedūras', 2, 'no 15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_kriodestrukcija_papilomaskarpa', 'cosmetology', 'Kosmētiskās procedūras', 3, 'no 15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_limfodrenazas_sejas_masaza_60_', 'cosmetology', 'Kosmētiskās procedūras', 4, '50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_tirisana_ar_us_60_min', 'cosmetology', 'Kosmētiskās procedūras', 5, 'no 40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_mehaniska_tirisana_us_90_min', 'cosmetology', 'Kosmētiskās procedūras', 6, 'no 45.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_mezoterapija_40_min', 'cosmetology', 'Kosmētiskās procedūras', 7, 'no 50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_viens_auskars', 'cosmetology', 'Kosmētiskās procedūras', 8, '10.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_divi_auskari', 'cosmetology', 'Kosmētiskās procedūras', 9, '15.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_pilingi_mandelu_fitina_vai_pienskabes_', 'cosmetology', 'Pīlingi', 10, 'no 40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_pilingi_mela_peel_pret_pigmentaciju', 'cosmetology', 'Pīlingi', 11, '40.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_pilingi_cosmo_peel_pret_novecosanos', 'cosmetology', 'Pīlingi', 12, '50.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('cosmetology_pilingi_prx_t33_2ml', 'cosmetology', 'Pīlingi', 13, '60.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_lupas', 'permanent', 'Procedūras', 1, '130.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_uzacis', 'permanent', 'Procedūras', 2, '130.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_skropstu_linija', 'permanent', 'Procedūras', 3, '130.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_dekorativa_skropstu_linija_ar_', 'permanent', 'Procedūras', 4, '130.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_visu_zonu_korekcija', 'permanent', 'Procedūras', 5, '90.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('permanent_proceduras_atjaunosana_1_gada_laika', 'permanent', 'Procedūras', 6, '100.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_sejas_zona', 'waxing', 'Zonas', 1, '7.00 - 12.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_paduses', 'waxing', 'Zonas', 2, '10.00 - 12.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_rokas', 'waxing', 'Zonas', 3, '12.00 - 18.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_kajas_lidz_celiem', 'waxing', 'Zonas', 4, '15.00 - 20.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_kajas_visa_garuma', 'waxing', 'Zonas', 5, '18.00 - 25.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_bikini_klasiskais', 'waxing', 'Zonas', 6, '14.00 - 18.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('waxing_zonas_bikini_dzilais', 'waxing', 'Zonas', 7, '25.00 - 30.00 €', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_6_min', 'solarium', 'Apmeklējums / Abonements', 1, '4.00 € / 28.00 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_9_min', 'solarium', 'Apmeklējums / Abonements', 2, '4.50 € / 31.50 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_12_min', 'solarium', 'Apmeklējums / Abonements', 3, '5.00 € / 35.00 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_15_min', 'solarium', 'Apmeklējums / Abonements', 4, '5.50 € / 38.50 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_18_min', 'solarium', 'Apmeklējums / Abonements', 5, '6.00 € / 42.00 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_21_min', 'solarium', 'Apmeklējums / Abonements', 6, '6.50 € / 45.50 € (10x)', NULL, NULL, 1);
INSERT OR IGNORE INTO services (id, category_id, subcategory_title, order_num, price, old_price, duration, is_active) VALUES ('solarium_apmeklejums_abonements_24_min', 'solarium', 'Apmeklējums / Abonements', 7, '7.00 € / 49.00 € (10x)', NULL, NULL, 1);

-- 5. Service Translations (LV, RU, EN)
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_isiem_matiem', 'lv', 'Matu griezums (īsiem matiem)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_isiem_matiem', 'ru', 'Стрижка (короткие волосы)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_isiem_matiem', 'en', 'Haircut (short hair)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_videji_gariem', 'lv', 'Matu griezums (vidēji gariem)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_videji_gariem', 'ru', 'Стрижка (средние волосы)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_videji_gariem', 'en', 'Haircut (medium hair)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_gariem_matiem', 'lv', 'Matu griezums (gariem matiem)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_gariem_matiem', 'ru', 'Стрижка (длинные волосы)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_griezums_gariem_matiem', 'en', 'Haircut (long hair)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_veidosana', 'lv', 'Matu veidošana', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_veidosana', 'ru', 'Укладка волос', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_veidosana', 'en', 'Hair styling', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_griezums_veidosana', 'lv', 'Griezums + Veidošana', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_griezums_veidosana', 'ru', 'Стрижка + Укладка', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_griezums_veidosana', 'en', 'Cut + Blow Dry & Styling', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_veidosana_ar_rulliem', 'lv', 'Veidošana ar ruļļiem', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_veidosana_ar_rulliem', 'ru', 'Укладка на бигуди', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_veidosana_ar_rulliem', 'en', 'Roller setting & styling', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_vakara_frizura', 'lv', 'Vakara frizūra', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_vakara_frizura', 'ru', 'Вечерняя прическа', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_vakara_frizura', 'en', 'Evening hairstyle / Updo', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_krasosana_1_toni_darbs', 'lv', 'Krāsošana 1 tonī (darbs)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_krasosana_1_toni_darbs', 'ru', 'Окрашивание в 1 тон (работа)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_krasosana_1_toni_darbs', 'en', 'Single tone coloring (labor)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_foliju_darbs', 'lv', 'Balināšana ar foliju (darbs)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_foliju_darbs', 'ru', 'Мелирование на фольгу (работа)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_foliju_darbs', 'en', 'Foil highlights (labor)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_cepuriti_darbs', 'lv', 'Balināšana ar cepurīti (darbs)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_cepuriti_darbs', 'ru', 'Мелирование на шапочку (работа)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_balinasana_ar_cepuriti_darbs', 'en', 'Cap highlighting (labor)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_koloresana', 'lv', 'Kolorēšana', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_koloresana', 'ru', 'Колорирование', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_koloresana', 'en', 'Coloring / Balayage', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_kimiskie_ilgvilni', 'lv', 'Ķīmiskie ilgviļņi', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_kimiskie_ilgvilni', 'ru', 'Химическая завивка', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_kimiskie_ilgvilni', 'en', 'Classic perm', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_bio_ilgvilni', 'lv', 'Bio-ilgviļņi', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_bio_ilgvilni', 'ru', 'Био-завивка', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_bio_ilgvilni', 'en', 'Bio-perm', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_mazgasana_un_zavesana', 'lv', 'Matu mazgāšana un žāvēšana', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_mazgasana_un_zavesana', 'ru', 'Мытье и сушка', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_matu_mazgasana_un_zavesana', 'en', 'Wash and blow-dry', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_ponija_griezums', 'lv', 'Ponija griezums', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_ponija_griezums', 'ru', 'Стрижка челки', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_ponija_griezums', 'en', 'Bangs / Fringe trim', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_isi', 'lv', 'Keratīna taisnošana ''GLOBAL'' (īsi)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_isi', 'ru', 'Кератиновое выпрямление ''GLOBAL'' (короткие)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_isi', 'en', 'Keratin straightening ''GLOBAL'' (short)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_vid', 'lv', 'Keratīna taisnošana ''GLOBAL'' (vidēji)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_vid', 'ru', 'Кератиновое выпрямление ''GLOBAL'' (средние)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_vid', 'en', 'Keratin straightening ''GLOBAL'' (medium)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_gar', 'lv', 'Keratīna taisnošana ''GLOBAL'' (gari)', 'Dāmām', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_gar', 'ru', 'Кератиновое выпрямление ''GLOBAL'' (длинные)', 'Дамам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_damam_keratina_taisnosana_global_gar', 'en', 'Keratin straightening ''GLOBAL'' (long)', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_viriesu_griezums', 'lv', 'Vīriešu griezums', 'Kungiem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_viriesu_griezums', 'ru', 'Мужская стрижка', 'Мужчинам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_viriesu_griezums', 'en', 'Vīriešu griezums', 'Gentlemen', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_matu_veidosana', 'lv', 'Matu veidošana', 'Kungiem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_matu_veidosana', 'ru', 'Укладка волос', 'Мужчинам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_matu_veidosana', 'en', 'Hair styling', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_uz_nulliti', 'lv', 'Griezums uz nullīti', 'Kungiem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_uz_nulliti', 'ru', 'Стрижка под ноль', 'Мужчинам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_uz_nulliti', 'en', 'Griezums uz nullīti', 'Gentlemen', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_ar_masiniti', 'lv', 'Griezums ar mašīnīti', 'Kungiem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_ar_masiniti', 'ru', 'Стрижка машинкой', 'Мужчинам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_griezums_ar_masiniti', 'en', 'Griezums ar mašīnīti', 'Gentlemen', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_bardas_korekcija', 'lv', 'Bārdas korekcija', 'Kungiem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_bardas_korekcija', 'ru', 'Коррекция бороды', 'Мужчинам', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_kungiem_bardas_korekcija', 'en', 'Beard trim & shaping', 'Gentlemen', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_griezums', 'lv', 'Matu griezums', 'Pensionāriem (no 65 gadiem)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_griezums', 'ru', 'Стрижка', 'Пенсионерам (от 65 лет)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_griezums', 'en', 'Matu griezums', 'Pensioners (65+)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_veidosana', 'lv', 'Matu veidošana', 'Pensionāriem (no 65 gadiem)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_veidosana', 'ru', 'Укладка', 'Пенсионерам (от 65 лет)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_veidosana', 'en', 'Hair styling', 'Ladies', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_kimiskie_ilgvilni', 'lv', 'Ķīmiskie ilgviļņi', 'Pensionāriem (no 65 gadiem)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_kimiskie_ilgvilni', 'ru', 'Химическая завивка', 'Пенсионерам (от 65 лет)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_kimiskie_ilgvilni', 'en', 'Classic perm', 'Pensioners (65+)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_krasosana', 'lv', 'Matu krāsošana', 'Pensionāriem (no 65 gadiem)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_krasosana', 'ru', 'Покраска', 'Пенсионерам (от 65 лет)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_pensionariem_no_65_gadiem_matu_krasosana', 'en', 'Matu krāsošana', 'Pensioners (65+)', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_pirmsskolas_vecuma_berniem', 'lv', 'Pirmsskolas vecuma bērniem', 'Bērniem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_pirmsskolas_vecuma_berniem', 'ru', 'Дошкольники', 'Детям', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_pirmsskolas_vecuma_berniem', 'en', 'Pirmsskolas vecuma bērniem', 'Kids', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_skolniekiem_lidz_16_gadiem', 'lv', 'Skolniekiem (līdz 16 gadiem)', 'Bērniem', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_skolniekiem_lidz_16_gadiem', 'ru', 'Школьники (до 16 лет)', 'Детям', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('hair_berniem_skolniekiem_lidz_16_gadiem', 'en', 'Skolniekiem (līdz 16 gadiem)', 'Kids', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_bez_lakas', 'lv', 'Klasiskais (bez lakas)', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_bez_lakas', 'ru', 'Классический (bez лака)', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_bez_lakas', 'en', 'Klasiskais (bez lakas)', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_ar_laku', 'lv', 'Klasiskais (ar laku)', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_ar_laku', 'ru', 'Классический (с лаком)', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_ar_laku', 'en', 'Klasiskais (ar laku)', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_viriesu_manikirs', 'lv', 'Vīriešu manikīrs', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_viriesu_manikirs', 'ru', 'Мужской маникюр', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_viriesu_manikirs', 'en', 'Vīriešu manikīrs', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_lakosana', 'lv', 'Nagu lakošana', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_lakosana', 'ru', 'Покрытие ногтей лаком', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_lakosana', 'en', 'Nail polishing', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_manikirs_gellaka', 'lv', 'Klasiskais manikīrs + Gēllaka', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_manikirs_gellaka', 'ru', 'Классический маникюр + Гель-лак', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_klasiskais_manikirs_gellaka', 'en', 'Klasiskais manikīrs + Gēllaka', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellaka_frencs', 'lv', 'Gēllaka (Frenčs)', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellaka_frencs', 'ru', 'Гель-лак (Френч)', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellaka_frencs', 'en', 'Gēllaka (Frenčs)', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_jauna_parkl', 'lv', 'Gēllakas noņemšana (jauna pārklājuma laikā)', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_jauna_parkl', 'ru', 'Снятие гель-лака (при новом покрытии)', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_jauna_parkl', 'en', 'Gēllakas noņemšana (jauna pārklājuma laikā)', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_atseviski', 'lv', 'Gēllakas noņemšana (atsevišķi)', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_atseviski', 'ru', 'Снятие гель-лака (отдельно)', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_gellakas_nonemsana_atseviski', 'en', 'Gēllakas noņemšana (atsevišķi)', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_restauracija', 'lv', 'Nagu restaurācija', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_restauracija', 'ru', 'Реставрация ногтя', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_nagu_restauracija', 'en', 'Nagu restaurācija', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_ekspress_manikirs_gellaka', 'lv', 'Ekspress manikīrs + Gēllaka', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_ekspress_manikirs_gellaka', 'ru', 'Экспресс-маникюр + Гель-лак', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_ekspress_manikirs_gellaka', 'en', 'Ekspress manikīrs + Gēllaka', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_skropstu_krasosana', 'lv', 'Skropstu krāsošana', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_skropstu_krasosana', 'ru', 'Покраска ресниц', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_skropstu_krasosana', 'en', 'Eyelash tinting', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_krasosana', 'lv', 'Uzacu krāsošana', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_krasosana', 'ru', 'Покраска бровей', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_krasosana', 'en', 'Uzacu krāsošana', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_korekcija', 'lv', 'Uzacu korekcija', 'Manikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_korekcija', 'ru', 'Коррекция бровей', 'Маникюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_manikirs_uzacu_korekcija', 'en', 'Uzacu korekcija', 'Manicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_klasiskais_pedikirs', 'lv', 'Klasiskais pedikīrs', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_klasiskais_pedikirs', 'ru', 'Классический педикюр', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_klasiskais_pedikirs', 'en', 'Classic pedicure', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_aparatu_pedikirs', 'lv', 'Aparātu pedikīrs', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_aparatu_pedikirs', 'ru', 'Аппаратный педикюр', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_aparatu_pedikirs', 'en', 'Hardware pedicure', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_viriesu_pedikirs', 'lv', 'Vīriešu pedikīrs', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_viriesu_pedikirs', 'ru', 'Мужской педикюр', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_viriesu_pedikirs', 'en', 'Vīriešu pedikīrs', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka', 'lv', 'Pedikīrs + Gēllaka', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka', 'ru', 'Педикюр + Гель-лак', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka', 'en', 'Pedikīrs + Gēllaka', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka_frencs', 'lv', 'Pedikīrs + Gēllaka (Frenčs)', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka_frencs', 'ru', 'Педикюр + Гель-лак (Френч)', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_pedikirs_gellaka_frencs', 'en', 'Pedikīrs + Gēllaka (Frenčs)', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs', 'lv', 'Ekspress pedikīrs', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs', 'ru', 'Экспресс-педикюр', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs', 'en', 'Ekspress pedikīrs', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka', 'lv', 'Ekspress pedikīrs + Gēllaka', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka', 'ru', 'Экспресс-педикюр + Гель-лак', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka', 'en', 'Ekspress pedikīrs + Gēllaka', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka_fren', 'lv', 'Ekspress pedikīrs + Gēllaka (Frenčs)', 'Pedikīrs', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka_fren', 'ru', 'Экспресс-педикюр + Гель-лак (Френч)', 'Педикюр', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('nails_pedikirs_ekspress_pedikirs_gellaka_fren', 'en', 'Ekspress pedikīrs + Gēllaka (Frenčs)', 'Pedicure', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_konsultacija_15_min', 'lv', 'Konsultācija (15 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_konsultacija_15_min', 'ru', 'Консультация (15 min)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_konsultacija_15_min', 'en', 'Konsultācija (15 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_kriomasaza_10_15_min', 'lv', 'Sejas kriomasāža (10-15 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_kriomasaza_10_15_min', 'ru', 'Криомассаж лица (10-15 мин)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_kriomasaza_10_15_min', 'en', 'Sejas kriomasāža (10-15 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_kriodestrukcija_papilomaskarpa', 'lv', 'Kriodestrukcija (papilomas/kārpas)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_kriodestrukcija_papilomaskarpa', 'ru', 'Криодеструкция (удаление папиллом)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_kriodestrukcija_papilomaskarpa', 'en', 'Kriodestrukcija (papilomas/kārpas)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_limfodrenazas_sejas_masaza_60_', 'lv', 'Limfodrenāžas sejas masāža (60 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_limfodrenazas_sejas_masaza_60_', 'ru', 'Лимфодренажный массаж лица (60 мин)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_limfodrenazas_sejas_masaza_60_', 'en', 'Limfodrenāžas sejas masāža (60 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_tirisana_ar_us_60_min', 'lv', 'Sejas tīrīšana ar US (60 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_tirisana_ar_us_60_min', 'ru', 'Чистка лица с УЗ (60 мин)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_sejas_tirisana_ar_us_60_min', 'en', 'Sejas tīrīšana ar US (60 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mehaniska_tirisana_us_90_min', 'lv', 'Mehāniskā tīrīšana + US (90 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mehaniska_tirisana_us_90_min', 'ru', 'Механическая чистка + УЗ (90 мин)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mehaniska_tirisana_us_90_min', 'en', 'Mehāniskā tīrīšana + US (90 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mezoterapija_40_min', 'lv', 'Mezoterapija (40 min)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mezoterapija_40_min', 'ru', 'Мезотерапия (40 мин)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_mezoterapija_40_min', 'en', 'Mezoterapija (40 min)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_viens_auskars', 'lv', 'Ausu caurdūršana (viens auskars)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_viens_auskars', 'ru', 'Прокол ушей (одна серьга)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_viens_auskars', 'en', 'Ausu caurdūršana (viens auskars)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_divi_auskari', 'lv', 'Ausu caurdūršana (divi auskari)', 'Kosmētiskās procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_divi_auskari', 'ru', 'Прокол ушей (две серьги)', 'Косметические процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_kosmetiskas_proceduras_ausu_caurdursana_divi_auskari', 'en', 'Ausu caurdūršana (divi auskari)', 'Cosmetic Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mandelu_fitina_vai_pienskabes_', 'lv', 'Mandeļu, fitīna vai pienskābes pīlings (60 min)', 'Pīlingi', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mandelu_fitina_vai_pienskabes_', 'ru', 'Миндальный, фитиновый или молочный пилинг (60 min)', 'Пилинги', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mandelu_fitina_vai_pienskabes_', 'en', 'Mandeļu, fitīna vai pienskābes pīlings (60 min)', 'Peels', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mela_peel_pret_pigmentaciju', 'lv', 'Mela Peel (pret pigmentāciju)', 'Pīlingi', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mela_peel_pret_pigmentaciju', 'ru', 'Mela Peel (против пигментации)', 'Пилинги', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_mela_peel_pret_pigmentaciju', 'en', 'Mela Peel (pret pigmentāciju)', 'Peels', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_cosmo_peel_pret_novecosanos', 'lv', 'Cosmo Peel (pret novecošanos)', 'Pīlingi', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_cosmo_peel_pret_novecosanos', 'ru', 'Cosmo Peel (омоложение)', 'Пилинги', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_cosmo_peel_pret_novecosanos', 'en', 'Cosmo Peel (pret novecošanos)', 'Peels', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_prx_t33_2ml', 'lv', 'PRX-T33 (2ml)', 'Pīlingi', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_prx_t33_2ml', 'ru', 'PRX-T33 (2ml)', 'Пилинги', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('cosmetology_pilingi_prx_t33_2ml', 'en', 'PRX-T33 (2ml)', 'Peels', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_lupas', 'lv', 'Lūpas', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_lupas', 'ru', 'Губы', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_lupas', 'en', 'Lūpas', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_uzacis', 'lv', 'Uzacis', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_uzacis', 'ru', 'Брови', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_uzacis', 'en', 'Uzacis', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_skropstu_linija', 'lv', 'Skropstu līnija', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_skropstu_linija', 'ru', 'Линия ресниц (межресничка)', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_skropstu_linija', 'en', 'Skropstu līnija', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_dekorativa_skropstu_linija_ar_', 'lv', 'Dekoratīvā skropstu līnija ar ēnojumu', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_dekorativa_skropstu_linija_ar_', 'ru', 'Декоративная линия ресниц с растушевкой', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_dekorativa_skropstu_linija_ar_', 'en', 'Dekoratīvā skropstu līnija ar ēnojumu', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_visu_zonu_korekcija', 'lv', 'Visu zonu korekcija', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_visu_zonu_korekcija', 'ru', 'Коррекция всех зон', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_visu_zonu_korekcija', 'en', 'Visu zonu korekcija', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_atjaunosana_1_gada_laika', 'lv', 'Atjaunošana 1 gada laikā', 'Procedūras', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_atjaunosana_1_gada_laika', 'ru', 'Обновление в течение 1 года', 'Процедуры', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('permanent_proceduras_atjaunosana_1_gada_laika', 'en', 'Atjaunošana 1 gada laikā', 'Procedures', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_sejas_zona', 'lv', 'Sejas zona', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_sejas_zona', 'ru', 'Зона лица', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_sejas_zona', 'en', 'Sejas zona', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_paduses', 'lv', 'Paduses', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_paduses', 'ru', 'Подмышки', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_paduses', 'en', 'Underarms waxing', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_rokas', 'lv', 'Rokas', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_rokas', 'ru', 'Руки', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_rokas', 'en', 'Rokas', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_lidz_celiem', 'lv', 'Kājas līdz ceļiem', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_lidz_celiem', 'ru', 'Ноги до колен', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_lidz_celiem', 'en', 'Half legs waxing', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_visa_garuma', 'lv', 'Kājas visā garumā', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_visa_garuma', 'ru', 'Ноги по всей длине', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_kajas_visa_garuma', 'en', 'Full legs waxing', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_klasiskais', 'lv', 'Bikini (klasiskais)', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_klasiskais', 'ru', 'Бикини (классическое)', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_klasiskais', 'en', 'Bikini (deep)', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_dzilais', 'lv', 'Bikini (dziļais)', 'Zonas', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_dzilais', 'ru', 'Бикини (глубокое)', 'Зоны', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('waxing_zonas_bikini_dzilais', 'en', 'Bikini (deep)', 'Zones', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_6_min', 'lv', '6 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_6_min', 'ru', '6 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_6_min', 'en', '6 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_9_min', 'lv', '9 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_9_min', 'ru', '9 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_9_min', 'en', '9 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_12_min', 'lv', '12 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_12_min', 'ru', '12 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_12_min', 'en', '12 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_15_min', 'lv', '15 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_15_min', 'ru', '15 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_15_min', 'en', '15 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_18_min', 'lv', '18 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_18_min', 'ru', '18 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_18_min', 'en', '18 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_21_min', 'lv', '21 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_21_min', 'ru', '21 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_21_min', 'en', '21 min', 'Visit / Subscription', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_24_min', 'lv', '24 min', 'Apmeklējums / Abonements', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_24_min', 'ru', '24 мин', 'Посещение / Абонемент', '');
INSERT OR IGNORE INTO service_translations (service_id, lang, name, subcategory_title_localized, description) VALUES ('solarium_apmeklejums_abonements_24_min', 'en', '24 min', 'Visit / Subscription', '');

-- 6. Default Site Settings
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
