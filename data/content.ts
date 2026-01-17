
import { Content, Language } from '../types';

export const contentData: Record<Language, Content> = {
  lv: {
    meta: {
      title: "Cenrādis - Salons Aneri Ķengarāgā | Matu griezumi, Manikīrs, Solārijs",
      description: "Pilns Salona Aneri pakalpojumu cenrādis. Matu griezumi, manikīrs, pedikīrs, vaksācija, permanentais grims, kosmetoloģija un solārijs.",
      keywords: "cenrādis frizētava ķengarags, manikīra cenas rīga, pedikīrs cena, vaksācija cenas, pīlings cena, permanentais grims rīga, solārijs ķengarags, frizieris rīga, bērnu frizētava, matu krāsošana, airtouch rīga, gelish manikīrs, skaistumkopšanas salons",
    },
    nav: {
      home: "Sākums",
      services: "Pakalpojumi",
      prices: "Cenrādis",
      gallery: "Galerija",
      contacts: "Kontakti",
      faq: "Biežie jautājumi",
      bookBtn: "Zvanīt",
      installApp: "Uzstādīt aplikāciju",
    },
    hero: {
      title: "Skaistuma māksla Ķengaragā",
      subText: "Salons Aneri – vieta, kur profesionalitāte satiekas ar komfortu. Mēs atrodamies Latgales ielā 264 un gaidām Jūs katru dienu.",
      cta: "Pierakstīties",
    },
    services: {
      title: "Mūsu Meistarība",
      items: [
        {
          id: "hair",
          title: "Frizētavas pakalpojumi",
          description: "Griezumi, krāsošana un matu kopšana dāmām, kungiem un bērniem.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "nails",
          title: "Manikīrs un Pedikīrs",
          description: "Klasiskais un aparātu manikīrs, pedikīrs, Gelish pārklājums.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "cosmetology",
          title: "Kosmetoloģija un Pīlingi",
          description: "Sejas tīrīšana, mezoterapija, krio procedūras un pīlingi.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "permanent",
          title: "Permanentais grims",
          description: "Ilgnoturīgs grims uzacīm, lūpām un acu līnijai.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "waxing",
          title: "Vaksācija",
          description: "Gluda āda visām zonām: seja, rokas, kājas, bikini.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "solarium",
          title: "Solārijs",
          description: "Profesionāls vertikālais solārijs skaistam iedegumam.",
          longDescription: "",
          keywords: [],
          image: ""
        }
      ],
    },
    prices: {
      title: "Pakalpojumu Cenrādis",
      description: "Salons Aneri piedāvā plašu skaistumkopšanas pakalpojumu klāstu par konkurētspējīgām cenām Ķengaraga sirdī.",
      disclaimer: "* Norādītās cenas ir informatīvas. Precīzu summu meistars noteiks pēc konsultācijas. Norēķini tikai skaidrā naudā.",
      sections: [
        {
          id: "hair",
          sectionTitle: "1. Frizētavas pakalpojumi",
          categories: [
            {
              title: "Dāmām",
              services: [
                { name: "Matu griezums (īsiem matiem)", price: "no 22.00 €" },
                { name: "Matu griezums (vidēji gariem)", price: "no 25.00 €" },
                { name: "Matu griezums (gariem matiem)", price: "no 28.00 €" },
                { name: "Matu veidošana", price: "20.00 - 30.00 €" },
                { name: "Griezums + Veidošana", price: "25.00 - 50.00 €" },
                { name: "Veidošana ar ruļļiem", price: "18.00 - 40.00 €" },
                { name: "Vakara frizūra", price: "30.00 - 50.00 €" },
                { name: "Krāsošana 1 tonī (darbs)", price: "22.00 - 40.00 €" },
                { name: "Balināšana ar foliju (darbs)", price: "28.00 - 70.00 €" },
                { name: "Balināšana ar cepurīti (darbs)", price: "25.00 - 40.00 €" },
                { name: "Kolorēšana", price: "30.00 - 90.00 €" },
                { name: "Ķīmiskie ilgviļņi", price: "35.00 - 65.00 €" },
                { name: "Bio-ilgviļņi", price: "45.00 - 75.00 €" },
                { name: "Matu mazgāšana un žāvēšana", price: "12.00 - 18.00 €" },
                { name: "Ponija griezums", price: "3.00 - 7.00 €" },
                { name: "Keratīna taisnošana 'GLOBAL' (īsi)", price: "55.00 - 65.00 €" },
                { name: "Keratīna taisnošana 'GLOBAL' (vidēji)", price: "70.00 - 90.00 €" },
                { name: "Keratīna taisnošana 'GLOBAL' (gari)", price: "95.00 - 110.00 €" },
              ]
            },
            {
              title: "Kungiem",
              services: [
                { name: "Vīriešu griezums", price: "16.00 - 18.00 €" },
                { name: "Matu veidošana", price: "6.00 - 8.00 €" },
                { name: "Griezums uz nullīti", price: "12.00 - 14.00 €" },
                { name: "Griezums ar mašīnīti", price: "14.00 - 16.00 €" },
              ]
            },
            {
              title: "Pensionāriem (no 65 gadiem)",
              services: [
                { name: "Matu griezums", price: "14.00 - 15.00 €" },
                { name: "Matu veidošana", price: "14.00 - 15.00 €" },
                { name: "Ķīmiskie ilgviļņi", price: "35.00 - 50.00 €" },
                { name: "Matu krāsošana", price: "15.00 - 20.00 €" },
              ]
            },
            {
              title: "Bērniem",
              services: [
                { name: "Pirmsskolas vecuma bērniem", price: "14.00 €" },
                { name: "Skolniekiem (līdz 16 gadiem)", price: "15.00 €" },
              ]
            }
          ]
        },
        {
          id: "nails",
          sectionTitle: "2. Manikīrs un Pedikīrs",
          categories: [
            {
              title: "Manikīrs",
              services: [
                { name: "Klasiskais (bez lakas)", price: "16.00 €" },
                { name: "Klasiskais (ar laku)", price: "18.00 €" },
                { name: "Vīriešu manikīrs", price: "20.00 €" },
                { name: "Nagu lakošana", price: "5.00 €" },
                { name: "Klasiskais manikīrs + Gēllaka", price: "28.00 €" },
                { name: "Gēllaka (Frenčs)", price: "30.00 €" },
                { name: "Gēllakas noņemšana (jauna pārklājuma laikā)", price: "Bezmaksas" },
                { name: "Gēllakas noņemšana (atsevišķi)", price: "no 5.00 €" },
                { name: "Nagu restaurācija", price: "3.00 - 5.00 €" },
                { name: "Ekspress manikīrs + Gēllaka", price: "20.00 €" },
                { name: "Skropstu krāsošana", price: "5.00 €" },
                { name: "Uzacu krāsošana", price: "5.00 €" },
                { name: "Uzacu korekcija", price: "5.00 - 7.00 €" },
              ]
            },
            {
              title: "Pedikīrs",
              services: [
                { name: "Klasiskais pedikīrs", price: "30.00 - 32.00 €" },
                { name: "Aparātu pedikīrs", price: "30.00 - 32.00 €" },
                { name: "Vīriešu pedikīrs", price: "35.00 €" },
                { name: "Pedikīrs + Gēllaka", price: "36.00 €" },
                { name: "Pedikīrs + Gēllaka (Frenčs)", price: "38.00 €" },
                { name: "Ekspress pedikīrs", price: "24.00 €" },
                { name: "Ekspress pedikīrs + Gēllaka", price: "28.00 €" },
                { name: "Ekspress pedikīrs + Gēllaka (Frenčs)", price: "30.00 €" },
              ]
            }
          ]
        },
        {
          id: "cosmetology",
          sectionTitle: "3. Kosmetoloģija un Pīlingi",
          categories: [
            {
              title: "Kosmētiskās procedūras",
              services: [
                { name: "Konsultācija (15 min)", price: "Bezmaksas" },
                { name: "Sejas kriomasāža (10-15 min)", price: "no 15.00 €" },
                { name: "Kriodestrukcija (papilomas/kārpas)", price: "no 15.00 €" },
                { name: "Limfodrenāžas sejas masāža (60 min)", price: "50.00 €" },
                { name: "Sejas tīrīšana ar US (60 min)", price: "no 40.00 €" },
                { name: "Mehāniskā tīrīšana + US (90 min)", price: "no 45.00 €" },
                { name: "Mezoterapija (40 min)", price: "no 50.00 €" },
                { name: "Ausu caurdūršana (viens auskars)", price: "10.00 €" },
                { name: "Ausu caurdūršana (divi auskari)", price: "15.00 €" },
              ]
            },
            {
              title: "Pīlingi",
              services: [
                { name: "Mandeļu, fitīna vai pienskābes pīlings (60 min)", price: "no 40.00 €" },
                { name: "Mela Peel (pret pigmentāciju)", price: "40.00 €" },
                { name: "Cosmo Peel (pret novecošanos)", price: "50.00 €" },
                { name: "PRX-T33 (2ml)", price: "60.00 €" },
              ]
            }
          ]
        },
        {
          id: "permanent",
          sectionTitle: "4. Permanentais grims",
          categories: [
            {
              title: "Procedūras",
              services: [
                { name: "Lūpas", price: "130.00 €" },
                { name: "Uzacis", price: "130.00 €" },
                { name: "Skropstu līnija", price: "130.00 €" },
                { name: "Dekoratīvā skropstu līnija ar ēnojumu", price: "130.00 €" },
                { name: "Visu zonu korekcija", price: "90.00 €" },
                { name: "Atjaunošana 1 gada laikā", price: "100.00 €" },
              ]
            }
          ]
        },
        {
          id: "waxing",
          sectionTitle: "5. Vaksācija",
          categories: [
            {
              title: "Зonas",
              services: [
                { name: "Sejas zona", price: "7.00 - 12.00 €" },
                { name: "Paduses", price: "10.00 - 12.00 €" },
                { name: "Rokas", price: "12.00 - 18.00 €" },
                { name: "Kājas līdz ceļiem", price: "15.00 - 20.00 €" },
                { name: "Kājas visā garumā", price: "18.00 - 25.00 €" },
                { name: "Бикини (классическое)", price: "14.00 - 18.00 €" },
                { name: "Бикини (глубокое)", price: "25.00 - 30.00 €" },
              ]
            }
          ]
        },
        {
          id: "solarium",
          sectionTitle: "6. Solārijs",
          categories: [
            {
              title: "Apmeklējums / Abonements",
              services: [
                { name: "6 min", price: "4.00 € / 28.00 € (10x)" },
                { name: "9 min", price: "4.50 € / 31.50 € (10x)" },
                { name: "12 min", price: "5.00 € / 35.00 € (10x)" },
                { name: "15 min", price: "5.50 € / 38.50 € (10x)" },
                { name: "18 min", price: "6.00 € / 42.00 € (10x)" },
                { name: "21 min", price: "6.50 € / 45.50 € (10x)" },
                { name: "24 min", price: "7.00 € / 49.00 € (10x)" },
              ]
            }
          ]
        }
      ]
    },
    gallery: {
      title: "Mūsu Darbu Galerija",
      description: "Ieskats mūsu meistaru ikdienas darbā un rezultātos.",
      categories: [],
      showMore: "Parādīt vairāk",
      instagramBtn: "Mūsu Instagram"
    },
    advantages: {
      title: "Mūsu priekšrocības",
      items: [
        "Vairāk nekā 15 gadu pieredze",
        "Mājīga un silta atmosfēra",
        "Bezmaksas stāvvieta klientiem",
        "Pašā Ķengaraga sirdī",
      ],
    },
    faq: {
      title: "Biežie Jautājumi",
      description: "Viss, kas Jums jāzina pirms vizītes pie mums.",
      categories: [
        {
          categoryTitle: "Atrašanās vieta un transports",
          items: [
            { question: "Vai pie salona ir autostāvvieta?", answer: "Jā, tieši pie salona ieejas mūsu klientiem ir pieejama bezmaksas privātā autostāvvieta." },
            { question: "Kā pie Jums nokļūt ar sabiedrisko transportu?", answer: "Mēs atrodamies Latgales ielā 264. Pie mums var nokļūt ar 7. tramvaju vai autobusiem 15, 18, 31, 49, 60." }
          ]
        },
        {
          categoryTitle: "Procedūras un Materiāli",
          items: [
            { question: "Vai jūs veicat sarežģītas matu krāsošanas?", answer: "Jā, mūsu meistari specializējas Airtouch, Balayage, Šatuš un citās mūsdienīgās tehnikās. Precīzu cenu un laiku var noteikt konsultācijā." },
            { question: "Kādu kosmētiku jūs izmantojat?", answer: "Darbā izmantojam tikai profesionālu un sertificētu kosmētiku no vadošajiem zīmoliem, lai garantētu noturīgu rezultātu un matu/ādas veselību." },
            { question: "Vai solārija lampas ir drošas?", answer: "Mēs regulāri veicam lampu maiņu un apkopi, lai nodrošinātu drošu un efektīvu iedegumu, ievērojot ES normas." }
          ]
        },
        {
          categoryTitle: "Pakalpojumi un Apmaksa",
          items: [
            { question: "Vai pie jums var norēķināties ar karti?", answer: "Nē, mēs pieņemam tikai skaidru naudu (Euro)." },
            { question: "Vai piedāvājat dāvanu kartes?", answer: "Jā, pie mums var iegādāties dāvanu kartes par jebkuru summu. Tā ir lieliska dāvana svētkos!" },
            { question: "Vai apkalpojat bērnus?", answer: "Protams! Mums ir liela pieredze darbā ar bērniem, sākot no pirmsskolas vecuma. Meistari prot atrast pieeju mazajiem klientiem." },
            { question: "Vai vīriešiem ir pieejams manikīrs?", answer: "Jā, mēs veicam vīriešu manikīru un pedikīru, kā arī sejas kopšanas procedūras." },
            { question: "Cik iepriekš jāpiesakās?", answer: "Mēs iesakām pierakstīties 2-3 dienas iepriekš, bet bieži varam atrast brīvu vietu arī tajā pašā dienā. Zvaniet +371 27580047!" }
          ]
        }
      ]
    },
    terms: {
      title: "Lietošanas Noteikumi",
      content: "Laipni lūdzam salonā Aneri. Veicot pierakstu, Jūs piekrītat mūsu noteikumiem: \n1. Lūdzam ierasties laicīgi. Kavēšanās vairāk par 15 minūtēm var izraisīt vizītes atcelšanu.\n2. Pieraksta atcelšana vēlama vismaz 24 stundas iepriekš.\n3. Salons patur tiesības atteikt pakalpojumu personām, kuras neievēro higiēnas normas vai uzvedas neadekvāti."
    },
    privacy: {
      title: "Privātuma Politika",
      content: "Salons Aneri apstrādā Jūsu datus tikai pieraksta nodrošināšanai: \n1. Mēs apkopojam tikai vārdu un tālruņa numuru.\n2. Jūsu dati netiek nodoti trešajām personām."
    },
    footer: {
      addressLabel: "Adrese",
      phoneLabel: "Zvanīt",
      hoursLabel: "Darba laiks",
      hours: "P.-S.: 09:00 - 20:00 | Sv.: 10:00 - 16:00",
      copyright: "Salons Aneri. Visas tiesības aizsargātas.",
      quickLinks: "Saites",
      termsLabel: "Noteikumi",
      privacyLabel: "Privātums",
    },
    cookie: {
      text: "Mēs izmantojam sīkdatnes labākai pieredzei.",
      btn: "Labi",
      declineBtn: "Noraidīt",
    },
  },
  ru: {
    meta: {
      title: "Прайс-лист - Салон Aneri в Кенгарагсе | Цены на стрижки, Маникюр, Солярий",
      description: "Полный прайс-лист услуг салона Aneri. Стрижки для женщин, мужчин, детей и пенсионеров. Маникюр, педикюр, ваксация, перманентный макияж и солярий.",
      keywords: "парикмахерская рига, парикмахерская кенгарагс, цены на стрижки, маникюр рига, гель-лак, педикюр цена, ваксация рига, глубокое бикини, пилинг лица, перманентный макияж брови губы, солярий кенгарагс, мужская стрижка, детская стрижка, покраска волос airtouch, салон красоты рига",
    },
    nav: {
      home: "Главная",
      services: "Услуги",
      prices: "Прайс-лист",
      gallery: "Галерея",
      contacts: "Контакты",
      faq: "Вопросы",
      bookBtn: "Запись",
      installApp: "Установить приложение",
    },
    hero: {
      title: "Salons Aneri",
      subText: "Ваш оазис красоты и комфорта в Кенгарагсе. Профессиональная команда, уютная атмосфера и высокое качество в каждой детали.",
      cta: "Записаться",
    },
    services: {
      title: "Наши Услуги",
      items: [
        {
          id: "hair",
          title: "Парикмахерские услуги",
          description: "Стрижки, окрашивание и уход для дам, мужчин и детей.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "nails",
          title: "Маникюр и Педикюр",
          description: "Классический и аппаратный маникюр, педикюр, покрытие Gelish.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "cosmetology",
          title: "Косметология и Пилинги",
          description: "Чистка лица, мезотерапия, крио-процедуры и пилинги.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "permanent",
          title: "Перманентный макияж",
          description: "Стойкий макияж для бровей, губ и линии глаз.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "waxing",
          title: "Ваксация",
          description: "Гладкая кожа для всех зон: лицо, руки, ноги, бикини.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "solarium",
          title: "Солярий",
          description: "Профессиональный вертикальный солярий для красивого загара.",
          longDescription: "",
          keywords: [],
          image: ""
        }
      ],
    },
    prices: {
      title: "Цены на услуги",
      description: "Салон Aneri предлагает широкий спектр услуг красоты по доступным ценам в самом сердце Кенгарагса.",
      disclaimer: "* Указанные цены являются ориентировочными. Точная стоимость согласовывается с мастером перед началом работы. Расчет только наличными.",
      sections: [
        {
          id: "hair",
          sectionTitle: "1. Парикмахерские услуги",
          categories: [
            {
              title: "Дамам",
              services: [
                { name: "Стрижка (короткие волосы)", price: "от 22.00 €" },
                { name: "Стрижка (средние волосы)", price: "от 25.00 €" },
                { name: "Стрижка (длинные волосы)", price: "от 28.00 €" },
                { name: "Укладка волос", price: "20.00 - 30.00 €" },
                { name: "Стрижка + Укладка", price: "25.00 - 50.00 €" },
                { name: "Укладка на бигуди", price: "18.00 - 40.00 €" },
                { name: "Вечерняя прическа", price: "30.00 - 50.00 €" },
                { name: "Окрашивание в 1 тон (работа)", price: "22.00 - 40.00 €" },
                { name: "Мелирование на фольгу (работа)", price: "28.00 - 70.00 €" },
                { name: "Мелирование на шапочку (работа)", price: "25.00 - 40.00 €" },
                { name: "Колорирование", price: "30.00 - 90.00 €" },
                { name: "Химическая завивка", price: "35.00 - 65.00 €" },
                { name: "Био-завивка", price: "45.00 - 75.00 €" },
                { name: "Мытье и сушка", price: "12.00 - 18.00 €" },
                { name: "Стрижка челки", price: "3.00 - 7.00 €" },
                { name: "Кератиновое выпрямление 'GLOBAL' (короткие)", price: "55.00 - 65.00 €" },
                { name: "Кератиновое выпрямление 'GLOBAL' (средние)", price: "70.00 - 90.00 €" },
                { name: "Кератиновое выпрямление 'GLOBAL' (длинные)", price: "95.00 - 110.00 €" },
              ]
            },
            {
              title: "Мужчинам",
              services: [
                { name: "Мужская стрижка", price: "16.00 - 18.00 €" },
                { name: "Укладка волос", price: "6.00 - 8.00 €" },
                { name: "Стрижка под ноль", price: "12.00 - 14.00 €" },
                { name: "Стрижка машинкой", price: "14.00 - 16.00 €" },
              ]
            },
            {
              title: "Пенсионерам (от 65 лет)",
              services: [
                { name: "Стрижка", price: "14.00 - 15.00 €" },
                { name: "Укладка", price: "14.00 - 15.00 €" },
                { name: "Химическая завивка", price: "35.00 - 50.00 €" },
                { name: "Покраска", price: "15.00 - 20.00 €" },
              ]
            },
            {
              title: "Детям",
              services: [
                { name: "Дошкольники", price: "14.00 €" },
                { name: "Школьники (до 16 лет)", price: "15.00 €" },
              ]
            }
          ]
        },
        {
          id: "nails",
          sectionTitle: "2. Маникюр и Педикюр",
          categories: [
            {
              title: "Маникюр",
              services: [
                { name: "Классический (без лака)", price: "16.00 €" },
                { name: "Классический (с лаком)", price: "18.00 €" },
                { name: "Мужской маникюр", price: "20.00 €" },
                { name: "Покрытие ногтей лаком", price: "5.00 €" },
                { name: "Классический маникюр + Гель-лак", price: "28.00 €" },
                { name: "Гель-лак (Френч)", price: "30.00 €" },
                { name: "Снятие гель-лака (при новом покрытии)", price: "Бесплатно" },
                { name: "Снятие гель-лака (отдельно)", price: "от 5.00 €" },
                { name: "Реставрация ногтя", price: "3.00 - 5.00 €" },
                { name: "Экспресс-маникюр + Гель-лак", price: "20.00 €" },
                { name: "Покраска ресниц", price: "5.00 €" },
                { name: "Покраска бровей", price: "5.00 €" },
                { name: "Коррекция бровей", price: "5.00 - 7.00 €" },
              ]
            },
            {
              title: "Педикюр",
              services: [
                { name: "Классический педикюр", price: "30.00 - 32.00 €" },
                { name: "Аппаратный педикюр", price: "30.00 - 32.00 €" },
                { name: "Мужской педикюр", price: "35.00 €" },
                { name: "Педикюр + Гель-лак", price: "36.00 €" },
                { name: "Педикюр + Гель-лак (Френч)", price: "38.00 €" },
                { name: "Экспресс-педикюр", price: "24.00 €" },
                { name: "Экспресс-педикюр + Гель-лак", price: "28.00 €" },
                { name: "Экспресс-педикюр + Гель-лак (Френч)", price: "30.00 €" },
              ]
            }
          ]
        },
        {
          id: "cosmetology",
          sectionTitle: "3. Косметология и Пилинги",
          categories: [
            {
              title: "Косметические процедуры",
              services: [
                { name: "Консультация (15 min)", price: "Бесплатно" },
                { name: "Криомассаж лица (10-15 мин)", price: "от 15.00 €" },
                { name: "Криодеструкция (удаление папиллом)", price: "от 15.00 €" },
                { name: "Лимфодренажный массаж лица (60 мин)", price: "50.00 €" },
                { name: "Чистка лица с УЗ (60 мин)", price: "от 40.00 €" },
                { name: "Механическая чистка + УЗ (90 мин)", price: "от 45.00 €" },
                { name: "Мезотерапия (40 мин)", price: "от 50.00 €" },
                { name: "Прокол ушей (одна серьга)", price: "10.00 €" },
                { name: "Прокол ушей (две серьги)", price: "15.00 €" },
              ]
            },
            {
              title: "Пилинги",
              services: [
                { name: "Миндальный, фитиновый или молочный пилинг (60 min)", price: "от 40.00 €" },
                { name: "Mela Peel (против пигментации)", price: "40.00 €" },
                { name: "Cosmo Peel (омоложение)", price: "50.00 €" },
                { name: "PRX-T33 (2ml)", price: "60.00 €" },
              ]
            }
          ]
        },
        {
          id: "permanent",
          sectionTitle: "4. Перманентный макияж",
          categories: [
            {
              title: "Процедуры",
              services: [
                { name: "Губы", price: "130.00 €" },
                { name: "Брови", price: "130.00 €" },
                { name: "Линия ресниц (межресничка)", price: "130.00 €" },
                { name: "Декоративная линия ресниц с растушевкой", price: "130.00 €" },
                { name: "Коррекция всех зон", price: "90.00 €" },
                { name: "Обновление в течение 1 года", price: "100.00 €" },
              ]
            }
          ]
        },
        {
          id: "waxing",
          sectionTitle: "5. Ваксация (Депиляция)",
          categories: [
            {
              title: "Зоны",
              services: [
                { name: "Зона лица", price: "7.00 - 12.00 €" },
                { name: "Подмышки", price: "10.00 - 12.00 €" },
                { name: "Руки", price: "12.00 - 18.00 €" },
                { name: "Ноги до колен", price: "15.00 - 20.00 €" },
                { name: "Ноги по всей длине", price: "18.00 - 25.00 €" },
                { name: "Бикини (классическое)", price: "14.00 - 18.00 €" },
                { name: "Бикини (глубокое)", price: "25.00 - 30.00 €" },
              ]
            }
          ]
        },
        {
          id: "solarium",
          sectionTitle: "6. Солярий",
          categories: [
            {
              title: "Посещение / Абонемент",
              services: [
                { name: "6 мин", price: "4.00 € / 28.00 € (10x)" },
                { name: "9 мин", price: "4.50 € / 31.50 € (10x)" },
                { name: "12 мин", price: "5.00 € / 35.00 € (10x)" },
                { name: "15 мин", price: "5.50 € / 38.50 € (10x)" },
                { name: "18 мин", price: "6.00 € / 42.00 € (10x)" },
                { name: "21 мин", price: "6.50 € / 45.50 € (10x)" },
                { name: "24 мин", price: "7.00 € / 49.00 € (10x)" },
              ]
            }
          ]
        }
      ]
    },
    gallery: {
      title: "Галерея наших работ",
      description: "Взгляните на результаты работы наших мастеров.",
      categories: [],
      showMore: "Показать больше",
      instagramBtn: "Наш Instagram"
    },
    advantages: {
      title: "Наши преимущества",
      items: ["Опыт более 15 лет", "Уютная атмосфера", "Бесплатная парковка", "В сердце Кенгарагса"],
    },
    faq: {
      title: "Частые Вопросы",
      description: "Полезная информация для вашего визита в наш салон.",
      categories: [
        {
          categoryTitle: "Локация и транспорт",
          items: [
            { question: "Есть ли у вас парковка?", answer: "Да, прямо перед входом в салон для наших клиентов есть бесплатная частная парковка." },
            { question: "Как до вас доехать?", answer: "Мы находимся на ул. Латгалес 264. К нам идет 7-й трамвай или автобусы 15, 18, 31, 49, 60 (остановка ТЦ Доле)." }
          ]
        },
        {
          categoryTitle: "Процедуры и Безопасность",
          items: [
            { question: "Делаете ли вы сложные окрашивания?", answer: "Да, наши мастера выполняют сложные техники: Airtouch, Balayage, Шатуш. Точная цена и время определяются на консультации." },
            { question: "Какую косметику вы используете?", answer: "Мы работаем только с сертифицированной профессиональной косметикой от ведущих брендов, что гарантирует качество и безопасность." },
            { question: "Безопасен ли солярий?", answer: "Мы регулярно меняем лампы и следим за их ресурсом, чтобы загар был эффективным и безопасным в соответствии с нормами ЕС." }
          ]
        },
        {
          categoryTitle: "Услуги и Оплата",
          items: [
            { question: "Можно ли платить картой?", answer: "Нет, мы принимаем только наличные (Euro)." },
            { question: "Есть ли подарочные карты?", answer: "Да, вы можете приобрести подарочную карту на любую сумму. Это отличный подарок для близких!" },
            { question: "Вы стрижете детей?", answer: "Конечно! У нас большой опыт работы с детьми любого возраста. Мастера умеют найти подход даже к самым маленьким." },
            { question: "Делаете ли вы мужской маникюр?", answer: "Да, мы предлагаем мужской маникюр, педикюр и уход за лицом." },
            { question: "Нужно ли записываться заранее?", answer: "Желательно за 2-3 дня, но часто мы можем найти окошко и в день обращения. Звоните +371 27580047!" }
          ]
        }
      ]
    },
    terms: { title: "Правила посещения", content: "Просим приходить вовремя. Опоздание более чем на 15 минут может привести к отмене записи.\nОтмена записи желательна минимум за 24 часа." },
    privacy: { title: "Политика конфиденциальности", content: "Салон Aneri использует ваши данные только для записи. Данные не передаются третьим лицам." },
    footer: {
      addressLabel: "Адрес",
      phoneLabel: "Звонок",
      hoursLabel: "Время работы",
      hours: "Пн-Сб: 09:00 - 20:00 | Вс: 10:00 - 16:00",
      copyright: "Салон Aneri. Все права защищены.",
      quickLinks: "Ссылки",
      termsLabel: "Правила",
      privacyLabel: "Приватность",
    },
    cookie: { text: "Мы используем куки для вашего удобства.", btn: "ОК", declineBtn: "Отказаться" },
  },
  en: {
    meta: {
      title: "Price List - Aneri Salon Riga | Haircuts, Manicure, Solarium",
      description: "Full service price list for Aneri Salon. Haircuts for women, men, and kids. Manicure, pedicure, waxing, permanent makeup and solarium in Riga.",
      keywords: "hair salon riga, beauty salon kengarags, hairdresser riga, manicure cost, gel polish, pedicure, waxing riga, brazilian wax, facial peel, permanent makeup riga, solarium kengarags, mens haircut, kids haircut, hair coloring airtouch, local beauty salon",
    },
    nav: {
      home: "Home",
      services: "Services",
      prices: "Prices",
      gallery: "Gallery",
      contacts: "Contact",
      faq: "FAQ",
      bookBtn: "Call",
      installApp: "Install App",
    },
    hero: {
      title: "Aneri Salon",
      subText: "Your oasis of beauty in Kengarags, Riga. Professional team, cozy atmosphere, and high quality in every detail.",
      cta: "Book Appointment",
    },
    services: {
      title: "Our Services",
      items: [
        {
          id: "hair",
          title: "Hairdressing",
          description: "Haircuts, coloring and styling for ladies, gentlemen and kids.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "nails",
          title: "Manicure & Pedicure",
          description: "Classic and hardware manicure, pedicure, Gelish coating.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "cosmetology",
          title: "Cosmetology & Peels",
          description: "Facial cleansing, mesotherapy, cryo procedures and peels.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "permanent",
          title: "Permanent Makeup",
          description: "Long-lasting makeup for eyebrows, lips and eyelines.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "waxing",
          title: "Waxing",
          description: "Smooth skin for all areas: face, arms, legs, bikini.",
          longDescription: "",
          keywords: [],
          image: ""
        },
        {
          id: "solarium",
          title: "Solarium",
          description: "Professional vertical solarium for a beautiful tan.",
          longDescription: "",
          keywords: [],
          image: ""
        }
      ],
    },
    prices: {
      title: "Our Pricing",
      description: "Aneri Salon offers a wide range of beauty services at competitive prices.",
      disclaimer: "* Prices are approximate and will be confirmed with the master before service. Cash payments only.",
      sections: [
        {
          id: "hair",
          sectionTitle: "1. Hairdressing Services",
          categories: [
            {
              title: "Ladies",
              services: [
                { name: "Haircut (short hair)", price: "from 22.00 €" },
                { name: "Haircut (medium hair)", price: "from 25.00 €" },
                { name: "Haircut (long hair)", price: "from 28.00 €" },
                { name: "Hair styling", price: "20.00 - 30.00 €" },
                { name: "Haircut + Styling", price: "25.00 - 50.00 €" },
                { name: "Evening hairstyle", price: "30.00 - 50.00 €" },
                { name: "Coloring 1 tone (work)", price: "22.00 - 40.00 €" },
                { name: "Highlighting foil (work)", price: "28.00 - 70.00 €" },
                { name: "Perm", price: "35.00 - 65.00 €" },
                { name: "Bio-perm", price: "45.00 - 75.00 €" },
                { name: "Keratin straightening 'GLOBAL'", price: "55.00 - 110.00 €" },
              ]
            },
            {
              title: "Gentlemen",
              services: [
                { name: "Men's haircut", price: "16.00 - 18.00 €" },
                { name: "Machine cut", price: "14.00 - 16.00 €" },
                { name: "Zero cut", price: "12.00 - 14.00 €" },
              ]
            },
            {
              title: "Pensioners (65+)",
              services: [
                { name: "Haircut", price: "14.00 - 15.00 €" },
                { name: "Perm", price: "35.00 - 50.00 €" },
              ]
            },
            {
              title: "Kids",
              services: [
                { name: "Preschoolers", price: "14.00 €" },
                { name: "School children (up to 16)", price: "15.00 €" },
              ]
            }
          ]
        },
        {
          id: "nails",
          sectionTitle: "2. Manicure & Pedicure",
          categories: [
            {
              title: "Manicure",
              services: [
                { name: "Classic (no polish)", price: "16.00 €" },
                { name: "Classic (with polish)", price: "18.00 €" },
                { name: "Men's manicure", price: "20.00 €" },
                { name: "Classic + Gelish", price: "28.00 €" },
                { name: "Gelish (French)", price: "30.00 €" },
                { name: "Gelish removal", price: "from 5.00 €" },
              ]
            },
            {
              title: "Pedicure",
              services: [
                { name: "Classic/Hardware pedicure", price: "30.00 - 32.00 €" },
                { name: "Men's pedicure", price: "35.00 €" },
                { name: "Pedicure + Gelish", price: "36.00 €" },
              ]
            }
          ]
        },
        {
          id: "cosmetology",
          sectionTitle: "3. Cosmetology",
          categories: [
            {
              title: "Procedures",
              services: [
                { name: "Consultation", price: "Free" },
                { name: "Cryomassage", price: "from 15.00 €" },
                { name: "Facial cleansing (US)", price: "from 40.00 €" },
                { name: "Mesotherapy", price: "from 50.00 €" },
                { name: "Ear piercing", price: "10.00 - 15.00 €" },
              ]
            },
            {
              title: "Peels",
              services: [
                { name: "Almond/Lactic peel", price: "from 40.00 €" },
                { name: "PRX-T33", price: "60.00 €" },
              ]
            }
          ]
        },
        {
          id: "permanent",
          sectionTitle: "4. Permanent Makeup",
          categories: [
            {
              title: "Procedures",
              services: [
                { name: "Lips", price: "130.00 €" },
                { name: "Eyebrows", price: "130.00 €" },
                { name: "Eyeliner", price: "130.00 €" },
                { name: "Correction", price: "90.00 €" },
              ]
            }
          ]
        },
        {
          id: "waxing",
          sectionTitle: "5. Waxing",
          categories: [
            {
              title: "Zones",
              services: [
                { name: "Face", price: "7.00 - 12.00 €" },
                { name: "Armpits", price: "10.00 - 12.00 €" },
                { name: "Legs (full)", price: "18.00 - 25.00 €" },
                { name: "Bikini (deep)", price: "25.00 - 30.00 €" },
              ]
            }
          ]
        },
        {
          id: "solarium",
          sectionTitle: "6. Solarium",
          categories: [
            {
              title: "Visit / Subscription",
              services: [
                { name: "6 min", price: "4.00 €" },
                { name: "12 min", price: "5.00 €" },
                { name: "10x Subscription", price: "-30% discount" },
              ]
            }
          ]
        }
      ]
    },
    gallery: { title: "Our Gallery", description: "", categories: [], showMore: "Show more", instagramBtn: "Our Instagram" },
    advantages: { title: "Why Us?", items: ["Experience > 15 years", "Cozy atmosphere", "Free parking", "Heart of Kengarags"] },
    faq: { 
      title: "FAQ", 
      description: "Useful information for your visit.", 
      categories: [
        {
          categoryTitle: "Location & Transport",
          items: [
            { question: "Do you have parking?", answer: "Yes, we have free private parking right in front of the salon for our customers." },
            { question: "How to get to you?", answer: "We are at Latgales iela 264. You can take tram 7 or buses 15, 18, 31, 49, 60 (Dole stop)." }
          ]
        },
        {
          categoryTitle: "Procedures & Safety",
          items: [
            { question: "Do you do complex coloring?", answer: "Yes, our masters specialize in Airtouch, Balayage, Shatush. Exact price and time are determined during consultation." },
            { question: "What cosmetics do you use?", answer: "We use only professional certified cosmetics from leading brands." },
            { question: "Is the solarium safe?", answer: "We regularly change lamps and maintain equipment to ensure safe tanning according to EU standards." }
          ]
        },
        {
          categoryTitle: "Service & Payment",
          items: [
            { question: "Can I pay by card?", answer: "No, we accept cash only (Euro)." },
            { question: "Do you have gift cards?", answer: "Yes, gift cards of any amount are available." },
            { question: "Do you serve children?", answer: "Absolutely! We have great experience with kids of all ages." },
            { question: "Do you do men's manicure?", answer: "Yes, we offer men's manicure, pedicure, and facials." },
            { question: "Do I need to book?", answer: "Booking 2-3 days in advance is recommended, but walk-ins are welcome if we have free slots. Call +371 27580047!" }
          ]
        }
      ] 
    },
    terms: { title: "Terms", content: "Please be on time. Delays over 15 min may lead to cancellation." },
    privacy: { title: "Privacy", content: "We process your data for booking only." },
    footer: {
      addressLabel: "Address",
      phoneLabel: "Call",
      hoursLabel: "Working Hours",
      hours: "Mon-Sat: 09:00-20:00 | Sun: 10:00-16:00",
      copyright: "Aneri Salon. All rights reserved.",
      quickLinks: "Links",
      termsLabel: "Terms",
      privacyLabel: "Privacy",
    },
    cookie: { text: "We use cookies for the best experience.", btn: "Accept", declineBtn: "Decline" },
  },
};
