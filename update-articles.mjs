import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'data', 'articles');

const mapping = {
  'haircare.ts': 'hair',
  'hair-loss.ts': 'hair',
  'keratin-vs-botox.ts': 'hair',
  'manicure-tips.ts': 'nails',
  'hardware-pedicure.ts': 'nails',
  'nail-trends.ts': 'nails',
};

const textMapping = {
  'lv': {
    'hair': 'Skatīt friziera pakalpojumu cenas',
    'nails': 'Skatīt manikīra un pedikīra cenas',
  },
  'ru': {
    'hair': 'Смотреть цены на парикмахерские услуги',
    'nails': 'Смотреть цены на маникюр и педикюр',
  },
  'en': {
    'hair': 'View Hairdressing Prices',
    'nails': 'View Manicure & Pedicure Prices',
  }
};

const langs = ['lv', 'ru', 'en'];

langs.forEach(lang => {
  const langDir = path.join(articlesDir, lang);
  if (!fs.existsSync(langDir)) return;
  
  const files = fs.readdirSync(langDir);
  files.forEach(file => {
    if (!file.endsWith('.ts')) return;
    
    const serviceId = mapping[file];
    if (!serviceId) return;
    
    const text = textMapping[lang][serviceId];
    const filePath = path.join(langDir, file);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('relatedService:')) {
      content = content.replace(/metaDescription: \`(.*?)\`,/, `metaDescription: \`$1\`,\n  relatedService: {\n    id: '${serviceId}',\n    text: '${text}'\n  },`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${lang}/${file}`);
    }
  });
});
