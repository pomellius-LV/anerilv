import { Language, View } from '../types';

export type ServiceSectionId =
  | 'hair'
  | 'nails'
  | 'cosmetology'
  | 'permanent'
  | 'waxing'
  | 'solarium';

export interface ThematicServiceSeo {
  id: ServiceSectionId;
  slugs: Record<Language, string>;
  cardLabels: Record<Language, string>;
  titles: Record<Language, string>;
  descriptions: Record<Language, string>;
  keywords: Record<Language, string>;
  h1: Record<Language, string>;
  subtitles: Record<Language, string>;
  intro: Record<Language, string>;
  highlights: Record<Language, Array<{ title: string; text: string }>>;
  faqs: Record<Language, Array<{ question: string; answer: string }>>;
  relatedArticleIds: string[];
}

export const SERVICE_SECTION_IDS: ServiceSectionId[] = [
  'hair',
  'nails',
  'cosmetology',
  'permanent',
  'waxing',
  'solarium'
];

export const THEMATIC_SERVICES_SEO: Record<ServiceSectionId, ThematicServiceSeo> = {
  hair: {
    id: 'hair',
    slugs: {
      lv: 'frizetava-riga',
      ru: 'parikmaherskaya-riga',
      en: 'hair-salon-riga'
    },
    cardLabels: {
      lv: 'Frizētava Rīgā',
      ru: 'Парикмахерская в Риге',
      en: 'Hair Salon in Riga'
    },
    titles: {
      lv: 'Frizētava Rīgā – Griezumi, Airtouch un Krāsošana | Salons Aneri',
      ru: 'Парикмахерская в Риге – Стрижки, Airtouch, Окрашивание | Салон Aneri',
      en: 'Hair Salon in Riga – Haircuts, Airtouch & Keratin | Aneri Salon'
    },
    descriptions: {
      lv: 'Frizētava Rīgā visiem rajoniem: dāmu, vīriešu un bērnu griezumi, Airtouch, Balayage, keratīns. Ērta piebraukšana un bezmaksas stāvvieta pie ieejas. +371 27580047.',
      ru: 'Парикмахерская в Риге для клиентов со всего города: стрижки, Airtouch, балаяж, кератин GLOBAL. Удобный заезд, трамвай 7 и бесплатная парковка у входа. +371 27580047.',
      en: 'Professional hair salon in Riga: haircuts, Airtouch, Balayage, and keratin treatments. Easy city-wide access via tram 7 and free parking at the door. +371 27580047.'
    },
    keywords: {
      lv: 'frizētava Rīgā, frizieris Rīga, lētas frizētavas Rīgā, matu krāsošana Rīgā, Airtouch Rīga, frizētava bezmaksas stāvvieta, Ķengarags',
      ru: 'парикмахерская в Риге, парикмахер Рига, стрижка Рига, покраска волос Airtouch Рига, парикмахерская бесплатная парковка, Кенгарагс',
      en: 'hair salon Riga, hairdresser Riga, Airtouch Riga, keratin Riga, beauty salon free parking'
    },
    h1: {
      lv: 'Frizētava Rīgā – Griezumi, Krāsošana un Matu Kopšana',
      ru: 'Парикмахерская в Риге – Стрижки, Окрашивание и Уход',
      en: 'Hair Salon in Riga – Haircuts, Coloring & Keratin'
    },
    subtitles: {
      lv: 'Profesionāli frizieri klientiem no visas Rīgas — ar bezmaksas privātu stāvvietu pie salona.',
      ru: 'Профессиональные парикмахеры для клиентов со всей Риги — с собственной бесплатной парковкой у входа.',
      en: 'Experienced hairstylists serving all of Riga with convenient free private parking right at the salon.'
    },
    intro: {
      lv: 'Salons Aneri uzņem klientus no visas Rīgas — centra, Pļavniekiem, Purvciema, Imantas un Ķengaraga. Pie mums pieejami precīzi sieviešu, vīriešu un bērnu matu griezumi, modernas krāsošanas tehnikas (Airtouch, Balayage, kolorēšana), ilgviļņi un "GLOBAL" keratīna taisnošana par godīgām cenām bez centra autostāvvietu izmaksām.',
      ru: 'В салон Aneri приезжают клиенты со всех районов Риги — из центра, Плявниеков, Пурвциемса и Кенгарагса. Мы выполняем женские, мужские и детские стрижки, сложное окрашивание (Airtouch, шатуш, балаяж), мелирование, био-завивку и кератиновое выпрямление GLOBAL на косметике Matrix и L\'Oreal без переплат и с бесплатной парковкой у дверей.',
      en: 'Clients visit Aneri Salon from all across Riga thanks to consistent results with Matrix and L\'Oreal Professional products, fair prices, and stress-free free private parking right outside Latgales iela 264.'
    },
    highlights: {
      lv: [
        { title: 'Bezmaksas stāvvieta Rīgā', text: 'Privāta autostāvvieta tieši pie salona ieejas Latgales ielā 264 — bez Rīgas centra stāvvietu maksas.' },
        { title: 'Ērta satiksme no jebkura rajona', text: 'Tiešs 7. tramvajs no centra un autobusi 15, 18, 31, 49, 60 pie TC Dole / Mego.' },
        { title: 'Matrix un L\'Oreal kvalitāte', text: 'Saudzīgas krāsas, Airtouch un keratīna procedūras ar vairāk nekā 15 gadu pieredzi.' }
      ],
      ru: [
        { title: 'Бесплатная парковка у входа', text: 'Собственная парковка на ул. Латгалес 264 — не нужно искать место и платить за стоянку в центре Риги.' },
        { title: 'Удобно ехать из любой части Риги', text: 'Прямой 7-й трамвай от центра и автобусы 15, 18, 31, 49, 60 до остановки ТЦ Доле.' },
        { title: 'Косметика Matrix и L\'Oreal', text: 'Проверенные материалы и мастера с опытом более 15 лет в женских, мужских и детских стрижках.' }
      ],
      en: [
        { title: 'Free Private Parking in Riga', text: 'Park right in front of the salon at Latgales iela 264 without paid city parking zones.' },
        { title: 'Easy Access City-Wide', text: 'Direct Tram 7 from Riga center and buses 15, 18, 31, 49, 60 stopping next to TC Dole.' },
        { title: 'Matrix & L\'Oreal Professional', text: 'Over 15 years of experience in precision cuts, Airtouch, coloring, and keratin care.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Vai pie frizētavas Rīgā ir bezmaksas stāvvieta?', answer: 'Jā, klientiem no jebkura Rīgas rajona tieši pie Salons Aneri ieejas Latgales ielā 264 ir pieejama bezmaksas privātā stāvvieta.' },
        { question: 'Kādas krāsošanas tehnikas piedāvājat?', answer: 'Veicam gan klasisko krāsošanu 1 tonī un šķipsnas ar foliju, gan sarežģītas tehnikas: Airtouch, Balayage, kolorēšanu un tonēšanu.' },
        { question: 'Cik maksā vīriešu un sieviešu griezums?', answer: 'Vīriešu griezums maksā 16.00 - 18.00 €, dāmu griezumi no 22.00 €, bet pensionāriem (65+) 14.00 - 15.00 €.' }
      ],
      ru: [
        { question: 'Есть ли бесплатная парковка для клиентов из других районов Риги?', answer: 'Да, прямо перед входом в салон на ул. Латгалес 264 есть бесплатная частная парковка для наших гостей.' },
        { question: 'Какие виды окрашивания и ухода за волосами вы делаете?', answer: 'Окрашивание в 1 тон, мелирование, колорирование, Airtouch, балаяж, био-завивка и кератиновое выпрямление GLOBAL.' },
        { question: 'Как добраться до салона из центра Риги?', answer: 'На машине 12–15 минут по ул. Латгалес или прямым 7-м трамваем до ТЦ Доле / Mego.' }
      ],
      en: [
        { question: 'Is parking free for visitors coming from across Riga?', answer: 'Yes, we provide free private parking directly in front of our entrance at Latgales iela 264.' },
        { question: 'Do you perform complex hair coloring like Airtouch?', answer: 'Yes, our stylists perform single-tone coloring, foil highlights, Airtouch, Balayage, and keratin straightening.' }
      ]
    },
    relatedArticleIds: ['beauty-salon-kengarags', 'haircare', 'hair-loss', 'keratin-vs-botox']
  },

  nails: {
    id: 'nails',
    slugs: {
      lv: 'manikirs-pedikirs-riga',
      ru: 'manikyur-pedikyur-riga',
      en: 'manicure-pedicure-riga'
    },
    cardLabels: {
      lv: 'Manikīrs un Pedikīrs Rīgā',
      ru: 'Маникюр и Педикюр в Риге',
      en: 'Manicure & Pedicure Riga'
    },
    titles: {
      lv: 'Manikīrs un Pedikīrs Rīgā – Gēllaka, Aparātu Pedikīrs | Aneri',
      ru: 'Маникюр и Педикюр в Риге – Гель-лак, Аппаратный | Салон Aneri',
      en: 'Manicure & Pedicure in Riga – Gelish & Hardware Pedicure | Aneri'
    },
    descriptions: {
      lv: 'Profesionāls manikīrs un pedikīrs Rīgā: Gelish pārklājums no 20 €, klasiskais un aparātu pedikīrs, vīriešu pedikīrs. Ērta stāvvieta, +371 27580047.',
      ru: 'Маникюр и педикюр в Риге: стойкое покрытие Gelish, аппаратный и классический педикюр, мужской уход. Стерильность и бесплатная парковка. +371 27580047.',
      en: 'Clean, long-lasting manicure and hardware pedicure in Riga: Gelish polish, French manicure, men\'s nail care. Free parking at Latgales iela 264.'
    },
    keywords: {
      lv: 'manikīrs Rīgā, gēllaka Rīga, aparātu pedikīrs Rīga, vīriešu manikīrs Rīgā, pedikīrs cenas Rīga',
      ru: 'маникюр Рига, гель-лак в Риге, аппаратный педикюр Рига, мужской педикюр Рига, цены маникюр',
      en: 'manicure Riga, gel polish Riga, hardware pedicure Riga, nail salon Riga'
    },
    h1: {
      lv: 'Manikīrs un Pedikīrs Rīgā – Gelish un Aparātu Kopšana',
      ru: 'Маникюр и Педикюр в Риге – Гель-лак и Аппаратный Уход',
      en: 'Manicure & Pedicure in Riga – Gelish & Hardware Care'
    },
    subtitles: {
      lv: 'Sterili instrumenti, noturīga gēllaka 3–4 nedēļas un brīva bezmaksas stāvvieta visiem Rīgas klientiem.',
      ru: 'Стерильные инструменты, стойкость гель-лака 3–4 недели и бесплатная парковка для гостей со всей Риги.',
      en: 'Medical-grade sterilization, 3–4 week Gelish wear, and free parking right outside for guests from across Riga.'
    },
    intro: {
      lv: 'Mūsu nagu kopšanas kabinets Rīgā piedāvā klasisko, vīriešu un ekspress manikīru, Gelish pārklājumu, franču manikīru, kā arī klasisko un aparātu pedikīru. Rūpīga instrumentu dezinfekcija un pārbaudīti materiāli nodrošina perfektu rezultātu bez pārmaksām.',
      ru: 'Кабинет ногтевого сервиса Salons Aneri приглашает жителей всей Риги на классический и мужской маникюр, стойкое покрытие гель-лаком (Gelish), френч, а также классический и аппаратный педикюр. Все инструменты проходят строгую стерилизацию.',
      en: 'Our nail studio welcomes guests from all over Riga for classic manicure, long-wear Gelish, French nails, and hygienic hardware or classic pedicure.'
    },
    highlights: {
      lv: [
        { title: 'Noturība 3–4 nedēļas', text: 'Profesionāla nagu sagatavošana un kvalitatīvas Gelish bāzes bez atslāņošanās.' },
        { title: 'Klasiskais un aparātu pedikīrs', text: 'Droša pēdu un papēžu apstrāde gan dāmām, gan kungiem.' },
        { title: 'Bezmaksas stāvvieta pie salona', text: 'Ērti piebraukt no jebkuras Rīgas apkaimes bez centra sastrēgumiem.' }
      ],
      ru: [
        { title: 'Носкость гель-лака 3–4 недели', text: 'Аккуратная обработка кутикулы и прочные базы Gelish без сколов.' },
        { title: 'Классический и аппаратный педикюр', text: 'Тщательный уход за стопами, включая мужской педикюр и экспресс-процедуры.' },
        { title: 'Удобный заезд из всей Риги', text: 'Бесплатная парковка прямо у входа и прямая линия 7-го трамвая.' }
      ],
      en: [
        { title: '3–4 Weeks Chip-Free Wear', text: 'Careful nail prep and premium Gelish coatings for lasting shine.' },
        { title: 'Hardware & Classic Pedicure', text: 'Hygienic foot treatment for women and men.' },
        { title: 'Free Parking at Entrance', text: 'Easy drive from Riga center without paid parking fees.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Vai gēllakas noņemšana pirms jauna pārklājuma ir bez maksas?', answer: 'Jā, noņemot iepriekšējo gēllaku pie jauna pārklājuma uzklāšanas, noņemšana mūsu salonā ir bez maksas.' },
        { question: 'Vai piedāvājat aparātu pedikīru un vīriešu manikīru?', answer: 'Jā, piedāvājam gan klasisko, gan aparātu pedikīru, kā arī vīriešu manikīru (20.00 €) un vīriešu pedikīru (35.00 €).' }
      ],
      ru: [
        { question: 'Сколько стоит снятие гель-лака перед новым покрытием?', answer: 'При выполнении нового покрытия снятие старого гель-лака делается бесплатно.' },
        { question: 'Делаете ли вы аппаратный и мужской педикюр?', answer: 'Да, выполняем классический и аппаратный педикюр (30.00 - 32.00 €), а также мужской маникюр и педикюр.' }
      ],
      en: [
        { question: 'Is old Gelish removal included with a new manicure?', answer: 'Yes, removal before applying a new Gelish coat is free of charge.' },
        { question: 'Do you offer hardware and men\'s pedicure?', answer: 'Yes, both classic and hardware pedicure as well as dedicated men\'s manicure and pedicure are available.' }
      ]
    },
    relatedArticleIds: ['manicure-tips', 'hardware-pedicure', 'nail-trends']
  },

  cosmetology: {
    id: 'cosmetology',
    slugs: {
      lv: 'kosmetologija-riga',
      ru: 'kosmetologiya-riga',
      en: 'cosmetology-riga'
    },
    cardLabels: {
      lv: 'Kosmetoloģija Rīgā',
      ru: 'Косметология в Риге',
      en: 'Cosmetology Riga'
    },
    titles: {
      lv: 'Kosmetoloģija Rīgā – Sejas Tīrīšana, Pīlingi, PRX-T33 | Aneri',
      ru: 'Косметология в Риге – Чистка Лица, Пилинги PRX-T33 | Aneri',
      en: 'Cosmetology in Riga – Facial Cleansing & Peels | Aneri Salon'
    },
    descriptions: {
      lv: 'Kosmetologs Rīgā: ultraskaņas un mehāniskā sejas tīrīšana, PRX-T33, mandeļu pīlings, mezoterapija, kriomasāža. Bezmaksas konsultācija un stāvvieta.',
      ru: 'Косметолог в Риге: ультразвуковая и комбинированная чистка лица, пилинг PRX-T33, мезотерапия, криомассаж, прокол ушей. Бесплатная парковка. +371 27580047.',
      en: 'Facial cleansing, PRX-T33 and almond peels, mesotherapy, cryotherapy, and ear piercing in Riga with free private parking.'
    },
    keywords: {
      lv: 'kosmetologs Rīgā, sejas tīrīšana Rīgā, PRX-T33 Rīga, pīlings Rīgā, ausu caurdūršana Rīgā',
      ru: 'косметолог в Риге, чистка лица Рига, пилинг PRX-T33 Рига, мезотерапия Рига, прокол ушей Рига',
      en: 'cosmetologist Riga, facial cleansing Riga, PRX-T33 peel Riga, mesotherapy Riga'
    },
    h1: {
      lv: 'Kosmetoloģija Rīgā – Sejas Tīrīšana un Pīlingi',
      ru: 'Косметология в Риге – Чистка Лица, Пилинги и Мезотерапия',
      en: 'Cosmetology in Riga – Facial Cleansing & Peels'
    },
    subtitles: {
      lv: 'Sertificēts kosmetologs Rīgā ar individuālu pieeju, bezmaksas konsultāciju un brīvu stāvvietu.',
      ru: 'Сертифицированный косметолог в Риге: бесплатная 15-минутная консультация и удобная парковка.',
      en: 'Certified aesthetic cosmetology with complimentary consultation and free parking in Riga.'
    },
    intro: {
      lv: 'Salons Aneri kosmetoloģijas kabinetā visiem Rīgas iedzīvotājiem pieejama ultraskaņas un mehāniskā sejas tīrīšana, limfodrenāžas masāža, PRX-T33 biorevitalizācija, skābju pīlingi, mezoterapija un krio procedūras.',
      ru: 'В кабинете косметологии Salons Aneri для клиентов со всей Риги проводятся ультразвуковая и комбинированная чистка лица, пилинги PRX-T33 / Cosmo Peel / Mela Peel, мезотерапия, криомассаж, удаление папиллом и прокол ушей.',
      en: 'Offering ultrasound and combined facial cleansing, medical chemical peels including PRX-T33, mesotherapy, facial lymphatic drainage massage, and ear piercing.'
    },
    highlights: {
      lv: [
        { title: 'Bezmaksas konsultācija (15 min)', text: 'Kosmetologs palīdzēs piemeklēt tieši Jūsu ādas tipam piemērotāko procedūru.' },
        { title: 'Medicīniskās klases pīlingi', text: 'Mandeļu, pienskābes, Mela Peel, Cosmo Peel un PRX-T33 efektīvai ādas atjaunošanai.' },
        { title: 'Mierīga vide un stāvvieta', text: 'Nav jāmaksā par auto novietošanu — piebrauciet pie pašām durvīm.' }
      ],
      ru: [
        { title: 'Бесплатная консультация 15 минут', text: 'Подбор чистки, пилинга или курса мезотерапии строго под ваш тип кожи.' },
        { title: 'Эффективные пилинги PRX-T33', text: 'Миндальный, молочный, фитиновый, Cosmo Peel и Mela Peel без длительной реабилитации.' },
        { title: 'Приём гостей со всей Риги', text: 'Бесплатная частная парковка и 7-й трамвай прямо возле салона.' }
      ],
      en: [
        { title: 'Free 15-Min Consultation', text: 'Tailored facial and peel recommendations for your exact skin needs.' },
        { title: 'PRX-T33 & Acid Peels', text: 'Effective revitalization and pigmentation treatments without downtime.' },
        { title: 'Convenient Riga Location', text: 'Private free parking right outside on Latgales iela 264.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Kura sejas tīrīšana man ir piemērotāka — US vai mehāniskā?', answer: 'Pirms procedūras kosmetologs veic bezmaksas 15 minūšu apskati un iesaka maigu ultraskaņas vai kombinēto tīrīšanu.' },
        { question: 'Vai veicat arī ausu caurdūršanu bērniem un pieaugušajiem?', answer: 'Jā, veicam sterilu ausu caurdūršanu: viens auskars 10.00 €, divi auskari 15.00 €.' }
      ],
      ru: [
        { question: 'Какую чистку лица выбрать — ультразвуковую или комбинированную?', answer: 'Косметолог оценивает состояние кожи на бесплатной консультации (15 мин) и подбирает оптимальный вариант.' },
        { question: 'Делаете ли вы прокол ушей?', answer: 'Да, стерильный прокол ушей: одна серьга 10.00 €, две серьги 15.00 €.' }
      ],
      en: [
        { question: 'Which facial cleansing should I book?', answer: 'During a free 15-minute consultation, our cosmetologist recommends ultrasound or combined cleansing tailored to your skin.' }
      ]
    },
    relatedArticleIds: ['facial-cleansing', 'beauty-salon-kengarags']
  },

  permanent: {
    id: 'permanent',
    slugs: {
      lv: 'permanentais-grims-riga',
      ru: 'permanentnyj-makiyazh-riga',
      en: 'permanent-makeup-riga'
    },
    cardLabels: {
      lv: 'Permanentais grims Rīgā',
      ru: 'Перманентный макияж в Риге',
      en: 'Permanent Makeup Riga'
    },
    titles: {
      lv: 'Permanentais Grims Rīgā – Uzacis, Lūpas, Acu Līnija | Aneri',
      ru: 'Перманентный Макияж в Риге – Брови, Губы, Стрелки | Aneri',
      en: 'Permanent Makeup in Riga – Brows, Lips & Eyeliner | Aneri Salon'
    },
    descriptions: {
      lv: 'Permanentais grims Rīgā: dabīgas uzacis, lūpas un skropstu līnija (130 €). Augstas kvalitātes pigmenti, sterilums, bezmaksas stāvvieta. +371 27580047.',
      ru: 'Перманентный макияж в Риге: естественные брови, губы, межресничка и стрелки с растушевкой (130 €). Стерильно, бесплатная парковка. +371 27580047.',
      en: 'Natural-looking permanent makeup in Riga for eyebrows, lips, and lash line (130 €) with free private parking at Salons Aneri.'
    },
    keywords: {
      lv: 'permanentais grims Rīgā, uzacu permanentais Rīgā, lūpu permanentais grims Rīga, starpskropstu līnija',
      ru: 'перманентный макияж Рига, татуаж бровей Рига, перманент губ Рига, межресничка Рига',
      en: 'permanent makeup Riga, eyebrow microblading Riga, lip blush Riga'
    },
    h1: {
      lv: 'Permanentais Grims Rīgā – Uzacis, Lūpas un Skropstu Līnija',
      ru: 'Перманентный Макияж в Риге – Брови, Губы и Межресничка',
      en: 'Permanent Makeup in Riga – Eyebrows, Lips & Eyeliner'
    },
    subtitles: {
      lv: 'Harmoniska forma, mūsdienīgi ēnojumi un ērti sasniedzams salons Rīgā ar bezmaksas autostāvvietu.',
      ru: 'Естественный оттенок, мягкая растушевка и удобный салон в Риге с бесплатной парковкой у дверей.',
      en: 'Soft, natural pigment work in Riga with strict hygiene and complimentary client parking.'
    },
    intro: {
      lv: 'Piedāvājam ilgnoturīgu permanento grimu uzacīm, lūpām, starpskropstu līnijai un dekoratīvu ēnojumu. Meistare rūpīgi saskaņo formu un toni, lai rezultāts izskatītos dabiski un kopti 1–2 gadus.',
      ru: 'В Salons Aneri на перманентный макияж приезжают со всей Риги: мы создаём естественные брови, сочные губы, чёткую межресничку и декоративные стрелки с растушевкой на сертифицированных пигментах.',
      en: 'Aneri Salon provides bespoke permanent makeup across eyebrows, lips, and lash line, attracting guests across Riga looking for balanced, natural results.'
    },
    highlights: {
      lv: [
        { title: 'Fiksēta caurspīdīga cena — 130.00 €', text: 'Uzacis, lūpas vai skropstu līnija par vienotu cenu bez slēptām piemaksām.' },
        { title: 'Korekcija un atjaunošana', text: 'Visu zonu korekcija 90.00 € un atjaunošana gada laikā 100.00 €.' },
        { title: 'Bezmaksas stāvvieta pie salona', text: 'Pēc procedūras ērti iekāpt savā auto tieši pie salona ieejas.' }
      ],
      ru: [
        { title: 'Прозрачная цена — 130.00 €', text: 'Брови, губы, межресничка или стрелка с растушевкой по единой честной стоимости.' },
        { title: 'Поддержка результата', text: 'Коррекция 90.00 €, а также бережное обновление цвета в течение года — 100.00 €.' },
        { title: 'Парковка у входа', text: 'Комфортный визит из любой точки Риги на машине или 7-м трамвае.' }
      ],
      en: [
        { title: 'Transparent 130.00 € Pricing', text: 'Fixed price for lips, eyebrows, lash line, or shaded eyeliner.' },
        { title: 'Annual Refresh & Touch-Ups', text: 'Correction 90.00 € and 1-year color refresh 100.00 €.' },
        { title: 'Free Parking Outside', text: 'Door-to-door convenience for clients arriving from all Riga districts.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Cik ilgi turas permanentais grims?', answer: 'Vidēji 1–2 gadus atkarībā no ādas tipa; gada laikā iespējama atjaunošana par īpašu cenu (100.00 €).' },
        { question: 'Vai cena ir vienāda visām zonām?', answer: 'Jā, lūpas, uzacis, skropstu līnija un dekoratīvā skropstu līnija ar ēnojumu maksā 130.00 €.' }
      ],
      ru: [
        { question: 'Сколько держится перманентный макияж?', answer: 'В среднем 1–2 года в зависимости от типа кожи; обновление в течение года стоит 100.00 €.' },
        { question: 'Какова цена процедуры?', answer: 'Перманент губ, бровей, межреснички или стрелки с растушевкой стоит 130.00 €.' }
      ],
      en: [
        { question: 'How long does permanent makeup last?', answer: 'Typically 1 to 2 years depending on skin type, with 1-year refresh options available.' }
      ]
    },
    relatedArticleIds: ['permanent-makeup-care', 'beauty-salon-kengarags']
  },

  waxing: {
    id: 'waxing',
    slugs: {
      lv: 'vaksacija-riga',
      ru: 'vaksaciya-riga',
      en: 'waxing-riga'
    },
    cardLabels: {
      lv: 'Vaksācija Rīgā',
      ru: 'Ваксация в Риге',
      en: 'Waxing Riga'
    },
    titles: {
      lv: 'Vaksācija Rīgā – Dziļais Bikini, Kājas, Rokas | Salons Aneri',
      ru: 'Ваксация в Риге – Глубокое Бикини, Ноги, Руки | Салон Aneri',
      en: 'Waxing in Riga – Full Legs, Bikini & Face | Aneri Salon'
    },
    descriptions: {
      lv: 'Vaksācija Rīgā visām zonām: seja no 7 €, kājas, rokas, klasiskais un dziļais bikini (25–30 €). Ātri, saudzīgi un ar bezmaksas stāvvietu.',
      ru: 'Депиляция воском (ваксация) в Риге: лицо от 7 €, подмышки, руки, ноги, классическое и глубокое бикини. Деликатно, быстро и бесплатно у входа. +371 27580047.',
      en: 'Gentle, hygienic waxing depilation in Riga across face, underarms, arms, legs, and classic/deep bikini with free client parking.'
    },
    keywords: {
      lv: 'vaksācija Rīgā, dziļais bikini Rīgā, vaksācija cenas Rīga, kāju vaksācija',
      ru: 'ваксация в Риге, глубокое бикини Рига, депиляция воском Рига цены',
      en: 'waxing Riga, brazilian bikini wax Riga, leg waxing Riga'
    },
    h1: {
      lv: 'Vaksācija Rīgā – Saudzīga Gluda Āda Visām Zonām',
      ru: 'Ваксация в Риге – Гладкая Кожа и Бережная Депиляция',
      en: 'Waxing in Riga – Smooth Skin Across All Zones'
    },
    subtitles: {
      lv: 'Ātras un delikātas procedūras ar kvalitatīvu vasku, klientiem no visas Rīgas ar bezmaksas stāvvietu.',
      ru: 'Аккуратные процедуры качественным воском для клиентов со всей Риги — быстро, чисто и с бесплатной парковкой.',
      en: 'Fast, gentle wax depilation using soothing formulas with free private parking in Riga.'
    },
    intro: {
      lv: 'Salons Aneri piedāvā pilnu vaksācijas pakalpojumu klāstu Rīgā: sejas zonai, padusēm, rokām, kājām un bikini zonai. Strādājam ar vienreizlietojamiem materiāliem un nomierinošu pēcapstrādi komfortablam rezultātam.',
      ru: 'В салоне Aneri в Риге выполняется бережная восковая депиляция любых зон: лицо, подмышки, руки, ноги до колен и по всей длине, классическое и глубокое бикини с одноразовыми материалами и успокаивающим уходом.',
      en: 'Aneri Salon offers complete waxing hair removal in Riga for face, arms, underarms, half/full legs, and classic or deep bikini using single-use hygienic supplies.'
    },
    highlights: {
      lv: [
        { title: 'Kvalitatīvi vaski jutīgai ādai', text: 'Samazina ādas kairinājumu un nodrošina gludumu līdz 3–4 nedēļām.' },
        { title: 'Pieejamas cenas Rīgā', text: 'Sejas zona no 7 €, paduses 10–12 €, dziļais bikini 25–30 €.' },
        { title: 'Diskrēta vizīte un brīva stāvvieta', text: 'Nav jātērē laiks centrā — bezmaksas auto novietošana tieši pie ieejas.' }
      ],
      ru: [
        { title: 'Бережный воск для чувствительной кожи', text: 'Минимальный дискомфорт и гладкая кожа до 3–4 недель.' },
        { title: 'Демократичные цены в Риге', text: 'Лицо от 7 €, подмышки 10–12 €, глубокое бикини 25–30 €.' },
        { title: 'Быстрый визит с парковкой', text: 'Бесплатная стоянка у дверей на Латгалес 264 и прямая ветка 7-го трамвая.' }
      ],
      en: [
        { title: 'Gentle Formulas for Sensitive Skin', text: 'Smooth skin for 3–4 weeks with calming post-wax care.' },
        { title: 'Fair City Pricing', text: 'Face 7–12 €, legs 15–25 €, deep bikini 25–30 €.' },
        { title: 'Free Client Parking', text: 'Arrive smoothly from any Riga district without paid street parking.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Kādam jābūt matiņu garumam pirms vaksācijas?', answer: 'Optimālais garums pirmajai vai kārtējai procedūrai ir aptuveni 4–5 mm.' },
        { question: 'Cik ilgi saglabājas gludums?', answer: 'Vidēji 3 līdz 4 nedēļas, un regulāri veicot vaksāciju, matiņi kļūst plānāki un mīkstāki.' }
      ],
      ru: [
        { question: 'Какой длины должны быть волосы перед ваксацией?', answer: 'Оптимальная длина для комфортного и чистого удаления — около 4–5 мм.' },
        { question: 'Сколько держится эффект после воска?', answer: 'В среднем 3–4 недели; при регулярных визитах волосы растут тоньше и реже.' }
      ],
      en: [
        { question: 'What hair length is best before waxing?', answer: 'Around 4–5 mm ensures clean removal with minimal discomfort.' }
      ]
    },
    relatedArticleIds: ['waxing-vs-laser', 'beauty-salon-kengarags']
  },

  solarium: {
    id: 'solarium',
    slugs: {
      lv: 'solarijs-riga',
      ru: 'solyarij-riga',
      en: 'solarium-riga'
    },
    cardLabels: {
      lv: 'Solārijs Rīgā',
      ru: 'Солярий в Риге',
      en: 'Solarium Riga'
    },
    titles: {
      lv: 'Solārijs Rīgā – Vertikālais Solārijs un Abonementi | Aneri',
      ru: 'Солярий в Риге – Вертикальный Солярий и Абонементы | Aneri',
      en: 'Solarium Tanning in Riga – Vertical Booth & Passes | Aneri Salon'
    },
    descriptions: {
      lv: 'Vertikālais solārijs Rīgā no 4.00 € par seansu vai izdevīgi 10x abonementi (-30%). Jaunas lampas pēc ES normām, bezmaksas stāvvieta pie TC Dole.',
      ru: 'Мощный вертикальный солярий в Риге: от 4.00 € за сеанс, абонементы на 10 посещений со скидкой 30%. Своевременная замена ламп и бесплатная парковка.',
      en: 'Professional vertical solarium tanning in Riga from 4.00 € per session or 10-visit passes (-30% off) with free parking at the door.'
    },
    keywords: {
      lv: 'solārijs Rīgā, vertikālais solārijs Rīga, solārija abonements Rīgā, sauļošanās Rīga',
      ru: 'солярий в Риге, вертикальный солярий Рига, абонемент в солярий Рига',
      en: 'solarium Riga, vertical tanning Riga, tanning studio Riga'
    },
    h1: {
      lv: 'Solārijs Rīgā – Vertikālais Solārijs un Izdevīgi Abonementi',
      ru: 'Солярий в Риге – Мощный Вертикальный Солярий и Абонементы',
      en: 'Solarium in Riga – Vertical Tanning & Value Passes'
    },
    subtitles: {
      lv: 'Vienmērīgs un drošs iedegums katru dienu no Rīgas centra 15 minūtēs, ar bezmaksas stāvvietu.',
      ru: 'Ровный золотистый загар каждый день — с проверенными лампами и бесплатной парковкой у входа.',
      en: 'Even, radiant tan every day with regularly maintained EU-compliant lamps and free parking.'
    },
    intro: {
      lv: 'Salons Aneri piedāvā modernu vertikālo solāriju ar regulāri mainītām lampām atbilstoši ES drošības prasībām. Pieejami seansi no 6 līdz 24 minūtēm, kā arī 10 reižu abonementi ar būtisku ietaupījumu.',
      ru: 'В Salons Aneri установлен профессиональный вертикальный солярий, где мы строго следим за ресурсом и своевременной заменой ламп. Гости со всей Риги выбирают сеансы от 6 до 24 минут или выгодные абонементы на 10 посещений.',
      en: 'Our vertical solarium maintains strict EU lamp standards for safe, even tanning from 6 to 24 minutes, with discounted 10-session passes.'
    },
    highlights: {
      lv: [
        { title: '10x abonementi ar atlaidi', text: 'Pērkot 10 reižu abonementu (no 28.00 €), katrs apmeklējums ir par 30% izdevīgāks.' },
        { title: 'ES standartu lampas un higiēna', text: 'Tīra kabīne, regulāra lampu maiņa un ventilācija vienmērīgam rezultātam.' },
        { title: 'Strādājam katru dienu', text: 'P.-S. 09:00–20:00 un Sv. 10:00–16:00 ar bezmaksas stāvvietu pie durvīm.' }
      ],
      ru: [
        { title: 'Абонементы 10x со скидкой', text: 'Абонемент на 10 сеансов (от 28.00 €) даёт экономию 30% от разовых посещений.' },
        { title: 'Контроль ламп по нормам ЕС', text: 'Регулярная замена ламп и дезинфекция после каждого клиента.' },
        { title: 'Удобный график без выходных', text: 'Пн–Сб 09:00–20:00, Вс 10:00–16:00, бесплатная парковка прямо у входа.' }
      ],
      en: [
        { title: '30% Savings with 10x Passes', text: 'Multi-visit passes from 28.00 € make every session 30% more affordable.' },
        { title: 'EU-Certified Lamps & Cleanliness', text: 'Sanitized after every guest with strictly tracked lamp hours.' },
        { title: 'Open 7 Days + Free Parking', text: 'Mon–Sat 09:00–20:00, Sun 10:00–16:00 at Latgales iela 264.' }
      ]
    },
    faqs: {
      lv: [
        { question: 'Vai solārijā tiek regulāri mainītas lampas?', answer: 'Jā, mēs regulāri sekojam līdzi lampu darba stundām un mainām tās atbilstoši ES normām.' },
        { question: 'Cik minūtes izvēlēties pirmajam apmeklējumam?', answer: 'Gaišai ādai sākumā iesakām 6 minūtes (4.00 €), bet pirms vizītes vienmēr varat konsultēties ar administratoru.' }
      ],
      ru: [
        { question: 'Сколько минут выбрать для первого загара?', answer: 'Для светлой кожи оптимально начать с 6 минут (4.00 €), чтобы кожа адаптировалась без покраснений.' },
        { question: 'Какова выгода абонемента на 10 раз?', answer: 'Абонементы начинаются от 28.00 € за 10 сеансов — это на 30% дешевле разовых посещений.' }
      ],
      en: [
        { question: 'How many minutes should I start with?', answer: 'For fair skin we recommend starting with 6 minutes (4.00 €) and increasing gradually.' }
      ]
    },
    relatedArticleIds: ['solarium-rules', 'beauty-salon-kengarags']
  }
};

