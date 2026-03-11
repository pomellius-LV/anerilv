import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'data', 'articles');

const newArticles = {
  'facial-cleansing': {
    service: 'cosmetology',
    lv: {
      title: 'Sejas tīrīšana: kāpēc tā ir nepieciešama un kādu veidu izvēlēties',
      metaTitle: 'Sejas tīrīšana Rīgā | Kosmetologs Ķengaragā | Salons Aneri',
      metaDescription: 'Uzziniet par dažādiem sejas tīrīšanas veidiem un to priekšrocībām. Profesionāla sejas kopšana un kosmetologa pakalpojumi Salons Aneri.',
      text: 'Skatīt kosmetoloģijas pakalpojumu cenas',
      content: 'Regulāra sejas tīrīšana ir pamats veselīgai, mirdzošai un jauneklīgai ādai. Ikdienā mūsu āda saskaras ar putekļiem, kosmētiku un pilsētas piesārņojumu, kas nosprosto poras un var izraisīt iekaisumus. Mājas apstākļos nav iespējams veikt tik dziļu attīrīšanu kā kosmetologa kabinetā. Salons Aneri piedāvā vairākus sejas tīrīšanas veidus: mehānisko, ultraskaņas un kombinēto. Mehāniskā tīrīšana ir ideāli piemērota problemātiskai ādai ar izteiktiem komedoniem. Ultraskaņas tīrīšana ir maiga un nesāpīga metode, kas lieliski noņem atmirušās šūnas un atsvaidzina sejas krāsu. Kombinētā tīrīšana apvieno abas metodes maksimālam rezultātam. Mūsu pieredzējušie kosmetologi Rīgā, Ķengaragā, palīdzēs izvēlēties tieši jūsu ādas tipam un stāvoklim piemērotāko procedūru. Pēc profesionālas tīrīšanas āda labāk elpo, un ikdienas kopšanas līdzekļi iedarbojas daudz efektīvāk.'
    },
    ru: {
      title: 'Чистка лица: зачем она нужна и какой вид выбрать',
      metaTitle: 'Чистка лица в Риге | Косметолог Кенгарагс | Салон Aneri',
      metaDescription: 'Узнайте о различных видах чистки лица и их преимуществах. Профессиональный уход за кожей и услуги косметолога в салоне Aneri.',
      text: 'Смотреть цены на услуги косметолога',
      content: 'Регулярная чистка лица — это основа здоровой, сияющей и молодой кожи. Ежедневно наша кожа сталкивается с пылью, косметикой и городским загрязнением, что забивает поры и может вызвать воспаления. В домашних условиях невозможно провести такое глубокое очищение, как в кабинете косметолога. Салон Aneri предлагает несколько видов чистки лица: механическую, ультразвуковую и комбинированную. Механическая чистка идеально подходит для проблемной кожи с выраженными комедонами. Ультразвуковая чистка — это мягкий и безболезненный метод, который отлично удаляет омертвевшие клетки и освежает цвет лица. Комбинированная чистка объединяет оба метода для максимального результата. Наши опытные косметологи в Риге, в Кенгарагсе, помогут выбрать процедуру, подходящую именно для вашего типа и состояния кожи. После профессиональной чистки кожа лучше дышит, а средства для ежедневного ухода действуют гораздо эффективнее.'
    },
    en: {
      title: 'Facial Cleansing: Why You Need It and Which Type to Choose',
      metaTitle: 'Facial Cleansing in Riga | Cosmetologist | Aneri Salon',
      metaDescription: 'Learn about the different types of facial cleansing and their benefits. Professional skin care and cosmetologist services at Aneri Salon.',
      text: 'View Cosmetology Prices',
      content: 'Regular facial cleansing is the foundation of healthy, glowing, and youthful skin. Every day, our skin faces dust, makeup, and urban pollution, which clogs pores and can cause breakouts. It is impossible to achieve the same deep cleansing at home as in a cosmetologist\'s office. Aneri Salon offers several types of facial cleansing: mechanical, ultrasonic, and combined. Mechanical cleansing is ideal for problem skin with pronounced comedones. Ultrasonic cleansing is a gentle and painless method that perfectly removes dead cells and refreshes the complexion. Combined cleansing combines both methods for maximum results. Our experienced cosmetologists in Riga, Kengarags, will help you choose the procedure that is right for your skin type and condition. After professional cleansing, the skin breathes better, and daily care products work much more effectively.'
    }
  },
  'permanent-makeup-care': {
    service: 'permanent',
    lv: {
      title: 'Permanentais grims: viss par kopšanu pēc procedūras',
      metaTitle: 'Permanentā grima kopšana | Permanentais grims Rīgā',
      metaDescription: 'Kā pareizi kopt uzacis, lūpas un acis pēc permanentā grima procedūras? Uzziniet svarīgākos noteikumus ilgnoturīgam rezultātam.',
      text: 'Skatīt permanentā grima cenas',
      content: 'Permanentais grims ir ērts veids, kā izskatīties nevainojami jebkurā diennakts laikā. Taču, lai rezultāts jūs priecētu ilgi un krāsa saglabātos vienmērīga, ļoti svarīga ir pareiza kopšana dzīšanas periodā. Pirmās dienas pēc procedūras apstrādāto zonu nedrīkst slapināt, kasīt vai plēst izveidojušos krevelīti. Tas var novest pie pigmenta zuduma un rētu veidošanās. Izvairieties no pirts, saunas, solārija un intensīviem treniņiem vismaz 10-14 dienas. Lūpu un uzacu zonai meistars ieteiks speciālas dziedējošas ziedes, kas jāuzklāj plānā kārtiņā. Salons Aneri meistari Rīgā strādā tikai ar augstākās kvalitātes pigmentiem un vienmēr sniedz detalizētas instrukcijas par kopšanu mājās. Atcerieties, ka galējais rezultāts ir redzams tikai pēc aptuveni mēneša, kad āda ir pilnībā atjaunojusies.'
    },
    ru: {
      title: 'Перманентный макияж: всё об уходе после процедуры',
      metaTitle: 'Уход за перманентным макияжем | Татуаж в Риге',
      metaDescription: 'Как правильно ухаживать за бровями, губами и веками после процедуры перманентного макияжа? Узнайте важные правила для стойкого результата.',
      text: 'Смотреть цены на перманентный макияж',
      content: 'Перманентный макияж — это удобный способ выглядеть безупречно в любое время суток. Однако, чтобы результат радовал вас долго, а цвет оставался равномерным, очень важен правильный уход в период заживления. В первые дни после процедуры обработанную зону нельзя мочить, чесать или сдирать образовавшуюся корочку. Это может привести к потере пигмента и образованию шрамов. Избегайте посещения бани, сауны, солярия и интенсивных тренировок как минимум 10-14 дней. Для зоны губ и бровей мастер порекомендует специальные заживляющие мази, которые нужно наносить тонким слоем. Мастера салона Aneri в Риге работают только с пигментами высочайшего качества и всегда дают подробные инструкции по домашнему уходу. Помните, что окончательный результат виден только примерно через месяц, когда кожа полностью восстановится.'
    },
    en: {
      title: 'Permanent Makeup: Everything About Aftercare',
      metaTitle: 'Permanent Makeup Aftercare | Tattooing in Riga',
      metaDescription: 'How to properly care for eyebrows, lips, and eyelids after a permanent makeup procedure? Learn the important rules for a long-lasting result.',
      text: 'View Permanent Makeup Prices',
      content: 'Permanent makeup is a convenient way to look flawless at any time of the day. However, for the result to please you for a long time and the color to remain even, proper care during the healing period is very important. In the first days after the procedure, the treated area must not be wetted, scratched, or the formed crust peeled off. This can lead to pigment loss and scarring. Avoid visiting baths, saunas, solariums, and intense workouts for at least 10-14 days. For the lip and eyebrow area, the master will recommend special healing ointments to be applied in a thin layer. The masters of Aneri Salon in Riga work only with the highest quality pigments and always provide detailed instructions for home care. Remember that the final result is visible only after about a month, when the skin has fully recovered.'
    }
  },
  'waxing-vs-laser': {
    service: 'waxing',
    lv: {
      title: 'Vaksācija pret lāzerepilāciju: kuru metodi izvēlēties',
      metaTitle: 'Vaksācija un epilācija Rīgā | Salons Aneri Ķengarags',
      metaDescription: 'Kāda ir atšķirība starp vaksāciju un lāzerepilāciju? Uzziniet abu metožu plusus un mīnusus, lai izvēlētos sev piemērotāko.',
      text: 'Skatīt vaksācijas pakalpojumu cenas',
      content: 'Gluda āda bez liekā apmatojuma ir daudzu sieviešu (un vīriešu) mērķis. Divas populārākās metodes šī mērķa sasniegšanai ir vaksācija un lāzerepilācija. Vaksācija ir ātra un pieejama metode, kas noņem matiņus ar visām saknēm. Rezultāts saglabājas no 3 līdz 6 nedēļām, un ar laiku matiņi kļūst plānāki un retāki. Tā ir lieliska izvēle tiem, kas vēlas tūlītēju rezultātu par saprātīgu cenu. Lāzerepilācija, savukārt, ir ilgtermiņa ieguldījums. Tā iznīcina matu folikulus, ievērojami samazinot apmatojuma augšanu nākotnē. Tomēr lāzerepilācijai nepieciešams kurss (parasti 6-8 procedūras), un tā var būt dārgāka. Salons Aneri Ķengaragā piedāvā profesionālu un maksimāli nesāpīgu vaksāciju ar augstas kvalitātes vaskiem, kas piemēroti pat visjutīgākajai ādai.'
    },
    ru: {
      title: 'Восковая депиляция против лазерной эпиляции: что выбрать',
      metaTitle: 'Ваксация и эпиляция в Риге | Салон Aneri Кенгарагс',
      metaDescription: 'В чем разница между восковой депиляцией (ваксацией) и лазерной эпиляцией? Узнайте плюсы и минусы обоих методов.',
      text: 'Смотреть цены на ваксацию',
      content: 'Гладкая кожа без лишних волос — цель многих женщин (и мужчин). Два самых популярных метода для достижения этой цели — восковая депиляция (ваксация) и лазерная эпиляция. Ваксация — это быстрый и доступный метод, который удаляет волосы с корнем. Результат сохраняется от 3 до 6 недель, а со временем волоски становятся тоньше и реже. Это отличный выбор для тех, кто хочет мгновенный результат по разумной цене. Лазерная эпиляция, в свою очередь, — это долгосрочная инвестиция. Она разрушает волосяные фолликулы, значительно уменьшая рост волос в будущем. Однако для лазерной эпиляции требуется курс (обычно 6-8 процедур), и она может быть дороже. Салон Aneri в Кенгарагсе предлагает профессиональную и максимально безболезненную ваксацию высококачественными восками, подходящими даже для самой чувствительной кожи.'
    },
    en: {
      title: 'Waxing vs. Laser Hair Removal: Which to Choose',
      metaTitle: 'Waxing and Epilation in Riga | Aneri Salon Kengarags',
      metaDescription: 'What is the difference between waxing and laser hair removal? Learn the pros and cons of both methods to choose the right one for you.',
      text: 'View Waxing Prices',
      content: 'Smooth skin without unwanted hair is the goal of many women (and men). The two most popular methods to achieve this goal are waxing and laser hair removal. Waxing is a fast and affordable method that removes hair from the root. The result lasts from 3 to 6 weeks, and over time the hairs become thinner and sparser. It is a great choice for those who want an immediate result at a reasonable price. Laser hair removal, on the other hand, is a long-term investment. It destroys hair follicles, significantly reducing hair growth in the future. However, laser hair removal requires a course (usually 6-8 procedures) and can be more expensive. Aneri Salon in Kengarags offers professional and maximally painless waxing with high-quality waxes suitable even for the most sensitive skin.'
    }
  },
  'solarium-rules': {
    service: 'solarium',
    lv: {
      title: 'Kā pareizi sauļoties solārijā: drošības noteikumi',
      metaTitle: 'Solārijs Rīgā | Droša sauļošanās | Salons Aneri',
      metaDescription: 'Uzziniet, kā pareizi un droši sauļoties solārijā, lai iegūtu skaistu iedegumu bez kaitējuma ādai. Ieteikumi no Salons Aneri.',
      text: 'Skatīt solārija cenas',
      content: 'Skaists un vienmērīgs iedegums izskatās pievilcīgi jebkurā gadalaikā. Tomēr, apmeklējot solāriju, ir svarīgi ievērot drošības noteikumus, lai nekaitētu ādai. Pirmkārt, vienmēr izmantojiet speciālo solārija kosmētiku – tā aizsargā ādu no izžūšanas un palīdz iegūt dziļāku, noturīgāku iedegumu. Parastie saules aizsargkrēmi solārijā neder! Otrkārt, sāciet ar īsiem seansiem (3-5 minūtes), īpaši, ja jums ir gaiša āda, un pakāpeniski palieliniet laiku. Starp seansiem jābūt vismaz 48 stundu pārtraukumam. Neaizmirstiet par aizsargbrillēm acīm un uzlīmēm dzimumzīmēm un krūšu galiem. Salons Aneri Ķengaragā piedāvā modernu un drošu solāriju ar regulāri mainītām lampām, lai jūsu iedegums būtu ne tikai skaists, bet arī veselīgs.'
    },
    ru: {
      title: 'Как правильно загорать в солярии: правила безопасности',
      metaTitle: 'Солярий в Риге | Безопасный загар | Салон Aneri',
      metaDescription: 'Узнайте, как правильно и безопасно загорать в солярии, чтобы получить красивый загар без вреда для кожи. Рекомендации от салона Aneri.',
      text: 'Смотреть цены на солярий',
      content: 'Красивый и ровный загар выглядит привлекательно в любое время года. Однако при посещении солярия важно соблюдать правила безопасности, чтобы не навредить коже. Во-первых, всегда используйте специальную косметику для солярия — она защищает кожу от пересыхания и помогает получить более глубокий и стойкий загар. Обычные солнцезащитные кремы в солярии не подходят! Во-вторых, начинайте с коротких сеансов (3-5 минут), особенно если у вас светлая кожа, и постепенно увеличивайте время. Между сеансами должен быть перерыв не менее 48 часов. Не забывайте про защитные очки для глаз и стикини для родинок и сосков. Салон Aneri в Кенгарагсе предлагает современный и безопасный солярий с регулярно меняемыми лампами, чтобы ваш загар был не только красивым, но и здоровым.'
    },
    en: {
      title: 'How to Tan Safely in a Solarium: Safety Rules',
      metaTitle: 'Solarium in Riga | Safe Tanning | Aneri Salon',
      metaDescription: 'Learn how to tan correctly and safely in a solarium to get a beautiful tan without harming your skin. Recommendations from Aneri Salon.',
      text: 'View Solarium Prices',
      content: 'A beautiful and even tan looks attractive at any time of the year. However, when visiting a solarium, it is important to follow safety rules so as not to harm the skin. First, always use special solarium cosmetics—it protects the skin from drying out and helps to get a deeper, longer-lasting tan. Regular sunscreens do not work in a solarium! Second, start with short sessions (3-5 minutes), especially if you have light skin, and gradually increase the time. There should be a break of at least 48 hours between sessions. Do not forget about protective goggles for the eyes and stickers for moles and nipples. Aneri Salon in Kengarags offers a modern and safe solarium with regularly changed lamps so that your tan is not only beautiful but also healthy.'
    }
  }
};

const langs = ['lv', 'ru', 'en'];

Object.entries(newArticles).forEach(([articleId, data]) => {
  langs.forEach(lang => {
    const langData = data[lang];
    const fileContent = `import { Article } from '../../../types';

export const article: Article = {
  id: '${articleId}',
  title: \`${langData.title}\`,
  metaTitle: \`${langData.metaTitle}\`,
  metaDescription: \`${langData.metaDescription}\`,
  relatedService: {
    id: '${data.service}',
    text: '${langData.text}'
  },
  content: \`${langData.content}\`
};
`;
    const filePath = path.join(articlesDir, lang, `${articleId}.ts`);
    fs.writeFileSync(filePath, fileContent);
    console.log(`Created ${filePath}`);
  });
});
