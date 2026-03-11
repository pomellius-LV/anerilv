import { Article, Language } from '../../types';

// Use Vite's import.meta.glob to automatically import all .ts files in the language subdirectories
const articleModules = import.meta.glob('./*/*.ts', { eager: true });

export const getArticlesForLanguage = (lang: Language): Article[] => {
  const articles: Article[] = [];
  
  for (const path in articleModules) {
    // path looks like './lv/haircare.ts'
    if (path.startsWith(`./${lang}/`)) {
      const module = articleModules[path] as { article: Article };
      if (module.article) {
        articles.push(module.article);
      }
    }
  }
  
  return articles;
};