export interface ArticleSeoMeta {
  id: string;
  lv: { title: string; description: string };
  ru: { title: string; description: string };
  en: { title: string; description: string };
}

export const ARTICLES_SEO_META: Record<string, ArticleSeoMeta> = {
  'beauty-salon-kengarags': {
    id: 'beauty-salon-kengarags',
    lv: {
      title: 'Skaistumkopšanas salons Ķengaragā un Rīgā – Salons Aneri',
      description: 'Pilns skaistumkopšanas pakalpojumu klāsts Rīgā: frizētava, manikīrs, kosmetoloģija, solārijs un bezmaksas stāvvieta Latgales ielā 264.'
    },
    ru: {
      title: 'Салон красоты в Кенгарагсе и Риге – Полный спектр | Salons Aneri',
      description: 'Парикмахерская, маникюр, педикюр, косметология и солярий в Риге с бесплатной парковкой на ул. Латгалес 264.'
    },
    en: {
      title: 'Beauty Salon in Kengarags & Riga – Full Range of Services | Aneri',
      description: 'Full beauty services in Riga: hair salon, manicure, pedicure, cosmetology, and solarium with free parking at Latgales iela 264.'
    }
  },
  'haircare': {
    id: 'haircare',
    lv: {
      title: 'Kā kopt matus pēc krāsošanas? | Salons Aneri Rīga',
      description: 'Friziera padomi krāsotu matu kopšanai: bezsulfātu šampūni, termoaizsardzība un krāsas noturības saglabāšana.'
    },
    ru: {
      title: 'Как ухаживать за волосами после окрашивания? | Салон Aneri Рига',
      description: 'Профессиональные советы мастеров салона Aneri в Риге по сохранению цвета и блеска окрашенных волос.'
    },
    en: {
      title: 'Hair Care After Coloring – Expert Guide | Aneri Salon Riga',
      description: 'Professional tips from Aneri Salon Riga on keeping dyed hair vibrant, hydrated, and glossy for longer.'
    }
  },
  'hair-loss': {
    id: 'hair-loss',
    lv: {
      title: 'Matu izkrišanas cēloņi un risinājumi | Salons Aneri Rīga',
      description: 'Kāpēc izkrīt mati un kā stiprināt saknes ar profesionālu kopšanu un procedūrām salonā Rīgā.'
    },
    ru: {
      title: 'Причины выпадения волос и восстановление | Салон Aneri Рига',
      description: 'Основные причины выпадения волос и рекомендации по укреплению и уходу от мастеров салона красоты в Риге.'
    },
    en: {
      title: 'Causes of Hair Loss & Strengthening Care | Aneri Salon Riga',
      description: 'Learn common causes of hair thinning and how salon care restores scalp balance and strength.'
    }
  },
  'keratin-vs-botox': {
    id: 'keratin-vs-botox',
    lv: {
      title: 'Keratīna taisnošana vai matu botokss? Salīdzinājums | Salons Aneri',
      description: 'Kuru procedūru izvēlēties Rīgā — "GLOBAL" keratīna taisnošanu vai atjaunojošu matu botoksu? Meistara skaidrojums.'
    },
    ru: {
      title: 'Кератин или ботокс для волос — что выбрать? | Салон Aneri Рига',
      description: 'Разница между кератиновым выпрямлением GLOBAL и ботоксом для волос: эффект, стойкость и кому что подходит.'
    },
    en: {
      title: 'Keratin vs Hair Botox – Which Should You Choose? | Aneri Salon',
      description: 'Compare GLOBAL keratin straightening and hair botox treatments in Riga to choose the best care for your hair.'
    }
  },
  'manicure-tips': {
    id: 'manicure-tips',
    lv: {
      title: 'Kā pagarināt gēllakas noturību? | Manikīrs Rīgā – Aneri',
      description: 'Meistaru ieteikumi, kā saglabāt gēllakas manikīru perfektu 3 līdz 4 nedēļas bez atslāņošanās.'
    },
    ru: {
      title: 'Как продлить стойкость гель-лака? | Маникюр в Риге – Aneri',
      description: 'Секреты ухода за руками и ногтями от мастеров Salons Aneri в Риге для носки гель-лака 3–4 недели.'
    },
    en: {
      title: 'How to Make Gel Polish Last 3–4 Weeks | Manicure Riga – Aneri',
      description: 'Practical aftercare tips from our Riga nail technicians to keep your Gelish manicure flawless.'
    }
  },
  'hardware-pedicure': {
    id: 'hardware-pedicure',
    lv: {
      title: 'Kāpēc izvēlēties aparātu pedikīru? | Salons Aneri Rīga',
      description: 'Aparātu pedikīra priekšrocības: droša, bezūdens un sterila pēdu kopšana Rīgā par 30.00 - 32.00 €.'
    },
    ru: {
      title: 'Преимущества аппаратного педикюра | Салон Aneri Рига',
      description: 'Почему аппаратный педикюр безопаснее и долговечнее классического — рассказывают мастера салона в Риге.'
    },
    en: {
      title: 'Why Choose a Hardware Pedicure? | Aneri Salon Riga',
      description: 'Discover the hygiene, precision, and lasting smoothness benefits of hardware pedicure in Riga.'
    }
  },
  'nail-trends': {
    id: 'nail-trends',
    lv: {
      title: 'Aktuālākās manikīra tendences Rīgā | Salons Aneri',
      description: 'Dabīgi toņi, mikro franču manikīrs un gēllakas dizaini — populārākās manikīra izvēles mūsu salonā Rīgā.'
    },
    ru: {
      title: 'Тренды маникюра и дизайна ногтей | Салон Aneri Рига',
      description: 'Популярные оттенки, нежный френч и минималистичный дизайн гель-лаком в салоне красоты в Риге.'
    },
    en: {
      title: 'Latest Manicure & Gel Nail Trends in Riga | Aneri Salon',
      description: 'Explore natural tones, clean French styling, and minimalist nail trends available at Aneri Salon Riga.'
    }
  },
  'facial-cleansing': {
    id: 'facial-cleansing',
    lv: {
      title: 'Kāpēc nepieciešama profesionāla sejas tīrīšana? | Aneri Rīga',
      description: 'Ultraskaņas un mehāniskā sejas tīrīšana Rīgā: cik bieži veikt, ko tā dod un kā sagatavoties vizītei.'
    },
    ru: {
      title: 'Зачем нужна профессиональная чистка лица? | Косметолог в Риге',
      description: 'Польза ультразвуковой и комбинированной чистки лица у косметолога в Риге и рекомендации по регулярности.'
    },
    en: {
      title: 'Why Professional Facial Cleansing Matters | Cosmetology Riga',
      description: 'How ultrasound and combined facial cleansing keep skin clear and healthy with regular visits.'
    }
  },
  'permanent-makeup-care': {
    id: 'permanent-makeup-care',
    lv: {
      title: 'Kā kopt permanento grimu pēc procedūras? | Salons Aneri Rīga',
      description: 'Detalizēti norādījumi uzacu, lūpu un skropstu līnijas permanentā grima sadzīšanai un noturībai.'
    },
    ru: {
      title: 'Уход за перманентным макияжем после процедуры | Aneri Рига',
      description: 'Памятка по заживлению бровей, губ и век после перманентного макияжа для идеального цвета.'
    },
    en: {
      title: 'Permanent Makeup Aftercare Guide | Aneri Salon Riga',
      description: 'Step-by-step healing instructions for permanent eyebrows, lip blush, and eyeliner.'
    }
  },
  'waxing-vs-laser': {
    id: 'waxing-vs-laser',
    lv: {
      title: 'Vaksācija vai lāzerepilācija — ko izvēlēties? | Aneri Rīga',
      description: 'Godīgs vaksācijas un lāzerepilācijas salīdzinājums pēc rezultāta, cenas un ādas jutīguma Rīgā.'
    },
    ru: {
      title: 'Ваксация или лазерная эпиляция — честное сравнение | Aneri',
      description: 'Плюсы и особенности восковой депиляции и лазера: стоимость, скорость и кому подходит ваксация в Риге.'
    },
    en: {
      title: 'Waxing vs. Laser Hair Removal – Honest Comparison | Aneri',
      description: 'Compare cost, convenience, and hair-type suitability between wax depilation and laser removal.'
    }
  },
  'solarium-rules': {
    id: 'solarium-rules',
    lv: {
      title: 'Kā pareizi un droši sauļoties solārijā? | Salons Aneri Rīga',
      description: 'Noteikumi drošam iedegumam vertikālajā solārijā Rīgā: minūšu izvēle, aizsargbrilles un ādas kopšana.'
    },
    ru: {
      title: 'Как правильно загорать в солярии? | Салон Aneri Рига',
      description: 'Советы для красивого и безопасного загара в вертикальном солярии в Риге: время, косметика и уход.'
    },
    en: {
      title: 'How to Tan Safely in a Vertical Solarium | Aneri Riga',
      description: 'Guidelines for safe session duration, eye protection, and moisturizing when using our solarium in Riga.'
    }
  }
};

