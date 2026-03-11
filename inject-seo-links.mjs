import fs from 'fs';

let content = fs.readFileSync('data/content.ts', 'utf8');

// lv
content = content.replace(
  /id: "permanent",\s*sectionTitle: "4. Permanentais grims",\s*categories: \[/g,
  `id: "permanent",\n          sectionTitle: "4. Permanentais grims",\n          seoLinks: [\n            { text: "Kā kopt permanento grimu?", url: "/article/permanent-makeup-care", articleId: "permanent-makeup-care" }\n          ],\n          categories: [`
);

// ru
content = content.replace(
  /id: "permanent",\s*sectionTitle: "4. Перманентный макияж",\s*categories: \[/g,
  `id: "permanent",\n          sectionTitle: "4. Перманентный макияж",\n          seoLinks: [\n            { text: "Уход за перманентным макияжем", url: "/ru/article/permanent-makeup-care", articleId: "permanent-makeup-care" }\n          ],\n          categories: [`
);

content = content.replace(
  /id: "waxing",\s*sectionTitle: "5. Ваксация \(Депиляция\)",\s*categories: \[/g,
  `id: "waxing",\n          sectionTitle: "5. Ваксация (Депиляция)",\n          seoLinks: [\n            { text: "Ваксация или лазерная эпиляция?", url: "/ru/article/waxing-vs-laser", articleId: "waxing-vs-laser" }\n          ],\n          categories: [`
);

// en
content = content.replace(
  /id: "cosmetology",\s*sectionTitle: "3. Cosmetology",\s*categories: \[/g,
  `id: "cosmetology",\n          sectionTitle: "3. Cosmetology",\n          seoLinks: [\n            { text: "Why You Need Facial Cleansing", url: "/en/article/facial-cleansing", articleId: "facial-cleansing" }\n          ],\n          categories: [`
);

content = content.replace(
  /id: "permanent",\s*sectionTitle: "4. Permanent Makeup",\s*categories: \[/g,
  `id: "permanent",\n          sectionTitle: "4. Permanent Makeup",\n          seoLinks: [\n            { text: "Permanent Makeup Aftercare", url: "/en/article/permanent-makeup-care", articleId: "permanent-makeup-care" }\n          ],\n          categories: [`
);

fs.writeFileSync('data/content.ts', content);