export interface StaticPageSeo {
  lv: { title: string; description: string; h1: string };
  ru: { title: string; description: string; h1: string };
  en: { title: string; description: string; h1: string };
}

export const STATIC_PAGES_SEO: Record<'home' | 'prices' | 'gallery' | 'faq' | 'terms' | 'privacy', StaticPageSeo> = {
  home: {
    lv: {
      title: 'Salons Aneri – Frizētava, Manikīrs un Skaistumkopšana Rīgā',
      description: 'Skaistumkopšanas salons Rīgā (Latgales iela 264, Ķengarags) ar bezmaksas stāvvietu. Frizētava, manikīrs, Gelish, kosmetoloģija, vaksācija un solārijs.',
      h1: 'Skaistuma māksla Rīgā — Salons Aneri'
    },
    ru: {
      title: 'Салон Aneri – Парикмахерская, Маникюр и Солярий в Риге',
      description: 'Салон красоты в Риге (ул. Латгалес 264) с бесплатной парковкой и прямым 7-м трамваем. Стрижки, Airtouch, маникюр гель-лаком, косметология и солярий.',
      h1: 'Salons Aneri — Салон красоты в Риге'
    },
    en: {
      title: 'Aneri Salon – Hair Salon, Manicure & Beauty Studio in Riga',
      description: 'Full-service beauty salon in Riga (Latgales iela 264) with free parking. Haircuts, Airtouch, manicure, pedicure, permanent makeup, waxing, and solarium.',
      h1: 'Aneri Salon – Beauty & Hair Care in Riga'
    }
  },
  prices: {
    lv: {
      title: 'Cenrādis – Frizētava, Manikīrs, Solārijs Rīgā | Salons Aneri',
      description: 'Pilns Salons Aneri pakalpojumu cenrādis Rīgā. Matu griezumi, Airtouch, Gelish manikīrs, pedikīrs, kosmetoloģija, permanentais grims, vaksācija un solārijs.',
      h1: 'Pakalpojumu Cenrādis – Salons Aneri Rīgā'
    },
    ru: {
      title: 'Прайс-лист и Цены – Парикмахерская и Маникюр в Риге | Aneri',
      description: 'Полный прайс-лист салона Aneri в Риге: женские, мужские и детские стрижки, окрашивание, маникюр гель-лак, педикюр, ваксация и солярий.',
      h1: 'Цены на услуги салона Aneri в Риге'
    },
    en: {
      title: 'Price List – Hair Salon, Manicure & Solarium Riga | Aneri',
      description: 'Full beauty service price list at Aneri Salon in Riga: haircuts, coloring, manicure, pedicure, facial peels, permanent makeup, waxing, and tanning.',
      h1: 'Our Pricing – Aneri Salon Riga'
    }
  },
  gallery: {
    lv: {
      title: 'Darbu Galerija – Frizūras, Krāsošana un Manikīrs | Aneri Rīga',
      description: 'Salona Aneri meistaru darbu galerija Rīgā: Airtouch krāsošanas rezultāti, matu griezumi, gēllakas manikīrs un permanentais grims.',
      h1: 'Mūsu Darbu Galerija'
    },
    ru: {
      title: 'Галерея Работ – Окрашивание, Стрижки, Маникюр | Салон Aneri Рига',
      description: 'Фотографии работ мастеров салона красоты Aneri в Риге: сложные окрашивания, стрижки, маникюр гель-лаком и оформление бровей.',
      h1: 'Галерея наших работ'
    },
    en: {
      title: 'Work Gallery – Hair Coloring, Haircuts & Nails | Aneri Riga',
      description: 'Real portfolio photos from Aneri Salon in Riga showcasing haircuts, Airtouch color transitions, manicures, and beauty treatments.',
      h1: 'Our Work Gallery'
    }
  },
  faq: {
    lv: {
      title: 'Biežie Jautājumi – Adrese, Bezmaksas Stāvvieta, Cenas | Aneri',
      description: 'Atbildes uz jautājumiem par Salons Aneri Rīgā: kā atbraukt, bezmaksas autostāvvieta, darba laiks, Airtouch, Gelish noturība un pieraksts.',
      h1: 'Biežie Jautājumi – Salons Aneri Rīga'
    },
    ru: {
      title: 'Частые Вопросы – Парковка, Проезд, Услуги и Цены | Aneri Рига',
      description: 'Ответы на популярные вопросы о салоне Aneri в Риге: бесплатная парковка на Латгалес 264, 7-й трамвай, оплата, маникюр и окрашивание.',
      h1: 'Частые Вопросы – Салон Aneri в Риге'
    },
    en: {
      title: 'FAQ – Location, Free Parking, Services & Booking | Aneri Riga',
      description: 'Frequently asked questions about Aneri Salon in Riga: free private parking, public transit, pricing, Gelish wear, and booking by phone.',
      h1: 'Frequently Asked Questions'
    }
  },
  terms: {
    lv: {
      title: 'Lietošanas Noteikumi | Salons Aneri Rīga',
      description: 'Salons Aneri apmeklējuma un pieraksta noteikumi Rīgā, Latgales ielā 264.',
      h1: 'Lietošanas Noteikumi'
    },
    ru: {
      title: 'Правила посещения | Салон Aneri Рига',
      description: 'Правила записи и посещения салона красоты Salons Aneri в Риге на ул. Латгалес 264.',
      h1: 'Правила посещения'
    },
    en: {
      title: 'Terms of Service | Aneri Salon Riga',
      description: 'Booking and visit policies for Salons Aneri beauty studio in Riga.',
      h1: 'Terms & Conditions'
    }
  },
  privacy: {
    lv: {
      title: 'Privātuma Politika | Salons Aneri Rīga',
      description: 'Salons Aneri privātuma un personas datu apstrādes politika klientiem Rīgā.',
      h1: 'Privātuma Politika'
    },
    ru: {
      title: 'Политика конфиденциальности | Салон Aneri Рига',
      description: 'Политика конфиденциальности и обработки данных для записи в Salons Aneri Рига.',
      h1: 'Политика конфиденциальности'
    },
    en: {
      title: 'Privacy Policy | Aneri Salon Riga',
      description: 'Privacy policy explaining how Salons Aneri handles booking contact details.',
      h1: 'Privacy Policy'
    }
  }
};

export interface ParsedRoute {
  lang: Language;
  view: View;
  serviceId?: ServiceSectionId;
  articleId?: string;
}

// Match any thematic service slug across LV, RU, or EN back to its section ID
export function findServiceBySlug(slug: string): ServiceSectionId | undefined {
  const normalized = slug.trim().toLowerCase();
  for (const id of SERVICE_SECTION_IDS) {
    const entry = THEMATIC_SERVICES_SEO[id];
    if (
      entry.slugs.lv === normalized ||
      entry.slugs.ru === normalized ||
      entry.slugs.en === normalized
    ) {
      return id;
    }
  }
  return undefined;
}

// Parses both ALL legacy URLs (preserved verbatim) and all new thematic *-riga URLs
export function parseSeoRoute(pathname: string): ParsedRoute {
  const cleanPath = (pathname || '/').split('?')[0].split('#')[0];
  const parts = cleanPath.split('/').filter(Boolean);

  let lang: Language = 'lv';
  let offset = 0;

  if (parts[0] === 'ru' || parts[0] === 'en' || parts[0] === 'lv') {
    lang = parts[0] as Language;
    offset = 1;
  }

  const seg1 = (parts[offset] || '').toLowerCase();
  const seg2 = parts[offset + 1] || '';

  if (!seg1) {
    return { lang, view: 'home' };
  }

  const matchedService = findServiceBySlug(seg1);
  if (matchedService) {
    return { lang, view: 'service', serviceId: matchedService };
  }

  if (seg1 === 'article') {
    return { lang, view: 'article', articleId: seg2 };
  }

  const legacyViews: View[] = ['home', 'prices', 'faq', 'gallery', 'terms', 'privacy', 'admin'];
  if (legacyViews.includes(seg1 as View)) {
    return { lang, view: seg1 as View };
  }

  return { lang, view: 'home' };
}

export function buildSeoUrl(
  lang: Language,
  view: View,
  options?: { serviceId?: ServiceSectionId; articleId?: string }
): string {
  const langPrefix = lang === 'lv' ? '' : `/${lang}`;

  if (view === 'service' && options?.serviceId) {
    const slug = THEMATIC_SERVICES_SEO[options.serviceId]?.slugs[lang];
    if (slug) {
      return `${langPrefix}/${slug}`;
    }
  }

  if (view === 'article' && options?.articleId) {
    return `${langPrefix}/article/${options.articleId}`;
  }

  if (view === 'home') {
    return langPrefix || '/';
  }

  return `${langPrefix}/${view}`;
}

export function getEdgeSeoPayload(pathname: string) {
  const baseUrl = 'https://aneri.lv';
  const parsed = parseSeoRoute(pathname);
  const { lang, view, serviceId, articleId } = parsed;

  let title = STATIC_PAGES_SEO.home[lang].title;
  let description = STATIC_PAGES_SEO.home[lang].description;
  let keywords =
    lang === 'lv'
      ? 'Salons Aneri, frizētava Rīgā, manikīrs Rīgā, solārijs Rīgā, bezmaksas stāvvieta, Ķengarags'
      : lang === 'ru'
      ? 'Salons Aneri, парикмахерская в Риге, маникюр Рига, солярий Рига, бесплатная парковка, Кенгарагс'
      : 'Salons Aneri, hair salon Riga, manicure Riga, beauty salon Riga, free parking';
  let h1 = STATIC_PAGES_SEO.home[lang].h1;
  let lead = description;
  let robots = view === 'admin' ? 'noindex, nofollow' : 'index, follow';

  if (view === 'service' && serviceId) {
    const svc = THEMATIC_SERVICES_SEO[serviceId];
    title = svc.titles[lang];
    description = svc.descriptions[lang];
    keywords = svc.keywords[lang];
    h1 = svc.h1[lang];
    lead = svc.intro[lang];
  } else if (view === 'article' && articleId && ARTICLES_SEO_META[articleId]) {
    const art = ARTICLES_SEO_META[articleId][lang];
    title = art.title;
    description = art.description;
    h1 = art.title.split('|')[0].trim();
    lead = art.description;
  } else if (
    view === 'prices' ||
    view === 'gallery' ||
    view === 'faq' ||
    view === 'terms' ||
    view === 'privacy'
  ) {
    const staticSeo = STATIC_PAGES_SEO[view][lang];
    title = staticSeo.title;
    description = staticSeo.description;
    h1 = staticSeo.h1;
    lead = staticSeo.description;
  }

  const canonicalPath = buildSeoUrl(lang, view, { serviceId, articleId });
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const alternates: Array<{ hreflang: string; href: string }> = (['lv', 'ru', 'en'] as Language[]).map(
    l => ({
      hreflang: l,
      href: `${baseUrl}${buildSeoUrl(l, view, { serviceId, articleId })}`
    })
  );
  alternates.push({
    hreflang: 'x-default',
    href: `${baseUrl}${buildSeoUrl('lv', view, { serviceId, articleId })}`
  });

  const ogLocale = lang === 'lv' ? 'lv_LV' : lang === 'ru' ? 'ru_RU' : 'en_US';

  // Route-specific JSON-LD Schema.org
  const breadcrumbItems: Array<{ '@type': string; position: number; name: string; item: string }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: lang === 'lv' ? 'Sākums' : lang === 'ru' ? 'Главная' : 'Home',
      item: `${baseUrl}${buildSeoUrl(lang, 'home')}`
    }
  ];

  if (view !== 'home' && view !== 'admin') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: h1,
      item: canonicalUrl
    });
  }

  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BeautySalon',
      '@id': `${baseUrl}/#salon`,
      name: 'Salons Aneri',
      url: baseUrl,
      image: 'https://aneri-icon.pages.dev/photo/facade.jpg',
      telephone: '+371 27580047',
      priceRange: '$$',
      paymentAccepted: 'Cash',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Latgales iela 264',
        addressLocality: 'Rīga',
        addressRegion: 'Ķengarags',
        postalCode: 'LV-1063',
        addressCountry: 'LV'
      },
      areaServed: [
        { '@type': 'City', name: 'Rīga' },
        { '@type': 'AdministrativeArea', name: 'Ķengarags' }
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 56.9085003,
        longitude: 24.1822941
      },
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Free Private Client Parking',
          value: true
        }
      ],
      sameAs: [
        'https://www.instagram.com/salons_aneri/',
        'https://www.facebook.com/61568612101531/about/'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    }
  ];

  if (view === 'service' && serviceId) {
    const svc = THEMATIC_SERVICES_SEO[serviceId];
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: svc.cardLabels[lang],
      description: svc.descriptions[lang],
      url: canonicalUrl,
      areaServed: { '@type': 'City', name: 'Rīga' },
      provider: { '@id': `${baseUrl}/#salon` }
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: svc.faqs[lang].map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    });
  }

  return {
    lang,
    view,
    serviceId,
    articleId,
    title,
    description,
    keywords,
    h1,
    lead,
    robots,
    canonicalUrl,
    alternates,
    ogLocale,
    schemas,
    thematicLinks: SERVICE_SECTION_IDS.map(id => ({
      href: buildSeoUrl(lang, 'service', { serviceId: id }),
      label: THEMATIC_SERVICES_SEO[id].cardLabels[lang]
    })),
    pricesHref: buildSeoUrl(lang, 'prices')
  };
}
